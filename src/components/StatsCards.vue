<template>
  <div class="stats-sections" v-if="buoy">
    <!-- Weather Section -->
    <div class="stats-section" v-if="isVisible('weatherSection')">
      <h3 class="section-title">
        <span class="section-icon">🌤️</span>
        Weather Conditions
      </h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon wind-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Wind Speed</span>
            <span class="stat-value">{{ buoy.weather.wind_speed_ms }}<span class="stat-unit">m/s</span></span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon compass-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Wind Direction</span>
            <span class="stat-value">{{ buoy.weather.wind_dir_deg }}<span class="stat-unit">°</span></span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon air-temp-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Air Temp</span>
            <span class="stat-value">{{ buoy.weather.air_temp_c }}<span class="stat-unit">°C</span></span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon humidity-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Humidity</span>
            <span class="stat-value">{{ buoy.weather.humidity_pct }}<span class="stat-unit">%</span></span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon pressure-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Pressure</span>
            <span class="stat-value">{{ buoy.weather.pressure_hpa }}<span class="stat-unit">hPa</span></span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon rain-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="16" y1="13" x2="16" y2="21"/>
              <line x1="8" y1="13" x2="8" y2="21"/>
              <line x1="12" y1="15" x2="12" y2="23"/>
              <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Rain</span>
            <span class="stat-value">{{ buoy.weather.rain_mm }}<span class="stat-unit">mm</span></span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon solar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Solar Irradiance</span>
            <span class="stat-value">{{ buoy.weather.solar_wm2 }}<span class="stat-unit">W/m²</span></span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Water Quality Section -->
    <div class="stats-section" v-if="isVisible('waterSection')">
      <h3 class="section-title">
        <span class="section-icon">🌊</span>
        Water Quality
      </h3>
      <div class="stats-grid">
        <div class="stat-card" :class="showStatus ? statusClass('temp') : ''">
          <div class="stat-icon water-temp-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Water Temp</span>
            <span class="stat-value">{{ buoy.water.temp_c }}<span class="stat-unit">°C</span></span>
          </div>
          <div class="stat-indicator" v-if="showStatus"></div>
        </div>
        
        <div class="stat-card" :class="showStatus ? statusClass('do') : ''">
          <div class="stat-icon do-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 12h8"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Dissolved O₂</span>
            <span class="stat-value">{{ buoy.water.do_mg_l }}<span class="stat-unit">mg/L</span></span>
          </div>
          <div class="stat-indicator" v-if="showStatus"></div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon ph-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v12M8 12h8"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">pH Level</span>
            <span class="stat-value">{{ buoy.water.ph }}<span class="stat-unit"></span></span>
          </div>
        </div>
        
        <div class="stat-card" :class="showStatus ? statusClass('turbidity') : ''">
          <div class="stat-icon turb-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Turbidity</span>
            <span class="stat-value">{{ buoy.water.turbidity_ntu }}<span class="stat-unit">NTU</span></span>
          </div>
          <div class="stat-indicator" v-if="showStatus"></div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon chloro-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Chlorophyll</span>
            <span class="stat-value">{{ buoy.water.chlorophyll_ug_l }}<span class="stat-unit">µg/L</span></span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon light-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Light (PAR)</span>
            <span class="stat-value">{{ buoy.water.light_par }}<span class="stat-unit">µmol</span></span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Power Section -->
    <div class="stats-section" v-if="isVisible('powerSection')">
      <h3 class="section-title">
        <span class="section-icon">⚡</span>
        Power Status
      </h3>
      <div class="stats-grid">
        <div class="stat-card" :class="showStatus ? statusClass('battery') : ''">
          <div class="stat-icon battery-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="18" height="10" rx="2"/>
              <path d="M22 10v4"/>
              <rect x="4" y="9" width="10" height="6" rx="1" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Battery</span>
            <span class="stat-value">{{ buoy.power.battery_v }}<span class="stat-unit">V</span></span>
          </div>
          <div class="stat-indicator" v-if="showStatus"></div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon solar-power-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="8" width="20" height="12" rx="2"/>
              <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
              <line x1="2" y1="14" x2="22" y2="14"/>
              <line x1="8" y1="8" x2="8" y2="20"/>
              <line x1="16" y1="8" x2="16" y2="20"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Solar Power</span>
            <span class="stat-value">{{ buoy.power.solar_w }}<span class="stat-unit">W</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsCards',
  props: {
    buoy: Object
  },
  computed: {
    showStatus() {
      return this.isVisible('statusIndicators');
    }
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
    },
    statusClass(metric) {
      if (!this.buoy) return '';
      const w = this.buoy.water;
      const p = this.buoy.power;
      const thresholds = {
        temp:      { warn: 32, critical: 35 },
        do:        { warn: 5,  critical: 3 },
        turbidity: { warn: 10, critical: 20 },
        battery:   { warn: 12, critical: 11 }
      };
      if (metric === 'temp') {
        if (w.temp_c > thresholds.temp.critical)   return 'critical';
        if (w.temp_c > thresholds.temp.warn)       return 'warning';
      } else if (metric === 'do') {
        if (w.do_mg_l < thresholds.do.critical)    return 'critical';
        if (w.do_mg_l < thresholds.do.warn)        return 'warning';
      } else if (metric === 'turbidity') {
        if (w.turbidity_ntu > thresholds.turbidity.critical) return 'critical';
        if (w.turbidity_ntu > thresholds.turbidity.warn)     return 'warning';
      } else if (metric === 'battery') {
        if (p.battery_v < thresholds.battery.critical)       return 'critical';
        if (p.battery_v < thresholds.battery.warn)           return 'warning';
      }
      return 'ok';
    }
  }
};
</script>

<style scoped>
.stats-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
}

.stats-section {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1.5rem;
  animation: fadeIn 0.5s ease-out forwards;
}

.stats-section:nth-child(1) { animation-delay: 0.1s; }
.stats-section:nth-child(2) { animation-delay: 0.2s; }
.stats-section:nth-child(3) { animation-delay: 0.3s; }

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 1.25rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.section-icon {
  font-size: 1.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.12);
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 22px;
  height: 22px;
}

.wind-icon { background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%); color: #60a5fa; }
.compass-icon { background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%); color: #a78bfa; }
.air-temp-icon { background: linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%); color: #fb923c; }
.humidity-icon { background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%); color: #22d3ee; }
.pressure-icon { background: linear-gradient(135deg, rgba(107, 114, 128, 0.2) 0%, rgba(156, 163, 175, 0.2) 100%); color: #9ca3af; }
.rain-icon { background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%); color: #3b82f6; }
.solar-icon { background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%); color: #fbbf24; }
.water-temp-icon { background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%); color: #f97316; }
.do-icon { background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%); color: #10b981; }
.ph-icon { background: linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(192, 132, 252, 0.2) 100%); color: #c084fc; }
.turb-icon { background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%); color: #3b82f6; }
.chloro-icon { background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(74, 222, 128, 0.2) 100%); color: #4ade80; }
.light-icon { background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(250, 204, 21, 0.2) 100%); color: #facc15; }
.battery-icon { background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%); color: #8b5cf6; }
.solar-power-icon { background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%); color: #f59e0b; }

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.stat-label {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1;
}

.stat-unit {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  margin-left: 3px;
}

.stat-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  transition: background 0.3s ease;
}

.stat-card.ok .stat-indicator {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

.stat-card.warning .stat-indicator {
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
}

.stat-card.critical .stat-indicator {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@media (max-width: 768px) {
  .stats-sections {
    padding: 1rem;
    gap: 1rem;
  }
  
  .stats-section {
    padding: 1.25rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
}
</style>
