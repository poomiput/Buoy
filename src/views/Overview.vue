<template>
  <div class="overview-page">
    <!-- Buoy Selector -->
    

    <!-- Map -->
    <MapView v-if="isVisible('mapView')" :buoys="buoysData" />
    
    <!-- Stats for Selected Buoy -->
    <div class="selected-buoy-header" v-if="selectedBuoy && isVisible('statsCards')">
      <h2 class="selected-title">
        📊 {{ selectedBuoy.buoy_id }} Details
      </h2>
      <span class="selected-timestamp">
        Last update: {{ formatTime(selectedBuoy.timestamp) }}
      </span>
    </div>
    <StatsCards v-if="isVisible('statsCards')" :buoy="selectedBuoy" />
  </div>
  <div class="buoy-selector-container" v-if="buoysData.length > 0">
      <div class="selector-header">
        <h2 class="selector-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
          </svg>
          Select Buoy
        </h2>
        <span class="buoy-count">{{ buoysData.length }} buoys online</span>
      </div>
      <div class="buoy-cards">
        <div 
          v-for="buoy in buoysData" 
          :key="buoy.buoy_id" 
          class="buoy-card"
          :class="{ active: selectedBuoy && selectedBuoy.buoy_id === buoy.buoy_id, [getBuoyStatus(buoy)]: true }"
          @click="selectBuoy(buoy)"
        >
          <div class="buoy-card-status"></div>
          <div class="buoy-card-content">
            <span class="buoy-card-id">{{ buoy.buoy_id }}</span>
            <span class="buoy-card-location">{{ buoy.gps.lat.toFixed(2) }}°N, {{ buoy.gps.lon.toFixed(2) }}°E</span>
          </div>
          <div class="buoy-card-stats">
            <span class="mini-stat">🌡️ {{ buoy.water.temp_c }}°C</span>
            <span class="mini-stat">🔋 {{ buoy.power.battery_v }}V</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import MapView from '../components/MapView.vue';
import StatsCards from '../components/StatsCards.vue';

export default {
  name: 'Overview',
  components: { MapView, StatsCards },
  data() {
    return {
      buoysData: [],
      selectedBuoy: null
    };
  },
  mounted() {
    fetch('/mock_data.json')
      .then(response => response.json())
      .then(data => {
        this.buoysData = data;
        this.selectedBuoy = this.buoysData.length ? this.buoysData[0] : null;
      })
      .catch(err => {
        console.error('Failed to load buoy data:', err);
      });
  },
  methods: {
    selectBuoy(buoy) {
      this.selectedBuoy = buoy;
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString('th-TH');
    },
    getBuoyStatus(buoy) {
      const { temp_c, do_mg_l, turbidity_ntu } = buoy.water;
      const { battery_v } = buoy.power;
      const thresholds = {
        temp_c: { warn: 32, critical: 35 },
        do_mg_l: { warn: 5, critical: 3 },
        turbidity_ntu: { warn: 10, critical: 20 },
        battery_v: { warn: 12, critical: 11 }
      };
      let critical = false;
      let warning = false;
      if (temp_c > thresholds.temp_c.critical) critical = true;
      if (do_mg_l < thresholds.do_mg_l.critical) critical = true;
      if (turbidity_ntu > thresholds.turbidity_ntu.critical) critical = true;
      if (battery_v < thresholds.battery_v.critical) critical = true;
      if (!critical) {
        if (temp_c > thresholds.temp_c.warn) warning = true;
        if (do_mg_l < thresholds.do_mg_l.warn) warning = true;
        if (turbidity_ntu > thresholds.turbidity_ntu.warn) warning = true;
        if (battery_v < thresholds.battery_v.warn) warning = true;
      }
      if (critical) return 'critical';
      if (warning) return 'warning';
      return 'ok';
    },
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
.overview-page {
  display: flex;
  flex-direction: column;
}

/* Buoy Selector */
.buoy-selector-container {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  margin: 1.5rem;
  margin-bottom: 0;
  padding: 1.25rem;
  animation: fadeIn 0.5s ease-out;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.selector-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.selector-title svg {
  width: 22px;
  height: 22px;
  color: #3b82f6;
}

.buoy-count {
  font-size: 0.875rem;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.buoy-cards {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.buoy-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1rem;
  min-width: 180px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.buoy-card:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.buoy-card.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.buoy-card-status {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.buoy-card.ok .buoy-card-status {
  background: linear-gradient(180deg, #10b981, #059669);
}

.buoy-card.warning .buoy-card-status {
  background: linear-gradient(180deg, #f59e0b, #d97706);
}

.buoy-card.critical .buoy-card-status {
  background: linear-gradient(180deg, #ef4444, #dc2626);
  animation: pulse 1.5s ease-in-out infinite;
}

.buoy-card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 0.75rem;
}

.buoy-card-id {
  font-weight: 600;
  color: #f1f5f9;
  font-size: 0.95rem;
}

.buoy-card-location {
  font-size: 0.75rem;
  color: #64748b;
}

.buoy-card-stats {
  display: flex;
  gap: 0.75rem;
}

.mini-stat {
  font-size: 0.75rem;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.05);
  padding: 3px 8px;
  border-radius: 6px;
}

/* Selected Buoy Header */
.selected-buoy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  margin-top: 1rem;
}

.selected-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.selected-timestamp {
  font-size: 0.85rem;
  color: #64748b;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Scrollbar for buoy cards */
.buoy-cards::-webkit-scrollbar {
  height: 6px;
}

.buoy-cards::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.buoy-cards::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 3px;
}

@media (max-width: 768px) {
  .buoy-selector-container {
    margin: 1rem;
  }
  
  .selector-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .selected-buoy-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 0 1rem;
  }
}
</style>
