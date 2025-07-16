<template>
  <div class="adventure-view">
    <!-- Header -->
    <div class="adventure-header">
      <h1>🕵️ Datenschutz Abenteuer</h1>
      <p>Finde alle versteckten Datenschutz-Risiken!</p>
    </div>

    <!-- Game Stats -->
    <div class="game-stats">
      <div class="stat-item">
        <span class="stat-label">Level:</span>
        <span class="stat-value">{{ currentLevel + 1 }}/{{ levels.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Gefunden:</span>
        <span class="stat-value">{{ foundPoints }}/{{ currentLevelData.totalPoints }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Zeit:</span>
        <span class="stat-value">{{ formattedTime }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Punkte:</span>
        <span class="stat-value">{{ totalScore }}</span>
      </div>
    </div>

    <!-- Main Game Layout -->
    <div v-if="!gameCompleted" class="main-layout">
      <!-- Game Container (Links) -->
      <div class="game-container">
        <div class="level-info">
          <h2>{{ currentLevelData.title }}</h2>
          <p>{{ currentLevelData.description }}</p>
        </div>
        
        <!-- Hauptspielbereich -->
        <div class="game-area" ref="gameArea">
          <!-- Background Image -->
          <div class="game-background" :style="{ backgroundColor: currentLevelData.backgroundColor }">
            <div class="placeholder-content">
              <h3>{{ currentLevelData.sceneName }}</h3>
              <p>Klicke auf verdächtige Bereiche!</p>
            </div>
          </div>
          
          <!-- Clickable Points -->
          <div 
            v-for="(point, index) in currentLevelData.points" 
            :key="index"
            class="click-point"
            :class="{ 
              'found': point.found,
              'pulsing': !point.found
            }"
            :style="{ 
              left: point.x + '%', 
              top: point.y + '%' 
            }"
            @click="clickPoint(index)"
            v-show="!point.found"
          >
            <div class="point-indicator"></div>
          </div>
          
          <!-- Found Points Indicators -->
          <div 
            v-for="(point, index) in currentLevelData.points" 
            :key="'found-' + index"
            class="found-indicator"
            :style="{ 
              left: point.x + '%', 
              top: point.y + '%' 
            }"
            v-show="point.found"
          >
            ✓
          </div>
        </div>
      </div>

      <!-- Feedback Sidebar (Rechts) -->
      <div class="feedback-sidebar">
        <!-- Permanent Instructions -->
        <div v-if="!showClickFeedback" class="instructions">
          <div class="instructions-content">
            <h3>🎯 Spielanleitung</h3>
            <p>Klicke auf die roten, pulsierenden Punkte um Datenschutz-Risiken zu entdecken!</p>
            <div class="tips">
              <h4>💡 Tipps:</h4>
              <ul>
                <li>Schaue nach unsicheren Passwörtern</li>
                <li>Achte auf offene Dokumente</li>
                <li>Finde unverschlüsselte Geräte</li>
                <li>Entdecke Sicherheitslücken</li>
              </ul>
            </div>
            <div class="progress-info">
              <h4>📊 Fortschritt:</h4>
              <p>{{ foundPoints }} von {{ currentLevelData.totalPoints }} Risiken gefunden</p>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: (foundPoints / currentLevelData.totalPoints * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Click Feedback -->
        <div v-if="showClickFeedback" class="click-feedback" :class="{ 'success': lastClickSuccess }">
          <div class="feedback-content">
            <h3 v-if="lastClickSuccess">Gefunden! 🎉</h3>
            <h3 v-else>Hier ist nichts... 🤔</h3>
            <p v-if="lastClickSuccess">{{ lastFoundPoint?.description }}</p>
            <p v-else>Schau genauer hin!</p>
            <div v-if="lastClickSuccess" class="points-earned">
              +{{ pointsPerFind }} Punkte
            </div>
            
            <!-- Progress Update -->
            <div v-if="lastClickSuccess" class="progress-update">
              <p><strong>Fortschritt:</strong> {{ foundPoints }}/{{ currentLevelData.totalPoints }}</p>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: (foundPoints / currentLevelData.totalPoints * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Level Complete -->
    <div v-if="levelCompleted && !gameCompleted" class="level-complete-overlay">
      <div class="level-complete-modal">
        <h2>🎊 Level {{ currentLevel + 1 }} abgeschlossen!</h2>
        <div class="level-stats">
          <p>Alle {{ currentLevelData.totalPoints }} Risiken gefunden!</p>
          <p>Zeit: {{ formattedTime }}</p>
          <p>Punkte erhalten: {{ currentLevelData.totalPoints * pointsPerFind }}</p>
          <p>Zeitbonus: {{ timeBonus }} Punkte</p>
        </div>
        <button @click="nextLevel" class="btn-primary">
          <span v-if="currentLevel < levels.length - 1">Nächstes Level →</span>
          <span v-else>Abenteuer abschließen</span>
        </button>
      </div>
    </div>

    <!-- Game Completed -->
    <div v-if="gameCompleted" class="completion-screen">
      <div class="completion-card">
        <h1>🏆 Abenteuer abgeschlossen!</h1>
        <div class="completion-stats">
          <div class="final-score">
            <span class="score-label">Gesamtpunkte:</span>
            <span class="score-value">{{ totalScore }}</span>
          </div>
          <div class="completion-details">
            <p>Alle {{ totalPointsInGame }} Datenschutz-Risiken gefunden!</p>
            <p>Gesamtzeit: {{ finalTime }}</p>
            <p>Du bist ein echter Datenschutz-Detektiv! 🔍</p>
          </div>
        </div>
        
        <div class="action-buttons">
          <button @click="restartGame" class="btn-secondary">
            🔄 Nochmal spielen
          </button>
          <button @click="goToLeaderboard" class="btn-primary">
            🏆 Rangliste
          </button>
          <button @click="goHome" class="btn-primary">
            🏠 Startseite
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface ClickPoint {
  x: number
  y: number
  found: boolean
  description: string
}

interface Level {
  title: string
  description: string
  sceneName: string
  backgroundColor: string
  totalPoints: number
  points: ClickPoint[]
}

// Reactive state
const currentLevel = ref(0)
const gameCompleted = ref(false)
const levelCompleted = ref(false)
const showClickFeedback = ref(false)
const lastClickSuccess = ref(false)
const lastFoundPoint = ref<ClickPoint | null>(null)
const startTime = ref(Date.now())
const currentTime = ref(Date.now())
const totalScore = ref(0)
const timer = ref<ReturnType<typeof setInterval> | null>(null)
const pointsPerFind = 50
const timeBonus = ref(0)

// WICHTIG: Levels als reactive ref definieren!
const levels = ref<Level[]>([
  {
    title: "Das unsichere Büro",
    description: "Du bist in einem Büro und musst Datenschutz-Risiken finden.",
    sceneName: "Büroumgebung",
    backgroundColor: "#f0f8ff",
    totalPoints: 4,
    points: [
      { x: 20, y: 30, found: false, description: "Passwort auf einem Post-it am Monitor - sehr unsicher!" },
      { x: 60, y: 45, found: false, description: "Unverschlossener Computer mit offenen Dokumenten" },
      { x: 80, y: 20, found: false, description: "Vertrauliche Dokumente offen auf dem Schreibtisch" },
      { x: 40, y: 70, found: false, description: "USB-Stick ohne Verschlüsselung herumliegen" }
    ]
  },
  {
    title: "Das unsichere Homeoffice",
    description: "Jetzt bist du im Homeoffice. Finde auch hier alle Datenschutz-Probleme!",
    sceneName: "Homeoffice",
    backgroundColor: "#fff8f0",
    totalPoints: 5,
    points: [
      { x: 15, y: 25, found: false, description: "Webcam ohne Abdeckung - jemand könnte zuschauen!" },
      { x: 70, y: 35, found: false, description: "Offenes WLAN ohne Passwort" },
      { x: 50, y: 60, found: false, description: "Familienmitglieder können Bildschirm einsehen" },
      { x: 85, y: 75, found: false, description: "Backup-Festplatte unverschlüsselt" },
      { x: 25, y: 80, found: false, description: "Wichtige E-Mails ausgedruckt im Papierkorb" }
    ]
  }
])

// Computed properties
const currentLevelData = computed(() => levels.value[currentLevel.value])
const foundPoints = computed(() => {
  const points = currentLevelData.value.points.filter(p => p.found).length
  console.log('foundPoints computed:', points, '/', currentLevelData.value.totalPoints)
  return points
})
const totalPointsInGame = computed(() => levels.value.reduce((sum, level) => sum + level.totalPoints, 0))

const formattedTime = computed(() => {
  const elapsed = Math.floor((currentTime.value - startTime.value) / 1000)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const finalTime = computed(() => {
  const elapsed = Math.floor((currentTime.value - startTime.value) / 1000)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Methods
const clickPoint = async (index: number) => {
  console.log('Clicking point:', index)
  const point = currentLevelData.value.points[index]
  
  if (point.found) {
    console.log('Point already found')
    return
  }
  
  // Direkte Mutation für Reaktivität
  levels.value[currentLevel.value].points[index].found = true
  
  lastClickSuccess.value = true
  lastFoundPoint.value = point
  showClickFeedback.value = true
  
  // Add points
  totalScore.value += pointsPerFind
  
  // Update localStorage
  const currentPoints = parseInt(localStorage.getItem('userPoints') || '0')
  localStorage.setItem('userPoints', (currentPoints + pointsPerFind).toString())
  
  console.log('Point marked as found. Current found points:', foundPoints.value)
  
  // Wait for next tick to ensure reactivity update
  await nextTick()
  
  // Hide feedback after 4 seconds (longer to read)
  setTimeout(() => {
    showClickFeedback.value = false
  }, 4000)
  
  // Check if level is complete
  console.log('Checking completion:', foundPoints.value, '===', currentLevelData.value.totalPoints)
  if (foundPoints.value === currentLevelData.value.totalPoints) {
    console.log('Level completed! All points found!')
    setTimeout(() => {
      completeLevel()
    }, 4500)
  }
}

const completeLevel = () => {
  console.log('Completing level:', currentLevel.value + 1)
  levelCompleted.value = true
  
  // Calculate time bonus (max 100 points for completing in under 2 minutes)
  const elapsed = Math.floor((currentTime.value - startTime.value) / 1000)
  const maxTime = 120 // 2 minutes
  timeBonus.value = Math.max(0, Math.floor((maxTime - elapsed) / maxTime * 100))
  
  if (timeBonus.value > 0) {
    totalScore.value += timeBonus.value
    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0')
    localStorage.setItem('userPoints', (currentPoints + timeBonus.value).toString())
  }
}

const nextLevel = () => {
  console.log('Moving to next level. Current:', currentLevel.value, 'Total levels:', levels.value.length)
  
  if (currentLevel.value < levels.value.length - 1) {
    currentLevel.value++
    levelCompleted.value = false
    startTime.value = Date.now()
    timeBonus.value = 0
    
    console.log('Started level:', currentLevel.value + 1)
  } else {
    console.log('All levels completed! Showing completion screen.')
    gameCompleted.value = true
    saveGameResults()
  }
}

const saveGameResults = () => {
  const results = {
    score: totalScore.value,
    levelsCompleted: levels.value.length,
    totalTime: finalTime.value,
    completedAt: new Date().toISOString()
  }
  localStorage.setItem('adventureResults', JSON.stringify(results))
  localStorage.setItem('adventureCompleted', 'true')
}

const restartGame = () => {
  currentLevel.value = 0
  gameCompleted.value = false
  levelCompleted.value = false
  showClickFeedback.value = false
  lastClickSuccess.value = false
  lastFoundPoint.value = null
  startTime.value = Date.now()
  currentTime.value = Date.now()
  totalScore.value = 0
  timeBonus.value = 0
  
  // Reset all points - mit direkter Mutation für Reaktivität
  levels.value.forEach(level => {
    level.points.forEach(point => {
      point.found = false
    })
  })
}

const goToLeaderboard = () => {
  router.push('/leaderboard')
}

const goHome = () => {
  router.push('/')
}

// Lifecycle
onMounted(() => {
  console.log('Adventure started with', levels.value.length, 'levels')
  console.log('Initial level data:', currentLevelData.value)
  // Start timer
  timer.value = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
.adventure-view {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.adventure-header {
  text-align: center;
  margin-bottom: 30px;
}

.adventure-header h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.adventure-header p {
  color: #666;
  font-size: 1.2rem;
}

.game-stats {
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  color: #333;
  font-size: 18px;
  font-weight: bold;
}

/* Neues Hauptlayout */
.main-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
  margin-bottom: 30px;
}

/* Game Container nimmt den Hauptbereich ein */
.game-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.level-info {
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 12px;
}

.level-info h2 {
  margin-bottom: 10px;
}

.level-info p {
  margin: 0;
  opacity: 0.9;
}

.game-area {
  position: relative;
  width: 100%;
  height: 600px; /* Größer für mehr Spielraum */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.game-background {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
    linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.03) 50%, transparent 51%);
}

.placeholder-content {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.placeholder-content h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.placeholder-content p {
  color: #666;
  margin: 0;
}

/* Sidebar als separater Bereich */
.feedback-sidebar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: fit-content;
  min-height: 400px;
  position: sticky;
  top: 20px;
}

.instructions {
  padding: 20px;
  height: 100%;
}

.instructions-content h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.instructions-content p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.tips {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.tips h4 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1rem;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  color: #666;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.progress-info {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #2196F3;
}

.progress-info h4 {
  color: #1976D2;
  margin-bottom: 10px;
  font-size: 1rem;
}

.progress-info p {
  color: #555;
  margin-bottom: 10px;
  font-weight: bold;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.5s ease;
}

.click-feedback {
  padding: 20px;
  border-left: 5px solid #ff9800;
  animation: slideIn 0.3s ease-out;
  min-height: 400px;
}

.click-feedback.success {
  border-left-color: #4CAF50;
  background: linear-gradient(135deg, #e8f5e8, #f1f8e9);
}

.feedback-content h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.3rem;
}

.feedback-content p {
  margin: 0 0 15px 0;
  color: #666;
  line-height: 1.5;
  font-size: 1rem;
}

.points-earned {
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 20px;
}

.progress-update {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}

.progress-update p {
  margin-bottom: 10px;
  color: #333;
}

/* Click Point Styles */
.click-point {
  position: absolute;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.point-indicator {
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 0, 0.3);
  border: 3px solid #ff0000;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.click-point.pulsing .point-indicator {
  animation: pulse 2s infinite;
}

.click-point:hover .point-indicator {
  background: rgba(255, 0, 0, 0.5);
  transform: scale(1.2);
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
}

.found-indicator {
  position: absolute;
  width: 40px;
  height: 40px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  transform: translate(-50%, -50%);
  animation: foundPop 0.5s ease-out;
}

@keyframes foundPop {
  0% { transform: translate(-50%, -50%) scale(0); }
  50% { transform: translate(-50%, -50%) scale(1.3); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Modal Styles */
.level-complete-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.level-complete-modal {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.level-complete-modal h2 {
  color: #333;
  margin-bottom: 20px;
}

.level-stats {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.level-stats p {
  margin: 10px 0;
  color: #666;
}

.completion-screen {
  text-align: center;
}

.completion-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.completion-card h1 {
  color: #333;
  margin-bottom: 30px;
}

.final-score {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.score-label {
  display: block;
  opacity: 0.9;
  margin-bottom: 5px;
}

.score-value {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
}

.completion-details {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.completion-details p {
  margin: 10px 0;
  color: #666;
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
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-layout {
    grid-template-columns: 1fr 300px;
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feedback-sidebar {
    position: static;
    order: -1; /* Sidebar oben auf mobilen Geräten */
    min-height: auto;
  }
  
  .game-area {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .adventure-view {
    padding: 15px;
  }
  
  .game-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .game-area {
    height: 400px;
  }
  
  .click-point {
    width: 50px;
    height: 50px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .level-complete-modal {
    padding: 25px;
  }
}
</style>