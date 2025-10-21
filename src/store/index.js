import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        items: [],
        collections: [],
        isLoading: true,
        searchLoading: false,
        searchResults: []
    },
    mutations: {
        SET_COLLECTIONS(state, collections) {
            state.collections = collections
        },

        ADD_COLLECTION(state, collection) {
            state.collections.push(collection)
        },
        UPDATE_COLLECTION(state, {id, newData}) {
            const index = state.collections.findIndex(collection => collection._id === id)
            if (index !== -1) Object.assign(state.collections[index], newData)
        },

        DELETE_COLLECTION(state, {id}) {
            const index = state.collections.findIndex(collection => collection._id === id)
            if (index !== -1) state.collections.splice(index, 1)
        },

         SET_ITEMS(state, items) {
            state.items = items
        },

        SET_LOADING(state, loading) {
            state.isLoading = loading
        },

        SET_SEARCHRESULTS(state, searchResults) {
            state.searchResults = searchResults
        },

        SET_SEARCH_LOADING(state, loading) {
            state.searchLoading = loading
        }
    },

    actions: {
        async getCollections({commit, dispatch, state}) {
            if(state.collections.length > 0) {
                return;
            }

            commit('SET_LOADING', true);
            try {
                const collectionResponse = await axios.get(`https://csgocollectionbackend.onrender.com/api/collection`)
                const itemResponse = await axios.get(`https://csgocollectionbackend.onrender.com/api/item`)
                console.log("items", itemResponse)
                commit('SET_COLLECTIONS', collectionResponse.data)
                commit('SET_ITEMS', itemResponse.data)
            } catch(error) {
                console.error('err', error)
            } finally {
                commit('SET_LOADING', false)
            }
        },


        async searchItem({commit}, query) {

             commit('SET_SEARCH_LOADING', true);
            try{
                const searchResponse = await axios.get(`https://csgocollectionbackend.onrender.com/api/item/search?q=${query}`)

                console.log("sResults", searchResponse)
                commit('SET_SEARCHRESULTS', searchResponse)
            } catch(error) {
                console.error('err')
            } finally {
                commit('SET_SEARCH_LOADING', false)
            }
        },

        async addCollection({commit}, formData) {
            const newCollection = {
                userName: formData.userName,
                 itemId: formData.itemId,
                wear: formData.wear,
                 float: formData.float,
                statTrack: formData.statTrack,
                  estimatedPrice: formData.estimatedPrice,
                  rarity: formData.rarity
            };

            console.log(newCollection)
            const response = await axios.post(`https://csgocollectionbackend.onrender.com/api/collection`, newCollection)
            commit('ADD_COLLECTION', response.data)
            return response.data;
        },

        async updateCollection({commit}, formData) {
            const updateCollectionObject = {
                itemId: formData.itemId,
                    wear: formData.wear,
                 float: formData.float,
                 userName: formData.userName,
                statTrack: formData.statTrack,
                  estimatedPrice: formData.estimatedPrice
            }
            const response = await axios.put(`https://csgocollectionbackend.onrender.com/api/collection/${formData.id}`, updateCollectionObject)
            commit('UPDATE_COLLECTION', {id: formData.id, newData: response.data})
            return response.data
        },

        async deleteCollection({commit}, {id}) {
          
            const deleteResponse = await axios.delete(`https://csgocollectionbackend.onrender.com/api/collection/delete/${id}`)
            commit('DELETE_COLLECTION', {id: id})
            return deleteResponse.data
        },

        async refreshCollections({dispatch}) {
            await dispatch('getCollections')
        }
    },

    getters: {
        collections(state) {
           return state.collections.map(col => {
            return col
           })
        },

        items(state) {
            return state.items.map(item => {
                return item
            })
        },

        searchResults(state) {
            return state.searchResults
        },

        isLoading(state) {
            return state.isLoading
        },

        collectionWithImagefromItem(state) {
            return state.collections.map(col => {
                const item = state.items.find(i => String(i.id) === String(col.itemId)) ?? {};
                return {...col, itemName: item.name ?? 'Unknown', image: item.image ?? null}
            })
        },
        collectionByBool: (state, getters) => (key, value = true) => {
         return getters.collectionWithImagefromItem.filter(col => col[key] === value);
    }
    },

    


        
})