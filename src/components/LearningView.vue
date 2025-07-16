<template>
  <div class="learning-view">
    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <span class="progress-text">{{ currentStep }}/{{ totalSteps }}</span>
    </div>

    <!-- Learning Content -->
    <div class="content-card">
      <h2>{{ currentTopic.title }}</h2>
      
      <!-- Learning Image -->
      <div class="learning-image" v-if="currentTopic.image">
        <img :src="currentTopic.image" :alt="currentTopic.title" />
      </div>
      
      <!-- Learning Text -->
      <div class="learning-text">
        <p>{{ currentTopic.content }}</p>
      </div>
      
      <!-- Navigation Buttons -->
      <div class="button-container">
        <button 
          v-if="currentStep > 1" 
          @click="previousTopic" 
          class="btn-secondary"
        >
          ← Zurück
        </button>
        
        <button 
          v-if="hasNextTopic" 
          @click="nextTopic" 
          class="btn-primary"
        >
          Weiter →
        </button>
        
        <button 
          v-else 
          @click="completeLearning" 
          class="btn-success"
        >
          Lernen abschließen ✓
        </button>
      </div>
    </div>

    <!-- Completion Screen -->
    <div v-if="showCompletion" class="completion-overlay">
      <div class="completion-modal">
        <div class="completion-content">
          <h1>🎉 Herzlichen Glückwunsch! 🎉</h1>
          <h2>Du hast alle Lernmodule erfolgreich abgeschlossen!</h2>
          <div class="completion-stats">
            <p>Gelesene Module: {{ totalSteps }}</p>
            <p>Erworbenes Wissen: Datenschutz Grundlagen</p>
          </div>
          <div class="next-steps">
            <p>Teste dein Wissen jetzt in den anderen Bereichen:</p>
            <div class="next-buttons">
              <button @click="goToQuiz" class="btn-primary">
                Quiz starten
              </button>
              <button @click="goToAdventure" class="btn-primary">
                Abenteuer spielen
              </button>
              <button @click="goHome" class="btn-secondary">
                Zur Startseite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface LearningTopic {
  title: string
  content: string
  image?: string
}

// Reactive state
const currentStep = ref(1)
const showCompletion = ref(false)

// Learning content data
const learningTopics: LearningTopic[] = [
  {
    title: 'Was ist Datenschutz?',
    content: 'Datenschutz bezeichnet den Schutz von personenbezogenen Daten vor missbräuchlicher Verwendung. Er umfasst alle Maßnahmen, die sicherstellen, dass deine persönlichen Informationen wie Name, Adresse, E-Mail oder Telefonnummer nur von befugten Personen eingesehen und verwendet werden können.',
    image: '/images/datenschutz-intro.jpg'
  },
  {
    title: 'Warum ist Datenschutz wichtig?',
    content: 'Deine persönlichen Daten sind wertvoll und schützenswert. Ohne angemessenen Datenschutz können diese Informationen missbraucht werden - für Identitätsdiebstahl, unerwünschte Werbung oder sogar Betrug. Datenschutz bewahrt deine Privatsphäre und gibt dir die Kontrolle über deine eigenen Daten.',
    image: '/images/why-privacy.jpg'
  },
  {
    title: 'Grundprinzipien des Datenschutzes',
    content: 'Die wichtigsten Prinzipien sind: Datenminimierung (nur notwendige Daten sammeln), Zweckbindung (Daten nur für den angegebenen Zweck verwenden), Speicherbegrenzung (Daten nicht länger als nötig aufbewahren) und Transparenz (klar kommunizieren, was mit den Daten passiert).',
    image: '/images/privacy-principles.jpg'
  },
  {
    title: 'Deine Rechte beim Datenschutz',
    content: 'Du hast verschiedene Rechte bezüglich deiner Daten: Das Recht auf Information (zu erfahren, welche Daten gesammelt werden), das Recht auf Auskunft (eine Kopie deiner Daten zu erhalten), das Recht auf Berichtigung (falsche Daten korrigieren zu lassen) und das Recht auf Löschung (deine Daten löschen zu lassen).',
    image: '/images/privacy-rights.jpg'
  },
  {
    title: 'Praktische Tipps für den Alltag',
    content: 'Achte darauf, welche Apps und Websites Zugriff auf deine Daten haben. Lies Datenschutzerklärungen (zumindest die wichtigsten Punkte), verwende starke Passwörter, sei vorsichtig mit persönlichen Informationen in sozialen Medien und überprüfe regelmäßig deine Privatsphäre-Einstellungen.',
    image: '/images/privacy-tips.jpg'
  }
]

// Computed properties
const totalSteps = computed(() => learningTopics.length)
const progressPercentage = computed(() => (currentStep.value / totalSteps.value) * 100)
const currentTopic = computed(() => learningTopics[currentStep.value - 1])
const hasNextTopic = computed(() => currentStep.value < totalSteps.value)

// Methods
const nextTopic = () => {
  if (hasNextTopic.value) {
    currentStep.value++
  }
}

const previousTopic = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const completeLearning = () => {
  showCompletion.value = true
  // Save completion status
  localStorage.setItem('learningCompleted', 'true')
  localStorage.setItem('learningCompletedDate', new Date().toISOString())
}

const goToQuiz = () => {
  router.push('/quiz')
}

const goToAdventure = () => {
  router.push('/adventure')
}

const goHome = () => {
  router.push('/')
}

// Lifecycle
onMounted(() => {
  // Load progress if available
  const savedProgress = localStorage.getItem('learningProgress')
  if (savedProgress) {
    currentStep.value = parseInt(savedProgress)
  }
  
  // Save progress whenever step changes
  const saveProgress = () => {
    localStorage.setItem('learningProgress', currentStep.value.toString())
  }
  
  // Watch for step changes
  setInterval(() => {
    saveProgress()
  }, 1000)
})
</script>

<style scoped>
.learning-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.progress-container {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.5s ease;
}

.progress-text {
  font-weight: bold;
  color: #666;
  font-size: 16px;
}

.content-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.content-card h2 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
  border-bottom: 3px solid #667eea;
  padding-bottom: 15px;
}

.learning-image {
  text-align: center;
  margin: 30px 0;
}

.learning-image img {
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.learning-text {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
  margin: 30px 0;
  text-align: justify;
}

.learning-text p {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  gap: 15px;
}

.btn-primary, .btn-secondary, .btn-success {
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-primary {
  background: #2196F3;
  color: white;
}

.btn-primary:hover {
  background: #1976D2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.completion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.completion-modal {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.completion-content h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.completion-content h2 {
  color: #666;
  font-size: 1.3rem;
  margin-bottom: 30px;
  font-weight: normal;
}

.completion-stats {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 30px 0;
}

.completion-stats p {
  margin: 10px 0;
  font-size: 16px;
  color: #666;
}

.next-steps {
  margin-top: 30px;
}

.next-steps p {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.next-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.next-buttons button {
  flex: 1;
  min-width: 140px;
}

@media (max-width: 768px) {
  .learning-view {
    padding: 15px;
  }
  
  .content-card {
    padding: 25px;
  }
  
  .content-card h2 {
    font-size: 1.6rem;
  }
  
  .learning-text {
    font-size: 16px;
  }
  
  .button-container {
    flex-direction: column;
  }
  
  .next-buttons {
    flex-direction: column;
  }
  
  .completion-modal {
    padding: 25px;
  }
  
  .completion-content h1 {
    font-size: 2rem;
  }
}
</style>