<script setup>
import { ref, onMounted, onUpdated, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import Item from './Item.vue';
import Search from './Search.vue';
import Statistics from './Statistics.vue';

const store = useStore()
const activeUser = ref('Pede')

onMounted(async() => {
    if (!store.state.collections || store.state.collections.length === 0) {
     await store.dispatch('getCollections')
     await fetchAllPrices()
  }
})

// get price if new item is added from modal component
watch(
    () => store.state.collections.length,
    async (newLength, oldLength) => {
        // Only fetch prices when new items are added
        if (newLength > oldLength) {
            console.log('New collection added, fetching prices...')
            await fetchAllPrices()
        }
    }
)



const emit = defineEmits(['add']);
const isLoading = computed(() => store.getters.isLoading);

const updateCollection = (id, newData)  => {
    store.commit('UPDATE_COLLECTION', { id,newData})
};

const deleteCollection = (id) => {
    store.commit('DELETE_COLLECTION', {id})
}
const peterCollection = computed(() => {

const items = store.getters.collectionByString('userName', 'Pede')
return Object.values(items).sort((a,b) => b.estimatedPrice - a.estimatedPrice)
});

const vinneCollection = computed(() => {
const items = store.getters.collectionByString('userName', 'Vinne')
return Object.values(items).sort((a,b) => b.estimatedPrice - a.estimatedPrice)
})
const bimsCollection = computed(() => {
const items = store.getters.collectionByString('userName', 'Bims')
return Object.values(items).sort((a,b) => b.estimatedPrice - a.estimatedPrice)
})


const statisticsPeter = computed(() => store.getters.collectionsStats(peterCollection))
const statisticsVinne = computed(() => store.getters.collectionsStats(vinneCollection))
const statisticsBims = computed(() => store.getters.collectionsStats(bimsCollection))

const activeCollection = computed(() => {
    switch(activeUser.value) {
        case 'Pede':
            return peterCollection.value
        case 'Vinne':
            return vinneCollection.value
        case 'Bims':
            return bimsCollection.value
        default:
        return []
    }
})

const activeStatistics = computed(() => {
      switch(activeUser.value) {
        case 'Pede':
            return store.getters.collectionsStats(peterCollection)
        case 'Vinne':
            return store.getters.collectionsStats(vinneCollection)
        case 'Bims':
            return store.getters.collectionsStats(bimsCollection)
        default:
            return null
    }
})


const fetchAllPrices = async () => {
    const collections = store.state.collections
    
    for (const collection of collections) {
        // Get the full collection data with item details
        const fullCollection = store.getters.collectionWithImagefromItem.find(
            c => c._id === collection._id
        )
        
        if (fullCollection && fullCollection.itemName !== 'Unknown') {
            await store.dispatch('priceFromExternalAPI', fullCollection)
        }
    }
}

const setActiveUser = (userName) => {
    activeUser.value = userName
}
</script>

<template>
    <div class="il-top-container">
        <div class="top-top">
            <Search/>
        </div>
        <div class="top-bottom">
          <button 
                @click="setActiveUser('Pede')" 
                :class="{ active: activeUser === 'Pede' }"
                class="user-toggle-btn"
            >
                Pede
            </button>
            <button 
                @click="setActiveUser('Vinne')" 
                :class="{ active: activeUser === 'Vinne' }"
                class="user-toggle-btn"
            >
                Vinne
            </button>
            <button 
                @click="setActiveUser('Bims')" 
                :class="{ active: activeUser === 'Bims' }"
                class="user-toggle-btn"
            >
                Bims
            </button>
            </div>
        </div>
    <section class="il">
        

        
        <div class="il-container">
            <div class="title-container">
                <h2 class="il-title"> {{activeUser}}</h2>
            </div>
               
            <div v-if="isLoading" class="il-spinner">
                <h1> Server is cold starting...</h1>
                <PulseLoader />
            </div>

            <div v-else class="il-items">
                <Item v-for="col in activeCollection"  :key="col.id" :collection="col" @update="updateCollection" @delete="deleteCollection"/>
            </div>
             </div>
        


        <div class="il-container">

            <h2 class="il-title" id="vinne"> Vinne</h2>
            <div v-if="isLoading" class="il-spinner">
                <h1> Server is cold starting...</h1>
                <PulseLoader />
            </div>
            <div v-else class="il-items">
                <Item  v-for="col in vinneCollection"  :key="col.id" :collection="col" @update="updateCollection"  @delete="deleteCollection"/>
            </div>
            </div>
           
    </section>
</template>

<style lang="scss" src="../assets/main.scss">
</style>