<script setup>
import { ref, onMounted, onUpdated, computed } from 'vue';
import { RouterLink } from 'vue-router';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import Item from './Item.vue';

const store = useStore()

onMounted(() => {
    if (!store.state.collections || store.state.collections.length === 0) {
    store.dispatch('getCollections')
  }
})

const showModal = ref(false)

const emit = defineEmits(['add']);

const collections = computed(() => store.getters.collections);
const items = computed(() => store.getters.items);
const isLoading = computed(() => store.getters.isLoading);
const updateCollection = (id, newData)  => {
    store.commit('UPDATE_COLLECTION', { id,newData})
};
</script>

<template>
    <section class="il">
        <div class="il-container">

            <div v-if="isLoading" class="il-spinner">
                <h1> Server is cold starting...</h1>
                <PulseLoader />
            </div>

            <div v-else class="il-items">
                <Item  :collections="collections"/>
            </div>
        </div>


        <div class="il-container">

            <div v-if="isLoading" class="il-spinner">
                <h1> Server is cold starting...</h1>
                <PulseLoader />
            </div>

            <div v-else class="il-items">
                <Item  :collections="collections"/>
            </div>
        </div>
        
    </section>
</template>

<style lang="scss" src="../assets/main.scss">
</style>