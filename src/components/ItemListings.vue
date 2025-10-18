<script setup>
import { ref, onMounted, onUpdated, computed } from 'vue';
import { RouterLink } from 'vue-router';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import Item from './Item.vue';
import Search from './Search.vue';

const store = useStore()

onMounted(() => {
    if (!store.state.collections || store.state.collections.length === 0) {
    store.dispatch('getCollections')
  }
})

const showModal = ref(false)

const emit = defineEmits(['add']);

const collections = computed(() => store.getters.collections);
const collectionsWithImages = computed(() => store.getters.collectionWithImagefromItem)
const items = computed(() => store.getters.items);
const isLoading = computed(() => store.getters.isLoading);
const updateCollection = (id, newData)  => {
    store.commit('UPDATE_COLLECTION', { id,newData})
};
console.log(collectionsWithImages)


const peterCollection = computed(() => 
store.getters.collectionByBool('userName', true)
);

const vinneCollection = computed(() => 
store.getters.collectionByBool('userName', false))
</script>

<template>
    <section class="il">
        

        <div class="il-search-container">
            <Search />
        </div>
        <div class="il-container">

            <div v-if="isLoading" class="il-spinner">
                <h1> Server is cold starting...</h1>
                <PulseLoader />
            </div>

            <div v-else class="il-items">
                <Item v-for="col in peterCollection"  :key="col.id" :collection="col" @update="updateCollection"/>
            </div>
        </div>


        <div class="il-container">

            <div v-if="isLoading" class="il-spinner">
                <h1> Server is cold starting...</h1>
                <PulseLoader />
            </div>

            <div v-else class="il-items">
                <Item  v-for="col in vinneCollection"  :key="col.id" :collection="col" @update="updateCollection"/>
            </div>
        </div>
        
    </section>
</template>

<style lang="scss" src="../assets/main.scss">
</style>