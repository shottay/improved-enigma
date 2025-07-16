<template>
  <nav class="sidebar-nav" :class="{ 'collapsed': isCollapsed }">
    <!-- Toggle Button -->
    <button @click="toggleNav" class="nav-toggle">
      <span v-if="isCollapsed">→</span>
      <span v-else>←</span>
    </button>

    <!-- Logo/Title -->
    <div class="nav-header">
      <div class="logo">🛡️</div>
      <h3 v-if="!isCollapsed" class="nav-title">Datenschutz Game</h3>
    </div>

    <!-- Navigation Items -->
    <ul class="nav-menu">
      <li class="nav-item">
        <router-link to="/" class="nav-link" active-class="active">
          <span class="nav-icon">🏠</span>
          <span v-if="!isCollapsed" class="nav-text">Home</span>
        </router-link>
      </li>
      
      <li class="nav-item">
        <router-link to="/level1" class="nav-link" active-class="active">
          <span class="nav-icon">📚</span>
          <span v-if="!isCollapsed" class="nav-text">Lernen</span>
        </router-link>
      </li>
      
      <li class="nav-item">
        <router-link to="/quiz" class="nav-link" active-class="active">
          <span class="nav-icon">❓</span>
          <span v-if="!isCollapsed" class="nav-text">Quiz</span>
        </router-link>
      </li>
      
      <li class="nav-item">
        <router-link to="/adventure" class="nav-link" active-class="active">
          <span class="nav-icon">🕵️</span>
          <span v-if="!isCollapsed" class="nav-text">Abenteuer</span>
        </router-link>
      </li>
      
      <li class="nav-item">
        <router-link to="/leaderboard" class="nav-link" active-class="active">
          <span class="nav-icon">🏆</span>
          <span v-if="!isCollapsed" class="nav-text">Rangliste</span>
        </router-link>
      </li>
    </ul>

    <!-- User Info/Points -->
    <div v-if="!isCollapsed" class="nav-footer">
      <div class="user-points">
        <span class="points-icon">⭐</span>
        <span class="points-text">{{ userPoints }} Punkte</span>
      </div>
      <div class="user-level">
        <span class="level-text">Level {{ userLevel }}</span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isCollapsed = ref(false)
const userPoints = ref(0)
const userLevel = ref(1)

const toggleNav = () => {
  isCollapsed.value = !isCollapsed.value
  // Save preference to localStorage
  localStorage.setItem('nav-collapsed', isCollapsed.value.toString())
}

const loadUserData = () => {
  const savedPoints = localStorage.getItem('userPoints')
  if (savedPoints) {
    const points = parseInt(savedPoints, 10)
    if (!isNaN(points) && points >= 0) {
      userPoints.value = points
      userLevel.value = Math.floor(points / 100) + 1
    }
  }
  
  const savedNavState = localStorage.getItem('nav-collapsed')
  if (savedNavState) {
    isCollapsed.value = savedNavState === 'true'
  }
}

let storageListener: ((e: StorageEvent) => void) | null = null

onMounted(() => {
  loadUserData()
  
  storageListener = (e: StorageEvent) => {
    if (e.key === 'userPoints' && e.newValue) {
      const points = parseInt(e.newValue, 10)
      if (!isNaN(points) && points >= 0) {
        userPoints.value = points
        userLevel.value = Math.floor(points / 100) + 1
      }
    }
  }
  
  window.addEventListener('storage', storageListener)
})

onUnmounted(() => {
  if (storageListener) {
    window.removeEventListener('storage', storageListener)
  }
})
</script>

<style scoped>
.sidebar-nav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar-nav.collapsed {
  width: 80px;
}

.nav-toggle {
  position: absolute;
  top: 1rem;
  right: -15px;
  width: 30px;
  height: 30px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.nav-toggle:hover {
  background: #5a6fd8;
  transform: scale(1.1);
}

.nav-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

.logo {
  font-size: 2rem;
  min-width: 48px;
  text-align: center;
}

.nav-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(5px);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: bold;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: white;
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
}

.nav-text {
  white-space: nowrap;
  overflow: hidden;
}

.nav-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.user-points {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.points-icon {
  font-size: 1rem;
}

.points-text {
  font-size: 0.9rem;
  font-weight: bold;
}

.user-level {
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.8;
}

.level-text {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  display: inline-block;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar-nav {
    width: 100%;
    height: auto;
    position: relative;
    flex-direction: row;
    padding: 0.5rem;
  }
  
  .sidebar-nav.collapsed {
    width: 100%;
  }
  
  .nav-toggle {
    display: none;
  }
  
  .nav-header {
    margin-bottom: 0;
    margin-right: auto;
  }
  
  .nav-menu {
    display: flex;
    gap: 0.5rem;
    flex: none;
  }
  
  .nav-item {
    margin-bottom: 0;
  }
  
  .nav-link {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-footer {
    margin-top: 0;
    margin-left: auto;
    padding-top: 0;
    border-top: none;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .user-points {
    margin-bottom: 0;
  }
}

/* Content margin adjustment */
body:has(.sidebar-nav:not(.collapsed)) {
  margin-left: 250px;
}

body:has(.sidebar-nav.collapsed) {
  margin-left: 80px;
}

@media (max-width: 768px) {
  body:has(.sidebar-nav) {
    margin-left: 0;
    padding-top: 80px;
  }
}
</style>