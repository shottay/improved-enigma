<template>
  <div class="leaderboard-view">
    <!-- Header -->
    <div class="leaderboard-header">
      <h1>🏆 Rangliste</h1>
      <p>Sieh dir die besten Datenschutz-Experten an!</p>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <span class="stat-number">{{ totalPlayers }}</span>
          <span class="stat-label">Spieler gesamt</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <span class="stat-number">{{ userPoints }}</span>
          <span class="stat-label">Deine Punkte</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <span class="stat-number">#{{ userRank }}</span>
          <span class="stat-label">Dein Rang</span>
        </div>
      </div>
    </div>

    <!-- Filter Buttons -->
    <div class="filter-buttons">
      <button 
        @click="activeFilter = 'all'" 
        :class="{ active: activeFilter === 'all' }"
        class="filter-btn"
      >
        🏆 Alle Punkte
      </button>
      <button 
        @click="activeFilter = 'learning'" 
        :class="{ active: activeFilter === 'learning' }"
        class="filter-btn"
      >
        📚 Lernen
      </button>
      <button 
        @click="activeFilter = 'quiz'" 
        :class="{ active: activeFilter === 'quiz' }"
        class="filter-btn"
      >
        🧩 Quiz
      </button>
      <button 
        @click="activeFilter = 'adventure'" 
        :class="{ active: activeFilter === 'adventure' }"
        class="filter-btn"
      >
        🕵️ Abenteuer
      </button>
    </div>

    <!-- Leaderboard Table -->
    <div class="leaderboard-container">
      <div class="leaderboard-table">
        <div class="table-header">
          <div class="rank-col">Rang</div>
          <div class="name-col">Spieler</div>
          <div class="points-col">Punkte</div>
          <div class="achievement-col">Level</div>
          <div class="date-col">Letzte Aktivität</div>
        </div>
        
        <div 
          v-for="(player, index) in filteredLeaderboard" 
          :key="player.id"
          class="table-row"
          :class="{ 
            'current-user': player.isCurrentUser,
            'top-three': index < 3 
          }"
        >
          <div class="rank-col">
            <div class="rank-badge" :class="getRankClass(index)">
              <span v-if="index === 0">🥇</span>
              <span v-else-if="index === 1">🥈</span>
              <span v-else-if="index === 2">🥉</span>
              <span v-else>#{{ index + 1 }}</span>
            </div>
          </div>
          
          <div class="name-col">
            <div class="player-info">
              <div class="player-avatar">{{ player.avatar }}</div>
              <div class="player-name">
                {{ player.name }}
                <span v-if="player.isCurrentUser" class="current-user-badge">Du</span>
              </div>
            </div>
          </div>
          
          <div class="points-col">
            <span class="points-value">{{ player[activeFilter] }}</span>
            <span class="points-label">Punkte</span>
          </div>
          
          <div class="achievement-col">
            <div class="level-badge">
              Level {{ player.level }}
            </div>
          </div>
          
          <div class="date-col">
            <span class="date-text">{{ formatDate(player.lastActive) }}</span>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredLeaderboard.length === 0" class="empty-state">
          <div class="empty-icon">📊</div>
          <h3>Noch keine Einträge</h3>
          <p>Spiele ein paar Runden, um in der Rangliste zu erscheinen!</p>
        </div>
      </div>
    </div>

    <!-- User Achievement Summary -->
    <div class="user-summary">
      <h3>🎯 Deine Erfolge</h3>
      <div class="achievement-grid">
        <div class="achievement-item">
          <div class="achievement-icon">📚</div>
          <div class="achievement-info">
            <span class="achievement-title">Lernmodule</span>
            <span class="achievement-value">{{ userProgress.learning ? 'Abgeschlossen' : 'In Bearbeitung' }}</span>
          </div>
        </div>
        
        <div class="achievement-item">
          <div class="achievement-icon">🧩</div>
          <div class="achievement-info">
            <span class="achievement-title">Quiz Erfolg</span>
            <span class="achievement-value">{{ userProgress.quizScore }}/5 richtig</span>
          </div>
        </div>
        
        <div class="achievement-item">
          <div class="achievement-icon">🕵️</div>
          <div class="achievement-info">
            <span class="achievement-title">Abenteuer</span>
            <span class="achievement-value">{{ userProgress.adventure ? 'Abgeschlossen' : 'Offen' }}</span>
          </div>
        </div>
        
        <div class="achievement-item">
          <div class="achievement-icon">⏱️</div>
          <div class="achievement-info">
            <span class="achievement-title">Spielzeit</span>
            <span class="achievement-value">{{ userProgress.totalTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="refreshLeaderboard" class="btn-secondary">
        🔄 Aktualisieren
      </button>
      <button @click="goToLearning" class="btn-primary">
        📚 Weiter lernen
      </button>
      <button @click="goHome" class="btn-primary">
        🏠 Startseite
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Player {
  id: string
  name: string
  avatar: string
  all: number
  learning: number
  quiz: number
  adventure: number
  level: number
  lastActive: string
  isCurrentUser: boolean
}

interface UserProgress {
  learning: boolean
  quizScore: number
  adventure: boolean
  totalTime: string
}

// Reactive state
const activeFilter = ref<'all' | 'learning' | 'quiz' | 'adventure'>('all')
const leaderboard = ref<Player[]>([])
const userPoints = ref(0)
const userProgress = ref<UserProgress>({
  learning: false,
  quizScore: 0,
  adventure: false,
  totalTime: '0:00'
})

// Mock data for demonstration
const generateMockData = (): Player[] => {
  const names = [
    'Max Mustermann', 'Anna Schmidt', 'Tim Weber', 'Lisa Müller', 'Jan Klein',
    'Sarah Fischer', 'Tom Bauer', 'Nina Wolf', 'Leon Meyer', 'Emma Koch'
  ]
  
  const avatars = ['👨‍💻', '👩‍💼', '🧑‍🎓', '👩‍🔬', '👨‍🏫', '👩‍💻', '🧑‍💼', '👨‍🎓', '👩‍🏫', '🧑‍🔬']
  
  return names.map((name, index) => {
    const learningPoints = Math.floor(Math.random() * 200) + 50
    const quizPoints = Math.floor(Math.random() * 100) + 20
    const adventurePoints = Math.floor(Math.random() * 150) + 30
    const totalPoints = learningPoints + quizPoints + adventurePoints
    
    return {
      id: `player-${index}`,
      name,
      avatar: avatars[index],
      all: totalPoints,
      learning: learningPoints,
      quiz: quizPoints,
      adventure: adventurePoints,
      level: Math.floor(totalPoints / 100) + 1,
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      isCurrentUser: index === 0 // Erstes Element ist der aktuelle User
    }
  }).sort((a, b) => b.all - a.all)
}

// Computed properties
const filteredLeaderboard = computed(() => {
  return [...leaderboard.value].sort((a, b) => b[activeFilter.value] - a[activeFilter.value])
})

const totalPlayers = computed(() => leaderboard.value.length)

const userRank = computed(() => {
  const currentUser = leaderboard.value.find(p => p.isCurrentUser)
  if (!currentUser) return 0
  
  const sorted = [...leaderboard.value].sort((a, b) => b[activeFilter.value] - a[activeFilter.value])
  return sorted.findIndex(p => p.isCurrentUser) + 1
})

// Methods
const getRankClass = (index: number): string => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return 'default'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Heute'
  if (diffDays === 1) return 'Gestern'
  if (diffDays < 7) return `vor ${diffDays} Tagen`
  return date.toLocaleDateString('de-DE')
}

const loadUserData = () => {
  // Load user points from localStorage
  userPoints.value = parseInt(localStorage.getItem('userPoints') || '0')
  
  // Load user progress
  const learningCompleted = localStorage.getItem('learningCompleted') === 'true'
  const quizResults = localStorage.getItem('quizResults')
  const adventureCompleted = localStorage.getItem('adventureCompleted') === 'true'
  
  let quizScore = 0
  if (quizResults) {
    try {
      const results = JSON.parse(quizResults)
      quizScore = results.score || 0
    } catch (e) {
      console.log('Error parsing quiz results')
    }
  }
  
  userProgress.value = {
    learning: learningCompleted,
    quizScore: quizScore,
    adventure: adventureCompleted,
    totalTime: '2:30' // Mock data - in real app calculate from session data
  }
}

const refreshLeaderboard = () => {
  loadUserData()
  // In a real app, you would fetch from server
  leaderboard.value = generateMockData()
  
  // Update current user data
  const currentUser = leaderboard.value.find(p => p.isCurrentUser)
  if (currentUser) {
    currentUser.all = userPoints.value
    // Re-sort after updating user data
    leaderboard.value.sort((a, b) => b.all - a.all)
  }
}

const goToLearning = () => {
  router.push('/level1')
}

const goHome = () => {
  router.push('/')
}

// Lifecycle
onMounted(() => {
  loadUserData()
  leaderboard.value = generateMockData()
  
  // Update current user data with real data
  const currentUser = leaderboard.value.find(p => p.isCurrentUser)
  if (currentUser) {
    currentUser.all = userPoints.value
    currentUser.name = 'Du' // Or get from localStorage
    // Re-sort after updating user data
    leaderboard.value.sort((a, b) => b.all - a.all)
  }
})
</script>

<style scoped>
.leaderboard-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.leaderboard-header {
  text-align: center;
  margin-bottom: 30px;
}

.leaderboard-header h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.leaderboard-header p {
  color: #666;
  font-size: 1.2rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  color: #666;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

.leaderboard-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px 150px;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: bold;
  align-items: center;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px 150px;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background 0.3s ease;
}

.table-row:hover {
  background: #f8f9ff;
}

.table-row.current-user {
  background: linear-gradient(135deg, #e8f4fd, #f1f8ff);
  border: 2px solid #2196F3;
}

.table-row.top-three {
  background: linear-gradient(135deg, #fff8e1, #fffbf0);
}

.rank-badge {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #b8860b;
}

.rank-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #666;
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #cd7f32, #deb887);
  color: #8b4513;
}

.rank-badge.default {
  background: #f0f0f0;
  color: #666;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.player-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: #f0f8ff;
}

.player-name {
  font-weight: bold;
  color: #333;
}

.current-user-badge {
  background: #2196F3;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 8px;
}

.points-col {
  text-align: center;
}

.points-value {
  display: block;
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
}

.points-label {
  font-size: 0.8rem;
  color: #666;
}

.level-badge {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
}

.date-text {
  color: #666;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.user-summary {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.user-summary h3 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.achievement-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
}

.achievement-info {
  display: flex;
  flex-direction: column;
}

.achievement-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.achievement-value {
  color: #666;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .leaderboard-view {
    padding: 15px;
  }
  
  .table-header, .table-row {
    grid-template-columns: 60px 1fr 80px;
    gap: 10px;
  }
  
  .achievement-col, .date-col {
    display: none;
  }
  
  .filter-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .achievement-grid {
    grid-template-columns: 1fr;
  }
}
</style>