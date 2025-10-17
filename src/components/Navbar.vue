<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref } from 'vue';


const route = useRoute()
const isMenuOpen = ref(false)

const isActive = (routePath) => {
    return route.path === routePath
}

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}


const closeMenu = () => {
    isMenuOpen.value = false
}


</script>

<template>
    <nav class="nav">
        <div class="main left">
            <a class="nav-img" href="/home"></a>
        </div>
        <div class="main right">
            <div class="right-container">
                <p>Vinne & Pede Collection showcase</p>
            </div>
            
        </div>
    </nav>
</template>

<style lang="scss" src="../assets/navbar.scss"></style>