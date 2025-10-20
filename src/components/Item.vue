<script setup>
import { defineProps, ref, computed, defineEmits } from 'vue';
import axios from 'axios'
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex'
import Modal from './Modal.vue';

const store = useStore()
const emit = defineEmits(['update'])
const showModal = ref(false)
const showToast = useToast()


const props = defineProps({
    collection: Object
});


//iterate each object
console.log("HI", props.collection)
const sortedCollections = computed(() => {
  return [...props.collection].sort((a, b) => a.estimatedPrice - b.estimatedPrice)
})




const deleteCollection = async (collection) => {
    console.log(collection)
    store.dispatch('deleteCollection', collection.id)
}

const handleFormSubmit = async ( formData ) => {
    if(!formData._id) {
        console.error("WHERE ID?")
        return;
    }


    const updateCollectionObject = {
        id: props.collection._id,
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


            <div class="item-card"
            @click="showModal= true"
            >
                 <img :src="collection.image" />
             <p>{{ collection.itemId }}</p>
            <p>{{ collection.wear }}</p>
            <p>{{ collection.float }}</p>
            <p>{{ collection.statTrack ? 'Yes' : 'No' }}</p>
            <p>{{ collection.rarity }}</p>
            <p>{{ collection.estimatedPrice }}</p>
            <p>{{ collection.itemName }}</p>
           
            </div>
            <fa icon="trash-can"
            @click="deleteCollection(collection.id)" 
            />
        
     <Modal 
   
      :isOpen="showModal" 
      @close="showModal = false" 
      @submit="handleFormSubmit" 
      :initialData="collection">
     ></Modal>

          
</template>

<style lang="scss" src="../assets/card.scss">
</style>