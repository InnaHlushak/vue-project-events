<script setup>
import NavigationBar from './components/NavigationBar.vue'
</script>

<template>
  <header>
    <div>
        <NavigationBar />
    </div>
  </header>
    <main>
      <router-view/> 
    </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}
</style>
