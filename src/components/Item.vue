<script setup>
import { defineProps, ref, computed, defineEmits } from 'vue';
import axios from 'axios'
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits(['update'])
const showModal = ref(false)
const showToast = useToast()
const props = defineProps({
    collections: {
        type: Array,
        required: true
    }
});


//iterate each object
console.log("HI", props.collections)
const sortedCollections = computed(() => {
  return [...props.collections].sort((a, b) => a.estimatedPrice - b.estimatedPrice)
})






const handleFormSubmit = async ( formData ) => {
    if(!formData.id) {
        console.error("WHERE ID?")
        return;
    }


    const updateCollectionObject = {
        itemId: formData.itemId,
        wear: formData.wear,
        float: formData.float,
        userName: formData.userName,
        statTrack: formData.statTrack,
        estimatedPrice: formData.estimatedPrice

    }

    try {
        const updatedCollection = await store.dispatch('updateCollection', updateCollectionObject)
        showToast.success('Item updated!')
        emit('update', updateCollectionObject, updatedCollection)
    } catch (error) {
        console.log("ERROR",error)
        showToast.error("ERROR updating listing")
    }
}

// ADD SPECIAL STYLING DEPENDING ON RARITY 

</script>


<template>
    <table>
        <thead>
            <tr>
          <th>Item ID</th>
          <th>Wear</th>
          <th>Float</th>
          <th>StatTrak</th>
          <th>Rarity</th>
          <th>Estimated Price ($)</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="item in sortedCollections" :key="item._id">
            <td>{{ item.itemId }}</td>
          <td>{{ item.wear }}</td>
          <td>{{ item.float.toExponential(2) }}</td>
          <td>{{ item.statTrack ? 'Yes' : 'No' }}</td>
          <td>{{ item.rarity }}</td>
          <td>{{ item.estimatedPrice.toFixed(2) }}</td>
          </tr>

          <tr v-if="sortedCollections.length === 0">
          <td colspan="6" class="empty">No items found</td>
        </tr>
        </tbody>
    </table>
</template>