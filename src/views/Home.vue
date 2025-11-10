<script setup>
import ItemListings from '@/components/ItemListings.vue';
import FAQ from '@/components/FAQ.vue';
</script>



<template>
<div class="background">
    <ItemListings />
    <FAQ/> 
</div>

</template>


<style scoped>
.background{
    background: linear-gradient(-67deg, rgba(223, 124, 19, 0.4), rgba(93, 121, 174, 0.9));
}
</style>