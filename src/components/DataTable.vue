<template>
  <div class="data-table-wrapper">
    <div class="table-header">
      <h2 class="table-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
        Sensor Readings
      </h2>
      <button v-if="isVisible('exportCsv')" @click="exportCSV" class="export-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export CSV
      </button>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Buoy ID</th>
            <th>Timestamp</th>
            <th>Location</th>
            <th>Wind</th>
            <th>Air Temp</th>
            <th>Humidity</th>
            <th>Pressure</th>
            <th>Water Temp</th>
            <th>DO</th>
            <th>pH</th>
            <th>Turbidity</th>
            <th>Battery</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="buoy in buoys" :key="buoy.buoy_id">
            <td class="buoy-id">{{ buoy.buoy_id }}</td>
            <td class="timestamp">{{ formatTime(buoy.timestamp) }}</td>
            <td>{{ buoy.gps.lat.toFixed(2) }}, {{ buoy.gps.lon.toFixed(2) }}</td>
            <td>{{ buoy.weather.wind_speed_ms }} m/s</td>
            <td>{{ buoy.weather.air_temp_c }}°C</td>
            <td>{{ buoy.weather.humidity_pct }}%</td>
            <td>{{ buoy.weather.pressure_hpa }} hPa</td>
            <td :class="getTempClass(buoy.water.temp_c)">{{ buoy.water.temp_c }}°C</td>
            <td :class="getDOClass(buoy.water.do_mg_l)">{{ buoy.water.do_mg_l }} mg/L</td>
            <td>{{ buoy.water.ph }}</td>
            <td :class="getTurbClass(buoy.water.turbidity_ntu)">{{ buoy.water.turbidity_ntu }} NTU</td>
            <td :class="getBatteryClass(buoy.power.battery_v)">{{ buoy.power.battery_v }}V</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    buoys: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString();
    },
    getTempClass(val) {
      if (val > 35) return 'status-critical';
      if (val > 32) return 'status-warning';
      return 'status-ok';
    },
    getDOClass(val) {
      if (val < 3) return 'status-critical';
      if (val < 5) return 'status-warning';
      return 'status-ok';
    },
    getTurbClass(val) {
      if (val > 20) return 'status-critical';
      if (val > 10) return 'status-warning';
      return 'status-ok';
    },
    getBatteryClass(val) {
      if (val < 11) return 'status-critical';
      if (val < 12) return 'status-warning';
      return 'status-ok';
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
    },
    exportCSV() {
      if (!this.buoys.length) return;
      const headers = [
        'Buoy ID','Timestamp','Latitude','Longitude',
        'Wind Speed (m/s)','Wind Dir (deg)','Air Temp (C)','Humidity (%)',
        'Pressure (hPa)','Rain (mm)','Solar (W/m2)',
        'Water Temp (C)','DO (mg/L)','pH','Turbidity (NTU)',
        'Chlorophyll (ug/L)','Light (PAR)','Battery (V)','Solar Power (W)'
      ];
      const rows = this.buoys.map(b => [
        b.buoy_id, b.timestamp, b.gps.lat, b.gps.lon,
        b.weather.wind_speed_ms, b.weather.wind_dir_deg, b.weather.air_temp_c,
        b.weather.humidity_pct, b.weather.pressure_hpa, b.weather.rain_mm,
        b.weather.solar_wm2, b.water.temp_c, b.water.do_mg_l, b.water.ph,
        b.water.turbidity_ntu, b.water.chlorophyll_ug_l, b.water.light_par,
        b.power.battery_v, b.power.solar_w
      ]);
      let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
      rows.forEach(row => { csvContent += row.join(',') + '\n'; });
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', 'buoy_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
.data-table-wrapper {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  margin: 1.5rem;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.table-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.table-title svg {
  width: 22px;
  height: 22px;
  color: #3b82f6;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.export-btn svg {
  width: 18px;
  height: 18px;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.table-container {
  overflow-x: auto;
  padding: 0.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  white-space: nowrap;
}

th {
  background: rgba(15, 23, 42, 0.5);
  color: #94a3b8;
  font-weight: 500;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

td {
  color: #e2e8f0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

tr:hover td {
  background: rgba(59, 130, 246, 0.05);
}

.buoy-id {
  font-weight: 600;
  color: #3b82f6;
}

.timestamp {
  color: #94a3b8;
  font-size: 0.8rem;
}

.status-ok { color: #10b981; }
.status-warning { color: #f59e0b; }
.status-critical { color: #ef4444; font-weight: 600; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .data-table-wrapper {
    margin: 1rem;
  }
  .table-header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
