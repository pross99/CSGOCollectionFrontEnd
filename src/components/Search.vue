<script setup>
import { ref, computed, onBeforeUnmount, reactive } from 'vue';
import { useStore } from 'vuex';
import Modal from './Modal.vue';
import {useToast} from 'vue-toastification'

const showToast = useToast()
const store = useStore();
const searchQuery = ref('');
const debounceTimer = ref(null);
const emit = defineEmits(['add'])

const searchResults = computed (() => store.state.searchResults?.data || []);
const loading = computed(() => store.state.searchLoading)


const showModal = ref(false)
const selectedItem = ref(null)
const itemRework = reactive({
  id: null,
  name: null,
  rarity: null 
})



const handleSearch = () => {
    clearTimeout(debounceTimer.value)

    // Don't search if query is empty
  if (!searchQuery.value.trim()) {
    return;
  }
  
  // Debounce search by 300ms
  debounceTimer.value = setTimeout(() => {
    store.dispatch('searchItem', searchQuery.value);
  }, 300);
};

onBeforeUnmount(() => {
  clearTimeout(debounceTimer.value);
});


function sendItemToForm(item) {

  console.log(item)
  showModal.value = true
  selectedItem.value = item
  itemRework.rarity = item.rarity.name
  itemRework.name = item.name
  itemRework.image = item.image
  itemRework.itemId = item.id
  console.log("THE ITEM SENT", itemRework)
}

const handleFormSubmit = async(formData) => {
   try {
                const newCollection = await store.dispatch('addCollection', formData);
                emit('add', newCollection);

                showToast.success("Item added successfully");

                showModal.value = false;
            } catch (error) {
                showToast.error("Error updating listing", error);
            }
}

const close = () => {
  emit('close')
}


</script>

<template>

   <div class="search-container">
    <input
      v-model="searchQuery"
      @input="handleSearch"
      type="text"
      placeholder="Search items..."
      class="search-input"
    />
    <div v-if="loading" class="loading">Searching...</div>
    <div v-if="searchResults.length > 0" class="results">
      <div 
        v-for="(item, index) in searchResults" 
        :key="index"
        class="result-item"
        @click="sendItemToForm(item)"
      >
       {{ item.name }}
      </div>
      <Modal 
      :isOpen="showModal" 
      @close="showModal = false" 
      @submit="handleFormSubmit" 
      :initialData="itemRework">

      </Modal>
    </div>
  </div>
</template>