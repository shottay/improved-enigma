import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import LearningView from '../components/LearningView.vue'

const routes = [
  { 
    path: '/', 
    component: HomeView,
    meta: { title: 'Home' }
  },
  { 
    path: '/level1', 
    component: LearningView,
    meta: { title: 'Lernen' }
  },
  { 
    path: '/quiz', 
    component: () => import('../components/QuizView.vue'),
    meta: { title: 'Quiz' }
  },
  { 
    path: '/adventure', 
    component: () => import('../components/AdventureView.vue'),
    meta: { title: 'Abenteuer' }
  },
  { 
    path: '/leaderboard', 
    component: () => import('../components/LeaderboardView.vue'),
    meta: { title: 'Rangliste' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router