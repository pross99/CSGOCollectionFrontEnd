<script setup>
import { computed } from 'vue';

const props = defineProps({
    collection: Object
});



const headerNames = {
    totalBlues: 'Blues',
    totalPurples: 'Purples',
    totalPinks: 'Pinks',
    totalReds: 'Reds',
    totalGoldens: 'GOLD',
    totalValue: 'Estimated collection value',
    totalStatTracks: 'StatTracks'
}


</script>

<template>

     <div class="card">
    <div class="card-inner">
   <label class="search-label">Overview</label>
   <div class="container">


   <div class="input-container">
   
    <div>
      <div class="results">

        <p>Total Skins: {{ collection.total }}</p>
        <p>
        Total Estimated Value: {{ collection.totalValue.toFixed(2) }}€</p>
        <p> Blues: {{ collection.totalBlues }} </p>
        <p> Purples: {{ collection.totalPurples }}</p>
        <p> Pinks: {{ collection.totalPinks }} </p>
        <p> Reds: {{ collection.totalReds }} </p>
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
    width: 66%;
}
.results{
    display: flex;
    gap: 40px;
}

</style>