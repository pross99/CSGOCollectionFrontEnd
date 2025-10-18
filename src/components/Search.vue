<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const searchQuery = ref('');
const debounceTimer = ref(null);

const searchResults = computed (() => store.state.searchResults?.data || []);
const loading = computed(() => store.state.searchLoading)


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
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>