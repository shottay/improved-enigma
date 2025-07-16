<template>
  <div id="app">
    <Navigation />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navigation from './components/Navigation.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.main-content {
  margin-left: 250px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding-top: 80px;
  }
}
</style>
