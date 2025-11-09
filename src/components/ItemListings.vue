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

const items = store.getters.collectionByBool('userName', true)
return Object.values(items).sort((a,b) => b.estimatedPrice - a.estimatedPrice)
});

const vinneCollection = computed(() => {


const items = store.getters.collectionByBool('userName', false)
return Object.values(items).sort((a,b) => b.estimatedPrice - a.estimatedPrice)
})


const statisticsPeter = computed(() => store.getters.collectionsStats(peterCollection))
const statisticsVinne = computed(() => store.getters.collectionsStats(vinneCollection))


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
</script>

<template>
    <div class="il-top-container">
        <div class="top-top">
            <Search/>
        </div>
        <div class="top-bottom">
            <Statistics :collection="statisticsPeter"/>
            
            <Statistics :collection="statisticsVinne"/>
            </div>
        </div>
    <section class="il">
        

        
        <div class="il-container">
            <div class="title-container">
                <h2 class="il-title"> Pede</h2>
            </div>
               
            <div v-if="isLoading" class="il-spinner">
                <h1> Server is cold starting...</h1>
                <PulseLoader />
            </div>

            <div v-else class="il-items">
                <Item v-for="col in peterCollection"  :key="col.id" :collection="col" @update="updateCollection" @delete="deleteCollection"/>
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