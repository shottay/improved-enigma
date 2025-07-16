<template>
  <div class="home-view">
    <div class="welcome-content">
      <div class="welcome-card">
        <div class="icon">🛡️</div>
        <h1>Willkommen beim Datenschutz Lernspiel</h1>
        <p class="description">
          Ein interaktives Webspiel zum Thema IT-Sicherheit und Datenschutz. 
          Lerne spielerisch die Grundlagen des Datenschutzes durch Erklärungen, 
          Quizzes und Point-and-Click-Abenteuer.
        </p>
        <div class="features">
          <div class="feature">
            <span class="feature-icon">📚</span>
            <span>Interaktive Lernmodule</span>
          </div>
          <div class="feature">
            <span class="feature-icon">🧩</span>
            <span>Quizzes und Rätsel</span>
          </div>
          <div class="feature">
            <span class="feature-icon">🎯</span>
            <span>Gamification-Elemente</span>
          </div>
        </div>
        <div class="start-info">
          <p>Nutze die Navigation links, um mit dem Lernen zu beginnen!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Keine reactive Daten mehr nötig - nur statischer Informationstext
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.welcome-content {
  max-width: 600px;
  width: 100%;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

h1 {
  color: #333;
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  color: #333;
  font-weight: 500;
}

.feature-icon {
  font-size: 1.5rem;
}

.start-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  margin-top: 1.5rem;
}

.start-info p {
  margin: 0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .home-view {
    padding: 1rem;
  }
  
  .welcome-card {
    padding: 2rem;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .description {
    font-size: 1rem;
  }
}
</style>