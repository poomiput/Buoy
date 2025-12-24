<template>
  <div class="admin-page">
    <div class="admin-card">
      <div class="admin-header">
        <div class="admin-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <div>
          <h1 class="admin-title">Admin Panel</h1>
          <p class="admin-subtitle">Configure dashboard module visibility</p>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="quick-actions">
        <button @click="enableAll" class="action-btn enable-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          Enable All
        </button>
        <button @click="disableAll" class="action-btn disable-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Disable All
        </button>
        <button @click="resetDefaults" class="action-btn reset-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Reset
        </button>
      </div>

      <!-- Main Pages Section -->
      <div class="toggle-section">
        <h3 class="section-label">📄 Main Pages</h3>
        <div class="toggle-list">
          <div v-for="module in mainPages" :key="module.key" class="toggle-item">
            <div class="toggle-info">
              <span class="toggle-icon">{{ module.icon }}</span>
              <span class="toggle-label">{{ module.label }}</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="moduleSettings[module.key]" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Data Sections -->
      <div class="toggle-section">
        <h3 class="section-label">📊 Data Sections</h3>
        <div class="toggle-list">
          <div v-for="module in dataSections" :key="module.key" class="toggle-item">
            <div class="toggle-info">
              <span class="toggle-icon">{{ module.icon }}</span>
              <span class="toggle-label">{{ module.label }}</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="moduleSettings[module.key]" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="toggle-section">
        <h3 class="section-label">⚙️ Features</h3>
        <div class="toggle-list">
          <div v-for="module in features" :key="module.key" class="toggle-item">
            <div class="toggle-info">
              <span class="toggle-icon">{{ module.icon }}</span>
              <span class="toggle-label">{{ module.label }}</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="moduleSettings[module.key]" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Display Options Section -->
      <div class="toggle-section">
        <h3 class="section-label">🎨 Display Options</h3>
        <div class="toggle-list">
          <div v-for="module in displayOptions" :key="module.key" class="toggle-item">
            <div class="toggle-info">
              <span class="toggle-icon">{{ module.icon }}</span>
              <span class="toggle-label">{{ module.label }}</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="moduleSettings[module.key]" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="admin-footer">
        <div class="warning-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Dev Only — Settings stored locally
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
  data() {
    return {
      moduleSettings: {
        // Main pages
        mapView: true,
        chartPage: true,
        rawDataTable: true,
        // Data sections
        statsCards: true,
        weatherSection: true,
        waterSection: true,
        powerSection: true,
        // Features
        exportCsv: true,
        mapPopups: true,
        statusIndicators: true,
        // Display options
        animations: true,
        hoverEffects: true,
        darkMode: true
      },
      mainPages: [
        { key: 'mapView',      label: 'Map View',          icon: '🗺️' },
        { key: 'chartPage',    label: 'Charts Page',       icon: '📈' },
        { key: 'rawDataTable', label: 'Raw Data Table',    icon: '📋' }
      ],
      dataSections: [
        { key: 'statsCards',     label: 'Stats Cards',       icon: '📊' },
        { key: 'weatherSection', label: 'Weather Section',   icon: '🌤️' },
        { key: 'waterSection',   label: 'Water Quality',     icon: '🌊' },
        { key: 'powerSection',   label: 'Power Status',      icon: '⚡' }
      ],
      features: [
        { key: 'exportCsv',        label: 'Export CSV Button', icon: '💾' },
        { key: 'mapPopups',        label: 'Map Popups',        icon: '💬' },
        { key: 'statusIndicators', label: 'Status Indicators', icon: '🚦' }
      ],
      displayOptions: [
        { key: 'animations',   label: 'Animations',    icon: '✨' },
        { key: 'hoverEffects', label: 'Hover Effects', icon: '👆' },
        { key: 'darkMode',     label: 'Dark Mode',     icon: '🌙' }
      ]
    };
  },
  created() {
    const saved = localStorage.getItem('moduleSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(this.moduleSettings, parsed);
      } catch (e) {
        console.error('Failed to parse saved module settings:', e);
      }
    }
  },
  watch: {
    moduleSettings: {
      deep: true,
      handler(newVal) {
        localStorage.setItem('moduleSettings', JSON.stringify(newVal));
      }
    }
  },
  methods: {
    enableAll() {
      Object.keys(this.moduleSettings).forEach(key => {
        this.moduleSettings[key] = true;
      });
    },
    disableAll() {
      Object.keys(this.moduleSettings).forEach(key => {
        this.moduleSettings[key] = false;
      });
    },
    resetDefaults() {
      this.moduleSettings = {
        mapView: true,
        chartPage: true,
        rawDataTable: true,
        statsCards: true,
        weatherSection: true,
        waterSection: true,
        powerSection: true,
        exportCsv: true,
        mapPopups: true,
        statusIndicators: true,
        animations: true,
        hoverEffects: true,
        darkMode: true
      };
    }
  }
};
</script>

<style scoped>
.admin-page {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
}

.admin-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.5s ease-out;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.admin-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.admin-title {
  margin: 0 0 4px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
}

.admin-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.enable-btn {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.enable-btn:hover {
  background: rgba(16, 185, 129, 0.25);
  transform: translateY(-2px);
}

.disable-btn {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.disable-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  transform: translateY(-2px);
}

.reset-btn {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.reset-btn:hover {
  background: rgba(59, 130, 246, 0.25);
  transform: translateY(-2px);
}

/* Toggle Sections */
.toggle-section {
  margin-bottom: 1.25rem;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 10px 4px;
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.toggle-item:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.toggle-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-icon {
  font-size: 1.1rem;
}

.toggle-label {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.95rem;
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 26px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: rgba(100, 116, 139, 0.4);
  border-radius: 13px;
  transition: all 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  left: 3px;
  bottom: 3px;
  background: #e2e8f0;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(22px);
}

.admin-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.warning-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  color: #f59e0b;
  font-size: 0.85rem;
  background: rgba(245, 158, 11, 0.1);
  padding: 10px 16px;
  border-radius: 10px;
}

.warning-badge svg {
  width: 16px;
  height: 16px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .admin-page {
    padding: 1rem;
  }
  
  .admin-card {
    padding: 1.5rem;
  }
  
  .quick-actions {
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1 1 45%;
  }
}
</style>
