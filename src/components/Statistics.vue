<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
const store = useStore()
const props = defineProps({
    collection: Object
});


const isLoading = computed(() => store.getters.isLoading);



</script>

<template>

     <div class="card">
    <div class="search-card-inner">
   <label class="search-label">Overview</label>
   <div class="container">


   <div class="input-container">
   
    <div>
          <div v-if="isLoading" class="il-spinner">
                <PulseLoader />
            </div>
      <div v-else class="results">

        <p>Total Skins: {{ collection.total }}</p>
        <p>
         Value: {{ collection.totalValue.toFixed(2) }}€</p>
        <p> Blue: {{ collection.totalBlues }} </p>
        <p> Purple: {{ collection.totalPurples }}</p>
        <p> Pink: {{ collection.totalPinks }} </p>
        <p> Red: {{ collection.totalReds }} </p>
        <p> StatTracks: {{ collection.totalStatTracks }}</p>
       <img />
      </div>

      </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>

.card {
  width: 100%
}
.results{
    display: flex;
    justify-content: center;
    padding-left: 10px;
    width: 100%;
    gap: 30px;
    text-align: center;
}

p{
  font-size: 1.3rem;
}

</style>