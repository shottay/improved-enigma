<template>
  <div class="quiz-view">
    <!-- Header -->
    <div class="quiz-header">
      <h1>🧩 Datenschutz Quiz</h1>
      <p>Teste dein Wissen über Datenschutz!</p>
    </div>

    <!-- Progress -->
    <div class="progress-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <span class="progress-text">Frage {{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
    </div>

    <!-- Quiz Content -->
    <div v-if="!showResults" class="quiz-content">
      <div class="question-card">
        <div class="question-number">
          Frage {{ currentQuestionIndex + 1 }}
        </div>
        
        <h2 class="question-text">{{ currentQuestion.question }}</h2>
        
        <div class="answers-container">
          <div 
            v-for="(answer, index) in currentQuestion.answers" 
            :key="index"
            class="answer-option"
            :class="{ 
              'selected': selectedAnswer === index,
              'correct': showFeedback && answer.correct,
              'incorrect': showFeedback && selectedAnswer === index && !answer.correct,
              'disabled': showFeedback
            }"
            @click="selectAnswer(index)"
          >
            <span class="answer-letter">{{ String.fromCharCode(65 + index) }}</span>
            <span class="answer-text">{{ answer.text }}</span>
            <span v-if="showFeedback && answer.correct" class="answer-icon">✓</span>
            <span v-else-if="showFeedback && selectedAnswer === index && !answer.correct" class="answer-icon">✗</span>
          </div>
        </div>

        <!-- Feedback -->
        <div v-if="showFeedback" class="feedback-container">
          <div class="feedback" :class="{ 'correct': isCorrect, 'incorrect': !isCorrect }">
            <div class="feedback-icon">
              <span v-if="isCorrect">🎉</span>
              <span v-else>💡</span>
            </div>
            <div class="feedback-content">
              <h3 v-if="isCorrect">Richtig!</h3>
              <h3 v-else>Nicht ganz richtig</h3>
              <p>{{ currentQuestion.explanation }}</p>
              <div class="points-earned" v-if="isCorrect">
                +{{ pointsPerQuestion }} Punkte
              </div>
            </div>
          </div>
          
          <button 
            @click="nextQuestion" 
            class="next-button"
            :class="{ 'btn-success': isCorrect, 'btn-primary': !isCorrect }"
          >
            <span v-if="currentQuestionIndex < questions.length - 1">Nächste Frage →</span>
            <span v-else>Ergebnisse anzeigen</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Results Screen -->
    <div v-if="showResults" class="results-screen">
      <div class="results-card">
        <div class="results-header">
          <h1>🏆 Quiz abgeschlossen!</h1>
          <div class="score-circle">
            <div class="score-text">
              <span class="score-number">{{ correctAnswers }}</span>
              <span class="score-total">/{{ questions.length }}</span>
            </div>
          </div>
        </div>
        
        <div class="results-stats">
          <div class="stat-item">
            <span class="stat-label">Richtige Antworten:</span>
            <span class="stat-value">{{ correctAnswers }}/{{ questions.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Erfolgsquote:</span>
            <span class="stat-value">{{ Math.round((correctAnswers / questions.length) * 100) }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Punkte erhalten:</span>
            <span class="stat-value">{{ totalPoints }} Punkte</span>
          </div>
        </div>

        <div class="performance-message">
          <h3>{{ performanceMessage.title }}</h3>
          <p>{{ performanceMessage.text }}</p>
        </div>

        <div class="action-buttons">
          <button @click="restartQuiz" class="btn-secondary">
            🔄 Quiz wiederholen
          </button>
          <button @click="goToAdventure" class="btn-primary">
            🕵️ Zum Abenteuer
          </button>
          <button @click="goHome" class="btn-primary">
            🏠 Zur Startseite
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Answer {
  text: string
  correct: boolean
}

interface Question {
  question: string
  answers: Answer[]
  explanation: string
}

// Reactive state
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const showFeedback = ref(false)
const showResults = ref(false)
const userAnswers = ref<boolean[]>([])
const pointsPerQuestion = 20

// Quiz questions
const questions: Question[] = [
  {
    question: "Was versteht man unter 'personenbezogenen Daten'?",
    answers: [
      { text: "Nur Name und Adresse einer Person", correct: false },
      { text: "Alle Informationen, die sich auf eine identifizierte oder identifizierbare Person beziehen", correct: true },
      { text: "Nur Daten, die online gespeichert werden", correct: false },
      { text: "Nur Daten von Erwachsenen", correct: false }
    ],
    explanation: "Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen - dazu gehören Name, Adresse, E-Mail, aber auch IP-Adressen oder Cookies."
  },
  {
    question: "Welches Recht haben Sie bezüglich Ihrer gespeicherten Daten?",
    answers: [
      { text: "Recht auf Auskunft über gespeicherte Daten", correct: true },
      { text: "Daten dürfen niemals gelöscht werden", correct: false },
      { text: "Unternehmen müssen keine Auskunft geben", correct: false },
      { text: "Nur Behörden dürfen Daten einsehen", correct: false }
    ],
    explanation: "Sie haben das Recht auf Auskunft über alle Ihre gespeicherten Daten. Außerdem haben Sie Rechte auf Berichtigung, Löschung und Datenübertragbarkeit."
  },
  {
    question: "Was ist bei der Verwendung von Passwörtern am wichtigsten?",
    answers: [
      { text: "Das gleiche Passwort für alle Dienste verwenden", correct: false },
      { text: "Passwörter sollten kurz und einfach sein", correct: false },
      { text: "Für jeden Dienst ein eigenes, starkes Passwort verwenden", correct: true },
      { text: "Passwörter auf Post-its schreiben", correct: false }
    ],
    explanation: "Verwenden Sie für jeden Online-Dienst ein eigenes, starkes Passwort mit mindestens 8 Zeichen, Buchstaben, Zahlen und Sonderzeichen. Ein Passwort-Manager kann dabei helfen."
  },
  {
    question: "Wann dürfen Unternehmen Ihre Daten an Dritte weitergeben?",
    answers: [
      { text: "Immer, ohne Einschränkungen", correct: false },
      { text: "Nur mit Ihrer ausdrücklichen Einwilligung oder auf gesetzlicher Grundlage", correct: true },
      { text: "Nur an andere Unternehmen, nicht an Privatpersonen", correct: false },
      { text: "Nur gegen Bezahlung", correct: false }
    ],
    explanation: "Ihre Daten dürfen nur mit Ihrer ausdrücklichen Einwilligung oder auf einer anderen gesetzlichen Grundlage an Dritte weitergegeben werden. Sie haben das Recht zu wissen, wer Ihre Daten erhält."
  },
  {
    question: "Was sollten Sie in sozialen Netzwerken beachten?",
    answers: [
      { text: "Alle persönlichen Informationen öffentlich teilen", correct: false },
      { text: "Privatsphäre-Einstellungen überprüfen und sparsam mit persönlichen Daten umgehen", correct: true },
      { text: "Nur Freunde aus dem echten Leben hinzufügen", correct: false },
      { text: "Profile müssen immer öffentlich sein", correct: false }
    ],
    explanation: "Überprüfen Sie regelmäßig Ihre Privatsphäre-Einstellungen und seien Sie sparsam mit persönlichen Informationen. Überlegen Sie, wer Ihre Beiträge sehen kann und soll."
  }
]

// Computed properties
const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const progressPercentage = computed(() => ((currentQuestionIndex.value + 1) / questions.length) * 100)
const correctAnswers = computed(() => userAnswers.value.filter(answer => answer).length)
const totalPoints = computed(() => correctAnswers.value * pointsPerQuestion)
const isCorrect = computed(() => {
  if (selectedAnswer.value === null) return false
  return currentQuestion.value.answers[selectedAnswer.value].correct
})

const performanceMessage = computed(() => {
  const percentage = Math.round((correctAnswers.value / questions.length) * 100)
  
  if (percentage >= 80) {
    return {
      title: "Ausgezeichnet! 🌟",
      text: "Du hast ein sehr gutes Verständnis für Datenschutz. Weiter so!"
    }
  } else if (percentage >= 60) {
    return {
      title: "Gut gemacht! 👍",
      text: "Du kennst schon viele wichtige Datenschutz-Grundlagen. Mit etwas mehr Übung wirst du zum Experten!"
    }
  } else if (percentage >= 40) {
    return {
      title: "Das war ein Anfang! 📚",
      text: "Du hast bereits einiges gelernt, aber es gibt noch Raum für Verbesserungen. Schau dir die Lernmodule nochmal an!"
    }
  } else {
    return {
      title: "Noch etwas Übung nötig! 💪",
      text: "Datenschutz ist ein komplexes Thema. Gehe nochmal durch die Lernmodule und versuche es dann erneut!"
    }
  }
})

// Methods
const selectAnswer = (index: number) => {
  if (showFeedback.value) return
  
  selectedAnswer.value = index
  showFeedback.value = true
  
  // Save answer
  userAnswers.value[currentQuestionIndex.value] = isCorrect.value
  
  // Update total points in localStorage
  if (isCorrect.value) {
    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0')
    const newPoints = currentPoints + pointsPerQuestion
    localStorage.setItem('userPoints', newPoints.toString())
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    showFeedback.value = false
  } else {
    showResults.value = true
    saveQuizResults()
  }
}

const saveQuizResults = () => {
  const results = {
    score: correctAnswers.value,
    total: questions.length,
    percentage: Math.round((correctAnswers.value / questions.length) * 100),
    points: totalPoints.value,
    completedAt: new Date().toISOString()
  }
  localStorage.setItem('quizResults', JSON.stringify(results))
  localStorage.setItem('quizCompleted', 'true')
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  showFeedback.value = false
  showResults.value = false
  userAnswers.value = []
}

const goToAdventure = () => {
  router.push('/adventure')
}

const goHome = () => {
  router.push('/')
}

// Lifecycle
onMounted(() => {
  // Initialize user answers array
  userAnswers.value = new Array(questions.length).fill(false)
})
</script>

<style scoped>
.quiz-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.quiz-header {
  text-align: center;
  margin-bottom: 30px;
}

.quiz-header h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.quiz-header p {
  color: #666;
  font-size: 1.2rem;
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
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.5s ease;
}

.progress-text {
  font-weight: bold;
  color: #666;
  font-size: 16px;
}

.question-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.question-number {
  background: linear-gradient(90deg, #667eea, #764ba2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 20px;
}

.question-text {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 30px;
  line-height: 1.4;
}

.answers-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.answer-option {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.answer-option:hover:not(.disabled) {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.answer-option.selected {
  border-color: #667eea;
  background: #f8f9ff;
}

.answer-option.correct {
  border-color: #4CAF50;
  background: #e8f5e8;
  color: #2e7d32;
}

.answer-option.incorrect {
  border-color: #f44336;
  background: #ffebee;
  color: #c62828;
}

.answer-option.disabled {
  cursor: not-allowed;
}

.answer-letter {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.answer-option.correct .answer-letter {
  background: #4CAF50;
}

.answer-option.incorrect .answer-letter {
  background: #f44336;
}

.answer-text {
  flex: 1;
  font-size: 16px;
  line-height: 1.4;
}

.answer-icon {
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
}

.feedback-container {
  margin-top: 30px;
}

.feedback {
  display: flex;
  gap: 20px;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
}

.feedback.correct {
  background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  border: 2px solid #4CAF50;
}

.feedback.incorrect {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  border: 2px solid #ff9800;
}

.feedback-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.feedback-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
}

.feedback-content p {
  margin: 0 0 15px 0;
  line-height: 1.5;
  color: #555;
}

.points-earned {
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  display: inline-block;
  font-size: 14px;
}

.next-button {
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.btn-success {
  background: #4CAF50;
  color: white;
}

.btn-success:hover {
  background: #45a049;
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

.results-screen {
  text-align: center;
}

.results-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.results-header h1 {
  color: #333;
  margin-bottom: 30px;
}

.score-circle {
  width: 120px;
  height: 120px;
  border: 8px solid #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.score-text {
  color: white;
  text-align: center;
}

.score-number {
  font-size: 2.5rem;
  font-weight: bold;
  display: block;
}

.score-total {
  font-size: 1.2rem;
}

.results-stats {
  display: grid;
  gap: 20px;
  margin: 30px 0;
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: bold;
  color: #333;
}

.performance-message {
  margin: 30px 0;
  padding: 25px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-radius: 12px;
  border: 2px solid #2196F3;
}

.performance-message h3 {
  color: #1976D2;
  margin-bottom: 10px;
}

.performance-message p {
  color: #555;
  margin: 0;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
}

.action-buttons button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

@media (max-width: 768px) {
  .quiz-view {
    padding: 15px;
  }
  
  .question-card {
    padding: 25px;
  }
  
  .question-text {
    font-size: 1.3rem;
  }
  
  .answer-option {
    padding: 15px;
  }
  
  .feedback {
    flex-direction: column;
    gap: 15px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .results-card {
    padding: 25px;
  }
}
</style>