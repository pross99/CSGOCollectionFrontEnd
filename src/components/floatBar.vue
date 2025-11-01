<script setup>
import { defineProps} from 'vue';
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps({
     floats: Object
});

const wearTiers = [
  { name: "Factory New", min: 0.00, max: 0.07, color: "#4CAF50" },
  { name: "Minimal Wear", min: 0.07, max: 0.15, color: "#8BC34A" },
  { name: "Field-Tested", min: 0.15, max: 0.38, color: "#FFC107" },
  { name: "Well-Worn", min: 0.38, max: 0.45, color: "#FF9800" },
  { name: "Battle-Scarred", min: 0.45, max: 1.00, color: "#F44336" },
];



const filteredTiers = wearTiers.map(t => ({
  ...t,
  min: Math.max(t.min, props.floats.minFloat),
  max: Math.min(t.max, props.floats.maxFloat)
})).filter(t => t.min < t.max);

</script>


<template>  
      <div class="wear-bar" @mouseenter="$emit('hover', true)" @mouseleave="$emit('hover', false)">
    <div 
      v-for="tier in filteredTiers"
      :key="tier.name"
      class="segment"
      :style="{
        backgroundColor: tier.color,
        width: ((tier.max - tier.min) / (floats.maxFloat - floats.minFloat)) * 100 + '%'
      }"
    ></div>

    <!-- Float marker -->
    <div 
      class="marker"
      :style="{
        left: ((floats.float - floats.minFloat) / (floats.maxFloat - floats.minFloat)) * 100 + '%'
      }"
    ></div>
  </div>
</template>

<style lang="scss" src="../assets/float-bar.scss">
</style>