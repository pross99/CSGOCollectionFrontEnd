import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        items: [],
        collections: [],
        isLoading: true
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

         SET_ITEMS(state, items) {
            state.items = items
        },

        SET_LOADING(state, loading) {
            state.isLoading = loading
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
                console.log(collectionResponse)
                commit('SET_COLLECTIONS', collectionResponse.data)
                commit('SET_ITEMS', itemResponse.data)
            } catch(error) {
                console.error('err', error)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async addCollection({commit}, formData) {
            const newCollection = {
                 itemId: formData.itemId,
                    wear: formData.wear,
                 float: formData.float,
                 userName: formData.userName,
                statTrack: formData.statTrack,
                  estimatedPrice: formData.estimatedPrice
            };
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
            return state.items
        },

        isLoading(state) {
            return state.isLoading
        }
    }
})