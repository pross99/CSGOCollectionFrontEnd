<script setup>
import { ref, onMounted, onUpdated, computed } from 'vue';
import { RouterLink } from 'vue-router';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import Item from './Item.vue';
import Search from './Search.vue';
import Statistics from './Statistics.vue';

const store = useStore()

onMounted(() => {
    if (!store.state.collections || store.state.collections.length === 0) {
    store.dispatch('getCollections')
  }
})



const emit = defineEmits(['add']);
const isLoading = computed(() => store.getters.isLoading);

const updateCollection = (id, newData)  => {
    store.commit('UPDATE_COLLECTION', { id,newData})
};

const deleteCollection = (id) => {
    store.commit('DELETE_COLLECTION', {id})
}
const peterCollection = computed(() => 
store.getters.collectionByBool('userName', true)
);

const vinneCollection = computed(() => 
store.getters.collectionByBool('userName', false))

const statisticsPeter = computed(() => store.getters.collectionsStats(peterCollection))
const statisticsVinne = computed(() => store.getters.collectionsStats(vinneCollection))
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