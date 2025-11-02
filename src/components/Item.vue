<script setup>
import { defineProps, ref, computed, defineEmits } from 'vue';
import axios from 'axios'
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex'
import Modal from './Modal.vue';
import floatBar from './floatBar.vue';

const store = useStore()
const emit = defineEmits(['update'])
const showModal = ref(false)
const isHovered = ref(false)
const showToast = useToast()


const props = defineProps({
    collection: Object
});


//iterate each object
const sortedCollections = computed(() => {
  return [...props.collection].sort((a, b) => a.estimatedPrice - b.estimatedPrice)
})


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

    const handleDelete = async (collection) => {
        if(!collection._id) {
            console.log("WHERE IS ID")
            return;
        }

        const idFromObject = {
            id: props.collection._id
        }

        try {
        const deletedCollection = await store.dispatch('deleteCollection', idFromObject)
        showToast.success('Item deleted!')
        emit('delete', idFromObject, deletedCollection)
    } catch (error) {
        console.log("ERROR",error)
        showToast.error("ERROR updating listing")
    }
    }


// ADD SPECIAL STYLING DEPENDING ON RARITY 

</script>


<template>  


            <div class="item-card"
           
            :class="collection.rarity === 'Mil-Spec Grade' 
            ? 'item-blue'
            :collection.rarity === 'Restricted'
            ? 'item-purple'
            :collection.rarity === 'Classified'
            ? 'item-pink'
            :collection.rarity === 'Covert' 
            ? 'item-red' 
            : errorClass"
            >
            <div class="card-inner"
             @click="showModal= true">
                 <img :src="collection.image" />
                 
             <p id="item-name">
                <span>{{ collection.statTrack ? 'StatTrack' : '' }}</span>
                {{ collection.itemName }}</p>
                 <p >{{ collection.case }}</p>
            <p>{{ collection.wear }}</p>
            <p id="float-value" :class="{active: isHovered}">Float: {{ collection.float }}</p>
            <p>{{ collection.rarity }}</p>
            <p>{{ collection.estimatedPrice }}€</p>
            <floatBar :floats="collection" class="item-float"  @hover="isHovered = $event"/>
           
            
           </div>

           <div class="card-delete">
           <fa icon="trash-can"
           class="card-icon"
            @click="handleDelete(collection)" 
            />
            </div>
            </div>
            
        
     <Modal 
   
      :isOpen="showModal" 
      @close="showModal = false" 
      @submit="handleFormSubmit" 
      :initialData="collection">
     ></Modal>

          
</template>

<style lang="scss" src="../assets/card.scss">
#float-value.active {
  background-color: black;
}
</style>