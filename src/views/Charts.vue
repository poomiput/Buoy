<template>
  <div class="charts-page" v-if="isVisible('chartPage')">
    <div class="page-header">
      <h1 class="page-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
        Historical Data
      </h1>
      <p class="page-subtitle">Real-time sensor trends and analytics</p>
    </div>
    <div class="charts-grid">
      <ChartView 
        label="Water Temperature (°C)" 
        :chartLabels="timeLabels" 
        :chartData="tempSeries" 
        color="#f59e0b" />
      <ChartView 
        label="Dissolved Oxygen (mg/L)" 
        :chartLabels="timeLabels" 
        :chartData="doSeries" 
        color="#10b981" />
      <ChartView 
        label="Turbidity (NTU)" 
        :chartLabels="timeLabels" 
        :chartData="turbSeries" 
        color="#3b82f6" />
      <ChartView 
        label="Battery Voltage (V)" 
        :chartLabels="timeLabels" 
        :chartData="batterySeries" 
        color="#8b5cf6" />
    </div>
  </div>
  <div v-else class="disabled-page">
    <div class="disabled-icon">📊</div>
    <p>Charts are disabled by admin settings.</p>
  </div>
</template>

<script>
import ChartView from '../components/ChartView.vue';
export default {
  name: 'Charts',
  components: { ChartView },
  data() {
    return {
      timeLabels: ['16:00', '16:10', '16:20', '16:30'],
      tempSeries:    [28.9, 29.0, 29.1, 29.1],
      doSeries:      [5.8, 5.7, 5.6, 5.6],
      turbSeries:    [7.0, 7.2, 7.3, 7.3],
      batterySeries: [12.4, 12.3, 12.3, 12.3]
    };
  },
  methods: {
    isVisible(moduleKey) {
      const settingsStr = localStorage.getItem('moduleSettings');
      if (!settingsStr) return true;
      try {
        const settings = JSON.parse(settingsStr);
        return settings[moduleKey] !== false;
      } catch (e) {
        return true;
      }
    }
  }
};
</script>

<style scoped>
.charts-page {
  padding: 1.5rem;
  animation: fadeIn 0.5s ease-out;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
}

.page-title svg {
  width: 28px;
  height: 28px;
  color: #3b82f6;
}

.page-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
}

.disabled-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: #64748b;
}

.disabled-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .charts-page {
    padding: 1rem;
  }
}
</style>
