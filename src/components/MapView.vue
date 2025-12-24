<template>
  <div class="map-container">
    <div class="map-header">
      <h2 class="map-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="10" r="3"/>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
        Buoy Locations
      </h2>
      <span class="buoy-count">{{ buoys.length }} buoys online</span>
    </div>
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import * as L from 'leaflet';
export default {
  name: 'MapView',
  props: {
    buoys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.map = L.map('map', {
      zoomControl: false
    }).setView([0, 0], 5);
    
    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    
    // Dark map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(this.map);

    if (this.buoys && this.buoys.length > 0) {
      const bounds = [];
      this.buoys.forEach(buoy => {
        const { lat, lon } = buoy.gps;
        const status = this.getBuoyStatus(buoy);
        const color = status === 'Critical' ? '#ef4444'
                     : status === 'Warning' ? '#f59e0b'
                     : '#10b981';
        
        // Custom styled marker
        const marker = L.circleMarker([lat, lon], { 
          color: color, 
          fillColor: color,
          fillOpacity: 0.3,
          weight: 2,
          radius: 12
        }).addTo(this.map);
        
        // Modern popup with dark styling
        const popupContent = `
          <div style="
            font-family: 'Inter', sans-serif;
            min-width: 200px;
          ">
            <div style="
              font-size: 14px;
              font-weight: 600;
              color: #f1f5f9;
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px solid rgba(255,255,255,0.1);
            ">
              🔵 ${buoy.buoy_id}
            </div>
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">
              📅 ${new Date(buoy.timestamp).toLocaleString()}
            </div>
            <div style="display: grid; gap: 6px; margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span style="color: #94a3b8;">🌡️ Water Temp</span>
                <span style="color: #f1f5f9; font-weight: 500;">${buoy.water.temp_c}°C</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span style="color: #94a3b8;">💨 DO</span>
                <span style="color: #f1f5f9; font-weight: 500;">${buoy.water.do_mg_l} mg/L</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span style="color: #94a3b8;">🌊 Turbidity</span>
                <span style="color: #f1f5f9; font-weight: 500;">${buoy.water.turbidity_ntu} NTU</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span style="color: #94a3b8;">🔋 Battery</span>
                <span style="color: #f1f5f9; font-weight: 500;">${buoy.power.battery_v}V</span>
              </div>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent, {
          className: 'dark-popup'
        });
        
        bounds.push([lat, lon]);
      });
      
      if (bounds.length > 0) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  },
  methods: {
    getBuoyStatus(buoy) {
      const { temp_c, do_mg_l, turbidity_ntu } = buoy.water;
      const { battery_v } = buoy.power;
      const thresholds = {
        temp_c:      { warn: 32, critical: 35 },
        do_mg_l:     { warn: 5,  critical: 3  },
        turbidity_ntu:{ warn: 10, critical: 20 },
        battery_v:   { warn: 12, critical: 11 }
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
      if (critical) return 'Critical';
      if (warning)  return 'Warning';
      return 'OK';
    }
  }
};
</script>

<style>
.map-container {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  margin: 1.5rem;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.map-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.map-title svg {
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

.map {
  width: 100%;
  height: 45vh;
  min-height: 350px;
}

/* Dark popup styling */
:deep(.dark-popup .leaflet-popup-content-wrapper) {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

:deep(.dark-popup .leaflet-popup-tip) {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.leaflet-popup-close-button) {
  color: #94a3b8 !important;
}

:deep(.leaflet-control-zoom a) {
  background: rgba(30, 41, 59, 0.9) !important;
  color: #f1f5f9 !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.leaflet-control-zoom a:hover) {
  background: rgba(59, 130, 246, 0.3) !important;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
