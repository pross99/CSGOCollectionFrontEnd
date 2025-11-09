import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        items: [],
        collections: [],
        isLoading: true,
        searchLoading: false,
        searchResults: [],
        price: null
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
        },

        CLEAR_SEARCH_RESULTS(state) {
            state.searchResults = {data: []}
        },
        SET_PRICE(state,price) {
            state.price = price
        },
        UPDATE_COLLECTION_PRICE(state, {collectionIndex, estimatedPrice}) {
            state.collections[collectionIndex].estimatedPrice = estimatedPrice
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

        async priceFromExternalAPI({commit,state}, collection) {
           try {
        let collectionNameAdjustforAPi = collection.wear
        const checkStatTrack = collection.statTrack

        // Normalize wear for API naming
        if (
          collection.wear === 'Field Tested' ||
          collection.wear === 'Well Worn' ||
          collection.wear === 'Battle Scarred'
        ) {
          collectionNameAdjustforAPi = collection.wear.trim().replace(/\s+/g, '-')
        }

         if (checkStatTrack) {
          collection.itemName = `StatTrak™ ${collection.itemName}`
        }

        // Fetch from external API
        const priceApiResponse = await axios.get('https://skin.broker/api/v1/item', {
          params: {
            key: import.meta.env.VITE_API,
            marketHashName: `${collection.itemName} (${collectionNameAdjustforAPi})`
          }
        })


         const fetchedPrice =
          priceApiResponse.data?.price?.skinport?.original?.price || 0

        // Update store state
        commit('SET_PRICE', fetchedPrice)

        // Optionally update that specific collection’s estimated price
        const collectionIndex = state.collections.findIndex(
          (c) => c._id === collection._id
        )
        if (collectionIndex !== -1) {
          commit('UPDATE_COLLECTION_PRICE', {
            collectionIndex,
            estimatedPrice: fetchedPrice
          })

          await axios.put(
                `https://csgocollectionbackend.onrender.com/api/collection/${collection._id}`,
                {
                    ...state.collections[collectionIndex],
                    estimatedPrice: fetchedPrice
                }
            )
        }

        return fetchedPrice
      } catch (error) {
        console.error('Error fetching price:', error.message)
        commit('SET_PRICE', 'Error')
        return null
        }
    },


        async searchItem({commit}, query) {

             commit('SET_SEARCH_LOADING', true);
            try{
                const searchResponse = await axios.get(`https://csgocollectionbackend.onrender.com/api/item/search?q=${query}`)
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
                return {...col, itemName: item.name ?? 'Unknown', image: item.image ?? null, case: item.crates[0].name, minFloat: item.min_float ?? 0, maxFloat: item.max_float ?? 1}
            })
        },
        collectionByBool: (state, getters) => (key, value = true) => {
         return getters.collectionWithImagefromItem.filter(col => col[key] === value);
    },
        collectionsStats: (state) => (collection) => {

              const items = Array.isArray(collection) ? collection : collection.value;
              if (!items || items.length === 0) {
                 return {
                    total: 0,
                        };
                }

        const stats = {
            total: items.length,
            totalValue: 0,
            totalBlues: 0,
            totalPurples: 0,
            totalPinks: 0,
            totalReds: 0,
            totalStatTracks: 0,
        }

        items.forEach(item => {
            
            if(item.estimatedPrice) {
                stats.totalValue += item.estimatedPrice
            }

            if(item.rarity === 'Mil-Spec Grade'){
                stats.totalBlues++
            }

             if(item.rarity === 'Restricted'){
                stats.totalPurples++
            }
             if(item.rarity === 'Classified'){
                stats.totalPinks++
            }
             if(item.rarity === 'Covert'){
                stats.totalReds++
            }
             if(item.statTrack){
                stats.totalStatTracks++
            }
        });
        console.log("stats!", stats)
        return stats
    },
    

 
    },        
})