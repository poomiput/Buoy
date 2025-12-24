Ocean Buoy Monitoring Dashboard (Vue.js Project)
Introduction
This is a web dashboard for an ocean buoy monitoring system built with Vue.js 3 as the frontend framework. It displays real-time sensor data from ocean buoys on an interactive map and in various UI components. The dashboard uses Leaflet.js with OpenStreetMap for the map view, and Chart.js for plotting line graphs of sensor readings. All data is currently pulled from a local mock JSON file (mock_data.json), and the code is commented to indicate where real API calls can be integrated in the future. The UI includes a top navigation bar to switch between an Overview (map + summary), Charts (historical graphs), and Raw Data (detailed readings in a table with CSV export). The layout and components are designed to be responsive for both desktop and mobile screens.
Project Structure
The project is organized into the following files and directories (using Vue 3 + Vite structure as an example):
•	public/
•	index.html – Main HTML file (includes the Vue app mount point).
•	mock_data.json – Mock dataset of buoy sensor readings (used in place of API data).
•	src/
•	main.js – Application entry point; creates Vue app, sets up router, imports global CSS (Leaflet).
•	router/index.js – Vue Router configuration for SPA navigation (Overview, Charts, Raw Data pages).
•	App.vue – Root Vue component that includes the navigation bar and router view.
•	components/ – Reusable Vue components.
o	NavBar.vue – Top navigation bar component with links to each page.
o	MapView.vue – Map component using Leaflet.js to display buoy markers and popups.
o	StatsCards.vue – Dashboard cards showing key sensor values (water temp, DO, turbidity, battery) with colored status indicators.
o	ChartView.vue – Component wrapping a Chart.js line chart (for a single metric).
o	DataTable.vue – Component for detailed tabular data and an Export CSV button.
•	views/ – Higher-level view components for each page/section.
o	Overview.vue – Overview page combining the MapView and StatsCards components.
o	Charts.vue – Charts page showing multiple ChartView components for various metrics.
o	RawData.vue – Raw Data page showing the DataTable component.
•	package.json – Project manifest including dependencies (Vue, Vue Router, Leaflet, Chart.js, etc.).
•	README.md – (Optional) Documentation and setup instructions for the project.
Setup and Installation
Follow these steps to set up and run the project:
1.	Prerequisites: Ensure you have Node.js (>= 14.x) and npm installed on your system.
2.	Create a Vue Project: You can use Vite (the Vue 3 default tooling) or Vue CLI. For example, using Vite:

 	npm init vue@latest ocean-buoy-dashboard
cd ocean-buoy-dashboard
npm install
 	Choose to include Vue Router when prompted. This will set up a new Vue 3 project.
3.	Install Dependencies: Add Leaflet and Chart.js to the project:

 	npm install leaflet chart.js
 	This will update package.json with these libraries.
4.	Add Project Files: Incorporate the code from this answer into the project. Create the components and views as shown in the structure above (replacing the placeholder files created by the scaffold). Copy the content for each file (main.js, App.vue, etc.) into the corresponding location. Also, add the provided mock_data.json to the public/ directory.
5.	Run the Development Server: Start the app in development mode:

 	npm run dev   # for Vite-based project
 	This should launch the app at a local URL (usually http://localhost:5173/ for Vite). Open this URL in your web browser to view the dashboard.
6.	Build for Production: (Optional) Use npm run build to produce a minified build in the dist/ folder, which can be deployed to a web server.
Now, we will go through the important files and their contents, with explanations and comments indicating where you can connect to real APIs or adjust configurations.
Main Application Files
src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

// Fix Leaflet's default icon paths so marker icons load properly (optional, for some bundlers)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
});

// Create and mount the Vue application
createApp(App)
  .use(router)              // integrate Vue Router
  .mount('#app');
Explanation: This is the entry file that creates the Vue application instance, attaches the router, and mounts the app to the DOM element with id app in index.html. We also import Leaflet's CSS here so that the map components are styled correctly. The code includes a fix to ensure Leaflet's marker icon images are resolved correctly by the module bundler (so you see the default pin icons on the map). In a real deployment, you might move this Leaflet icon fix to a more appropriate place or use custom markers.
src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Overview from '../views/Overview.vue';
import Charts from '../views/Charts.vue';
import RawData from '../views/RawData.vue';

const routes = [
  { path: '/',        name: 'Overview', component: Overview },
  { path: '/charts',  name: 'Charts',   component: Charts },
  { path: '/raw-data',name: 'RawData',  component: RawData }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
Explanation: This configures Vue Router with three routes corresponding to the pages: Overview, Charts, and Raw Data. The createWebHistory() mode enables clean URLs (requires server support for history mode). Each route is associated with a component that will be rendered when the route is active. The NavBar component will provide links to navigate between these routes.
src/App.vue
<template>
  <div id="app">
    <NavBar />
    <router-view />  <!-- This renders the active page component (Overview/Charts/RawData) -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
export default {
  name: 'App',
  components: { NavBar }
};
</script>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
Explanation: The root component sets up the basic layout. It includes the <NavBar> at the top and a <router-view> below it, which will display the component matching the current route. We also include some global CSS: removing default body margin and setting a base font. The #app container is made a flex container to facilitate layout (though in this simple case, it's mostly to ensure the footer could be pushed if there was one, etc.).
Components
src/components/NavBar.vue
<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/"       active-class="active-link">Overview</router-link></li>
      <li><router-link to="/charts" active-class="active-link">Charts</router-link></li>
      <li><router-link to="/raw-data" active-class="active-link">Raw Data</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
};
</script>

<style>
.navbar {
  background: #333;
  color: #fff;
  padding: 0.5em 1em;
}
.navbar ul {
  list-style: none;
  display: flex;
  gap: 1em;
  margin: 0;
  padding: 0;
}
.navbar li a {
  color: #fff;
  text-decoration: none;
}
.navbar li a.active-link {
  font-weight: bold;
  text-decoration: underline;
}
</style>
Explanation: The NavBar is a simple navigation menu at the top of the app. It uses <router-link> components to link to different routes (Overview, Charts, Raw Data). The active-class="active-link" sets a CSS class on the link when its route is active, so we can style the active page's link distinctly. Basic styling is applied: a dark background, horizontal layout with space between items, and white text. On small screens, the links will simply wrap or stack because of the flex container.
src/components/MapView.vue
<template>
  <div class="map-container">
    <!-- Map will render into this div by Leaflet -->
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
    // Initialize the Leaflet map
    this.map = L.map('map').setView([0, 0], 5);  // center at [0,0] with low zoom initially
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Add markers for each buoy in the data
    if (this.buoys && this.buoys.length > 0) {
      const bounds = [];
      this.buoys.forEach(buoy => {
        const { lat, lon } = buoy.gps;
        const status = this.getBuoyStatus(buoy);
        // Choose marker color based on status
        const color = status === 'Critical' ? 'red'
                     : status === 'Warning' ? 'orange'
                     : 'green';
        // Create a circle marker (colored dot) at buoy location
        const marker = L.circleMarker([lat, lon], { color: color, radius: 8 }).addTo(this.map);
        // Popup content with buoy details
        const popupContent =
          '<b>Buoy ' + buoy.buoy_id + '</b><br/>' +
          new Date(buoy.timestamp).toLocaleString() + '<br/>' +
          'Water Temp: ' + buoy.water.temp_c + ' °C<br/>' +
          'DO: ' + buoy.water.do_mg_l + ' mg/L<br/>' +
          'Turbidity: ' + buoy.water.turbidity_ntu + ' NTU<br/>' +
          'Battery: ' + buoy.power.battery_v + ' V';
        marker.bindPopup(popupContent);  // attach popup to marker
        bounds.push([lat, lon]);
      });
      // Auto-adjust map view to fit all markers (with padding)
      if (bounds.length > 0) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  },
  methods: {
    // Determine overall status of a buoy (OK, Warning, Critical) based on sensor thresholds
    getBuoyStatus(buoy) {
      const { temp_c, do_mg_l, turbidity_ntu } = buoy.water;
      const { battery_v } = buoy.power;
      // Thresholds for demo purposes (could be adjusted or loaded from config)
      const thresholds = {
        temp_c:      { warn: 32, critical: 35 },   // water temperature (°C)
        do_mg_l:     { warn: 5,  critical: 3  },   // dissolved oxygen (mg/L) - low values are bad
        turbidity_ntu:{ warn: 10, critical: 20 },  // turbidity (NTU)
        battery_v:   { warn: 12, critical: 11 }    // battery voltage (V)
      };
      let critical = false;
      let warning = false;
      // Check critical conditions
      if (temp_c > thresholds.temp_c.critical) critical = true;
      if (do_mg_l < thresholds.do_mg_l.critical) critical = true;
      if (turbidity_ntu > thresholds.turbidity_ntu.critical) critical = true;
      if (battery_v < thresholds.battery_v.critical) critical = true;
      // Check warnings if not critical
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
  height: 45vh; /* Map takes roughly 45% of viewport height */
}
.map {
  width: 100%;
  height: 100%;
}
</style>
Explanation: The MapView component encapsulates the Leaflet map. On mount, it creates a map on the element with id="map", adds the OpenStreetMap tile layer, and then iterates through the buoys prop (an array of buoy data objects) to place a marker for each buoy. We use L.circleMarker to create a colored dot instead of the default pin icon for simplicity of coloring. The color of the marker is determined by a getBuoyStatus method, which compares the buoy's sensor readings to predefined thresholds to classify the status as OK (green), Warning (orange), or Critical (red). Clicking a marker shows a popup with the buoy's ID, timestamp, and key sensor readings (water temperature, dissolved oxygen, turbidity, and battery voltage). After adding all markers, we adjust the map view (fitBounds) to ensure all buoys are visible.
Comment: In a real application, the thresholds for sensor status might come from a config or API, and you might have more sophisticated logic. Also, for many buoys or rapidly updating data, consider using clustering or other performance optimizations on the map. The code is written for clarity and demonstration purposes.
src/components/StatsCards.vue
<template>
  <div class="stats-cards" v-if="buoy">
    <!-- Each stat item displays one sensor value with a colored status indicator -->
    <div class="stat-item status-indicator" :class="statusClass('temp')">
      <h4>Water Temp</h4>
      <p>{{ buoy.water.temp_c.toFixed(1) }} °C</p>
    </div>
    <div class="stat-item status-indicator" :class="statusClass('do')">
      <h4>Dissolved O₂</h4>
      <p>{{ buoy.water.do_mg_l.toFixed(1) }} mg/L</p>
    </div>
    <div class="stat-item status-indicator" :class="statusClass('turbidity')">
      <h4>Turbidity</h4>
      <p>{{ buoy.water.turbidity_ntu.toFixed(1) }} NTU</p>
    </div>
    <div class="stat-item status-indicator" :class="statusClass('battery')">
      <h4>Battery</h4>
      <p>{{ buoy.power.battery_v.toFixed(1) }} V</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsCards',
  props: {
    buoy: Object  // expects a buoy data object for the current selection
  },
  methods: {
    // Return 'ok', 'warning', or 'critical' based on the metric's value (for CSS styling)
    statusClass(metric) {
      if (!this.buoy) return '';
      const w = this.buoy.water;
      const p = this.buoy.power;
      // Same threshold values as used in MapView for consistency
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

<style>
.stats-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
}
.stat-item {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  flex: 1 1 200px; /* responsive: each card at least 200px, flexibly grow */
}
.stat-item h4 {
  margin: 0 0 0.25rem;
}
.stat-item p {
  margin: 0;
  font-size: 1.2em;
  font-weight: bold;
}
.status-indicator.ok {
  border-left: 8px solid green;
}
.status-indicator.warning {
  border-left: 8px solid orange;
}
.status-indicator.critical {
  border-left: 8px solid red;
}
</style>
Explanation: StatsCards displays four key metrics from the buoy: water temperature, dissolved oxygen, turbidity, and battery voltage. Each metric is shown in its own "card" (a styled <div>). A colored left border indicates the status (green for ok, orange for warning, red for critical), using the same threshold logic as the map markers. The statusClass method returns a string that corresponds to a CSS class (ok, warning, or critical) based on the value of each metric. We format the numeric values to one decimal place for display. The layout uses a flex container that wraps, so on narrow screens the cards will stack vertically or break into multiple rows as needed. This component expects a single buoy object as a prop (for example, the currently selected or primary buoy of interest).
Note: If there were multiple buoys and the dashboard needed to display an overview of all, you might adjust this component to show averages or to allow selecting a buoy. In this example, we simply use the first buoy's data for demonstration.
src/components/ChartView.vue
<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
export default {
  name: 'ChartView',
  props: {
    label: String,       // Label for the dataset (e.g., "Water Temperature (°C)")
    chartData: Array,    // Array of data points (e.g., [29.0, 29.1, 29.3, ...])
    chartLabels: Array,  // Array of labels for x-axis (e.g., timestamps or time labels)
    color: {
      type: String,
      default: '#007BFF' // default line color (can be overridden via prop)
    }
  },
  data() {
    return {
      chartInstance: null
    };
  },
  mounted() {
    // Initialize Chart.js line chart when component mounts
    const ctx = this.$refs.canvas;
    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: this.label,
          data: this.chartData,
          borderColor: this.color,
          backgroundColor: this.color,
          fill: false,
          tension: 0.1    // adds a slight curve to the line
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,  // allow chart to resize freely
        scales: {
          x: { 
            display: true, 
            title: { display: true, text: 'Time' } 
          },
          y: { 
            display: true, 
            title: { display: true, text: this.label } 
          }
        }
      }
    });
  },
  beforeUnmount() {
    // Destroy chart instance to avoid memory leaks when component is removed
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
};
</script>

<style>
.chart-container {
  position: relative;
  height: 300px; /* fixed height for the chart area */
  width: 100%;
}
</style>
Explanation: ChartView is a reusable component that renders a single line chart using Chart.js. It takes in props for the data, labels, and display label of the dataset, as well as an optional color. When the component mounts, it creates a new Chart.js chart on the <canvas> element referenced by this.$refs.canvas. The chart configuration in this example is a simple line chart with one dataset. The responsive: true and maintainAspectRatio: false options allow the chart to resize with its container (we set a container height of 300px via CSS, and width 100% so it fills the parent width). We also specify axis labels: the x-axis is generically labeled "Time" and the y-axis label is set to the provided dataset label (for example, "Water Temperature (°C)"). The component destroys the chart in the beforeUnmount hook, which is good practice to cleanup Chart.js instances when navigating away from the component.
By adjusting the props, this component can render any time-series data. In a real scenario, you might feed it actual historical data points and time labels (e.g., timestamps or formatted time strings).
src/components/DataTable.vue
<template>
  <div class="data-table">
    <button @click="exportCSV">Export CSV</button>
    <table>
      <thead>
        <tr>
          <th>Buoy ID</th>
          <th>Timestamp</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Wind Speed (m/s)</th>
          <th>Wind Dir (°)</th>
          <th>Air Temp (°C)</th>
          <th>Humidity (%)</th>
          <th>Pressure (hPa)</th>
          <th>Rain (mm)</th>
          <th>Solar (W/m²)</th>
          <th>Water Temp (°C)</th>
          <th>DO (mg/L)</th>
          <th>pH</th>
          <th>Turbidity (NTU)</th>
          <th>Chlorophyll (µg/L)</th>
          <th>Light (PAR)</th>
          <th>Battery (V)</th>
          <th>Solar Power (W)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="buoy in buoys" :key="buoy.buoy_id">
          <td>{{ buoy.buoy_id }}</td>
          <td>{{ buoy.timestamp }}</td>
          <td>{{ buoy.gps.lat }}</td>
          <td>{{ buoy.gps.lon }}</td>
          <td>{{ buoy.weather.wind_speed_ms }}</td>
          <td>{{ buoy.weather.wind_dir_deg }}</td>
          <td>{{ buoy.weather.air_temp_c }}</td>
          <td>{{ buoy.weather.humidity_pct }}</td>
          <td>{{ buoy.weather.pressure_hpa }}</td>
          <td>{{ buoy.weather.rain_mm }}</td>
          <td>{{ buoy.weather.solar_wm2 }}</td>
          <td>{{ buoy.water.temp_c }}</td>
          <td>{{ buoy.water.do_mg_l }}</td>
          <td>{{ buoy.water.ph }}</td>
          <td>{{ buoy.water.turbidity_ntu }}</td>
          <td>{{ buoy.water.chlorophyll_ug_l }}</td>
          <td>{{ buoy.water.light_par }}</td>
          <td>{{ buoy.power.battery_v }}</td>
          <td>{{ buoy.power.solar_w }}</td>
        </tr>
      </tbody>
    </table>
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
    exportCSV() {
      if (!this.buoys.length) return;
      // Prepare CSV content
      const headers = [
        'Buoy ID','Timestamp','Latitude','Longitude',
        'Wind Speed (m/s)','Wind Dir (deg)','Air Temp (C)','Humidity (%)',
        'Pressure (hPa)','Rain (mm)','Solar (W/m2)',
        'Water Temp (C)','DO (mg/L)','pH','Turbidity (NTU)',
        'Chlorophyll (ug/L)','Light (PAR)',
        'Battery (V)','Solar Power (W)'
      ];
      const rows = this.buoys.map(b => [
        b.buoy_id,
        b.timestamp,
        b.gps.lat,
        b.gps.lon,
        b.weather.wind_speed_ms,
        b.weather.wind_dir_deg,
        b.weather.air_temp_c,
        b.weather.humidity_pct,
        b.weather.pressure_hpa,
        b.weather.rain_mm,
        b.weather.solar_wm2,
        b.water.temp_c,
        b.water.do_mg_l,
        b.water.ph,
        b.water.turbidity_ntu,
        b.water.chlorophyll_ug_l,
        b.water.light_par,
        b.power.battery_v,
        b.power.solar_w
      ]);
      let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\\n';
      rows.forEach(rowArray => {
        csvContent += rowArray.join(',') + '\\n';
      });
      // Create a download link and click it programmatically
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'buoy_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Note: For a robust solution, use a CSV library or handle commas in data properly.
    }
  }
};
</script>

<style>
.data-table {
  max-width: 100%;
  overflow-x: auto;  /* enable horizontal scroll on small screens */
  margin: 1rem 0;
}
.data-table button {
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
}
.data-table table {
  border-collapse: collapse;
  width: 100%;
  min-width: 800px; /* ensure table is wide enough to show all columns */
}
.data-table th, .data-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}
.data-table th {
  background: #eee;
}
</style>
Explanation: The DataTable component displays the raw data in a tabular format, and provides an "Export CSV" button to download the data as a CSV file. It expects a prop buoys which is an array of buoy data objects. In the template, we construct a table with a header row for each field (Buoy ID, Timestamp, Latitude, Longitude, and various sensor readings). The table body iterates through each buoy object and displays its values in the columns.
The Export CSV feature is implemented in the exportCSV method. It builds a CSV string manually: first adding the header row, then each data row. Finally, it creates a temporary anchor element with a data URI containing the CSV content and triggers a download. This will download a file named buoy_data.csv to the user's computer containing all the data currently shown in the table. We include a note that for more complex scenarios (e.g., values containing commas or newlines), a robust CSV generation approach or library might be preferable.
Styling: We allow the table container to scroll horizontally (overflow-x: auto) so that on smaller screens the user can scroll to see all columns rather than breaking the layout. We also set a minimum width on the table to avoid it squishing too narrowly. Table cells are given a light border and some padding, and the header has a light gray background for clarity. The export button has some basic padding and margin.
Views
Now let's look at the higher-level view components that represent each page of the dashboard. These views use the components described above to compose the full UI for each section.
src/views/Overview.vue
<template>
  <div class="overview-page">
    <!-- Top half: Map -->
    <MapView :buoys="buoysData" />
    <!-- Bottom half: Summary cards (using first buoy as selected buoy) -->
    <StatsCards :buoy="selectedBuoy" />
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
      buoysData: [],      // all buoy data (array)
      selectedBuoy: null  // currently selected buoy for detailed stats (e.g., the first buoy)
    };
  },
  mounted() {
    // Load data from the mock JSON file.
    // In a real app, this is where you'd call an API endpoint instead.
    fetch('/mock_data.json')
      .then(response => response.json())
      .then(data => {
        this.buoysData = data;
        // Use the first buoy's data for the stats cards (assuming at least one buoy exists)
        this.selectedBuoy = this.buoysData.length ? this.buoysData[0] : null;
      })
      .catch(err => {
        console.error('Failed to load buoy data:', err);
      });
  }
};
</script>

<style>
.overview-page {
  display: flex;
  flex-direction: column;
}
</style>
Explanation: The Overview page combines the Map and the Stats cards. We fetch the buoy data from mock_data.json when the component mounts. Once the data is loaded, we set buoysData (passed into the MapView to plot the markers) and also set selectedBuoy to the first element of that data array. We then bind selectedBuoy to the StatsCards component to display its details. This assumes that there is at least one buoy in the data; in case the array is empty, selectedBuoy remains null and the StatsCards component (which has a v-if="buoy" guard) will simply not render.
If multiple buoys were present and the user could select among them, you could extend this page to allow clicking on a marker to set selectedBuoy accordingly (for example, by listening to marker click events and updating selectedBuoy). For simplicity, we just show the first buoy's stats. The MapView itself already includes popups on markers to quickly inspect any buoy.
The layout here is columnar: the MapView (with a fixed height of ~45vh) on top, and the StatsCards underneath.
src/views/Charts.vue
<template>
  <div class="charts-page">
    <!-- Line charts for various sensor values (using mock series data) -->
    <ChartView 
      label="Water Temperature (°C)" 
      :chartLabels="timeLabels" 
      :chartData="tempSeries" 
      color="#E69F00" />
    <ChartView 
      label="Dissolved Oxygen (mg/L)" 
      :chartLabels="timeLabels" 
      :chartData="doSeries" 
      color="#009E73" />
    <ChartView 
      label="Turbidity (NTU)" 
      :chartLabels="timeLabels" 
      :chartData="turbSeries" 
      color="#0072B2" />
    <ChartView 
      label="Battery Voltage (V)" 
      :chartLabels="timeLabels" 
      :chartData="batterySeries" 
      color="#CC79A7" />
  </div>
</template>

<script>
import ChartView from '../components/ChartView.vue';
export default {
  name: 'Charts',
  components: { ChartView },
  data() {
    return {
      // Time labels for the X-axis (e.g., last 30 minutes with 10-min interval)
      timeLabels: ['16:00', '16:10', '16:20', '16:30'],
      // Mock data series for demonstration (in real app, fetch historical data here)
      tempSeries:    [28.9, 29.0, 29.1, 29.1],
      doSeries:      [5.8, 5.7, 5.6, 5.6],
      turbSeries:    [7.0, 7.2, 7.3, 7.3],
      batterySeries: [12.4, 12.3, 12.3, 12.3]
    };
  }
  // (If connecting to an API, you might use mounted() to fetch actual time-series data)
};
</script>

<style>
.charts-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}
/* Ensure canvas charts don't overflow and scale down on small screens */
.charts-page canvas {
  max-width: 100%;
}
</style>
Explanation: The Charts page displays line charts for different metrics over time. We reuse the ChartView component for each metric. Here we've included four charts: Water Temperature, Dissolved Oxygen, Turbidity, and Battery Voltage. Each ChartView is provided with a set of labels (time points) and a series of values. We use color props to differentiate each line (these color codes are arbitrary choices for the example). The data provided here (tempSeries, doSeries, etc.) are mock values meant to show how the chart might look; in a real application you would replace this with actual historical data from your backend or data service.
For instance, you might perform an API call in the mounted() hook of this component to retrieve an array of recent sensor readings (timestamps and values) for each metric, then populate the series arrays and the corresponding timeLabels. That part is marked in comments. The layout uses a column flexbox with some gap between charts. We also ensure the <canvas> elements are limited to max-width: 100% so they shrink on narrower screens if needed (Chart.js is responsive by default with the options we set in ChartView).
src/views/RawData.vue
<template>
  <div class="raw-data-page">
    <DataTable :buoys="buoysData" />
  </div>
</template>

<script>
import DataTable from '../components/DataTable.vue';
export default {
  name: 'RawData',
  components: { DataTable },
  data() {
    return {
      buoysData: []
    };
  },
  mounted() {
    // Fetch the same mock data (or real data via API) for detailed table view
    fetch('/mock_data.json')
      .then(res => res.json())
      .then(data => {
        this.buoysData = data;
      })
      .catch(err => console.error('Failed to load data for table:', err));
  }
};
</script>

<style>
.raw-data-page {
  padding: 1rem;
}
</style>
Explanation: The Raw Data page simply fetches the buoy data (just like the Overview did) and passes it to the DataTable component for display. This page focuses on providing a detailed view of the data, possibly including fields not visualized elsewhere, and gives the user the option to export the data. We use the same mock_data.json for consistency, but in a real scenario, this could be a separate endpoint or the same data used in the Overview. The component is padded for some spacing. The DataTable itself handles its internal layout and scrolling.
Because this example uses a small static JSON, we fetch it again here independently. In a more advanced app, you might use a state management store (like Vuex/Pinia) or an event bus to avoid duplicate fetching and share data between views, but to keep things straightforward we perform the fetch in both Overview and RawData views separately. This also has the effect that if the data were updated and the user navigated to Raw Data later, they'd get the latest info.
Mock Data
Finally, here is the structure of the mock JSON data used for this dashboard. The file is placed in the public/ directory as mock_data.json so it can be fetched via a simple HTTP request. In this example, we include two buoy entries to illustrate multiple markers and table rows. You can add or remove objects in this array to simulate different scenarios (each object represents the latest reading from one buoy).
public/mock_data.json
[
  {
    "buoy_id": "TH-BOUY-01",
    "timestamp": "2025-12-24T16:30:00+07:00",
    "gps": { "lat": 16.44, "lon": 102.83 },
    "weather": {
      "wind_speed_ms": 5.2,
      "wind_dir_deg": 210,
      "air_temp_c": 31.4,
      "humidity_pct": 78,
      "pressure_hpa": 1008.2,
      "rain_mm": 0.0,
      "solar_wm2": 640
    },
    "water": {
      "temp_c": 29.1,
      "do_mg_l": 5.6,
      "ph": 8.1,
      "turbidity_ntu": 7.3,
      "chlorophyll_ug_l": 2.4,
      "light_par": 120
    },
    "power": { "battery_v": 12.3, "solar_w": 18.5 }
  },
  {
    "buoy_id": "TH-BOUY-02",
    "timestamp": "2025-12-24T16:30:00+07:00",
    "gps": { "lat": 16.50, "lon": 102.90 },
    "weather": {
      "wind_speed_ms": 4.0,
      "wind_dir_deg": 190,
      "air_temp_c": 30.8,
      "humidity_pct": 80,
      "pressure_hpa": 1007.5,
      "rain_mm": 0.0,
      "solar_wm2": 630
    },
    "water": {
      "temp_c": 33.0,
      "do_mg_l": 3.2,
      "ph": 8.0,
      "turbidity_ntu": 15.0,
      "chlorophyll_ug_l": 2.0,
      "light_par": 115
    },
    "power": { "battery_v": 11.8, "solar_w": 17.0 }
  }
]
Explanation: Each buoy object contains an ID, a timestamp (ISO format with timezone), GPS coordinates, and nested objects for different categories of measurements: - weather: wind speed & direction, air temperature, humidity, barometric pressure, rainfall, and solar irradiance. - water: water temperature, dissolved oxygen (DO), pH, turbidity, chlorophyll, and light (PAR sensor). - power: battery voltage and solar panel wattage.
These values are purely for example. The thresholds in the code (for marker color and status) are tuned to these ranges (for instance, buoy 02 has a higher water temperature and lower DO, which would put it in "Warning" or "Critical" status). In a real system, you would define thresholds appropriate to your context (perhaps based on environmental standards or operational limits).
The Map will plot two markers at the given lat/lon, StatsCards (if using the first buoy) will show TH-BOUY-01's four key metrics, Charts uses its own dummy series (not directly derived from this file), and the Raw Data table will list both entries in full detail. The code is structured so that replacing the data source with a real API should be straightforward (just swap out the fetch URL and ensure the data format matches).
________________________________________
Conclusion: This Vue.js project demonstrates a simple yet comprehensive dashboard for ocean buoy data. The code is heavily commented to guide future development, such as where to integrate real APIs or adjust thresholds and settings. By running this project, you should be able to see a working dashboard with a map, charts, and data table using the provided mock data. All UI text and code comments are in English as requested, and the layout is responsive. From here, you can expand the functionality (e.g. add user interactions, refine the UI with a component library, or connect to live data streams) as needed for your application. Enjoy your new ocean buoy monitoring dashboard!
________________________________________
Admin Panel Implementation (No Authentication)
To fulfill the requirements, we'll create a new /admin page in the Vue app that allows developers to toggle the visibility of various dashboard modules. This Admin Panel will use simple toggle switches (checkboxes) to turn features on or off, with the preferences stored in localStorage (client-side only, no backend). Other pages (Overview, Charts, Raw Data, etc.) will read these settings from localStorage to decide whether to show or hide each module. No authentication is implemented for this route (security is not enforced), so it’s meant for developer use only (obscure URL). In the future, a backend or proper auth can replace localStorage for secure access.
Admin.vue – Admin Panel Component
Below is the code for the Admin.vue component. It provides a list of toggle switches for each module: Map View, Stats Cards, Chart Page, Raw Data Table, and Export CSV Button. The component initializes the toggle states by reading any saved preferences from localStorage (defaulting to all modules visible if nothing is saved). Whenever a toggle is changed, the new setting is immediately saved to localStorage so it persists across page reloads[1][2]. The UI uses a checkbox input for each module with a label, and basic styling ensures the toggles are user-friendly on desktop and mobile.
<template>
  <div class="admin-panel">
    <h1>Admin Panel</h1>
    <p>Toggle modules on or off (settings are saved in your browser).</p>
    <!-- Render a checkbox for each module toggle -->
    <div v-for="module in moduleList" :key="module.key" class="module-toggle">
      <label>
        <input type="checkbox" v-model="moduleSettings[module.key]" />
        {{ module.label }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
  data() {
    return {
      // Module visibility settings (default all true)
      moduleSettings: {
        mapView: true,
        statsCards: true,
        chartPage: true,
        rawDataTable: true,
        exportCsv: true
      },
      // List of modules for iteration in template
      moduleList: [
        { key: 'mapView',      label: 'Map View' },
        { key: 'statsCards',   label: 'Stats Cards' },
        { key: 'chartPage',    label: 'Chart Page' },
        { key: 'rawDataTable', label: 'Raw Data Table' },
        { key: 'exportCsv',    label: 'Export CSV Button' }
      ]
    };
  },
  created() {
    // Load saved settings from localStorage (if any)
    const saved = localStorage.getItem('moduleSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Assign saved preferences, fall back to default if key missing
        Object.assign(this.moduleSettings, parsed);
      } catch (e) {
        console.error('Failed to parse saved module settings:', e);
      }
    }
  },
  watch: {
    // Watch for any change in moduleSettings and save to localStorage
    moduleSettings: {
      deep: true,
      handler(newVal) {
        localStorage.setItem('moduleSettings', JSON.stringify(newVal));
      }
    }
  }
  /* 
    Note: This admin panel has no authentication and is not secure. 
    It is intended for DEV use only (การควบคุมนี้ยังไม่ปลอดภัย ใช้สำหรับ dev เท่านั้น).
    In the future, replace localStorage with a secure backend or API.
  */
};
</script>

<style scoped>
.admin-panel {
  max-width: 400px;
  margin: 20px auto;
  padding: 10px;
}
.module-toggle {
  margin: 8px 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
}
.module-toggle label {
  cursor: pointer;
  user-select: none;
}
.module-toggle input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.2);
}
</style>
How this works: On creation, the component tries to read a JSON string from localStorage under the key "moduleSettings". If found, it parses it and applies those values (for example, if "mapView": false was saved previously, the Map View toggle will initialize as off). We use JSON.stringify and JSON.parse so that boolean values are stored correctly as strings and retrieved as booleans[2][3]. A Vue watcher (with deep: true) monitors the moduleSettings object; whenever a toggle is changed by the user, the watcher callback writes the entire moduleSettings object back to localStorage in JSON format. This means the preferences persist across page reloads (since localStorage data remains in the browser until cleared)[1].
UI/UX: The toggles are simple checkbox inputs for now (we style them slightly larger for easier mobile use). Each checkbox is wrapped in a <label> so clicking the text also toggles the box. This layout is mobile-friendly and can be further enhanced with custom CSS if a slider-style switch is desired. All content is in a centered container for clarity. (As a developer-only page, heavy styling isn't critical, but it's responsive enough for mobile testing.)
Router Configuration for /admin
We need to register the new /admin route so that the Admin Panel component is accessible. In the Vue Router setup (usually in src/router/index.js or similar), add an entry for the admin path. For example, using Vue Router:
// router/index.js (snippet)
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import AdminPanel from '@/components/Admin.vue';  // import the Admin component

const routes = [
  { path: '/', component: HomePage },
  // ... other routes
  { path: '/admin', name: 'Admin', component: AdminPanel }  // new Admin route
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
This adds the Admin Panel to our SPA's routes. Now, navigating to http://<your-app-url>/#/admin (Vue 2 with hash mode) or /admin (Vue 3 history mode) will load the Admin.vue component. We do not implement any authentication or route guarding here, so anyone who knows the URL can access it. This is intentional for the development phase (security by obscurity) but should be addressed later. The above pattern is analogous to adding any new route in Vue Router[4] – we import the component and include a { path, component } object in the routes array.
(Remember to update any navigation or menus if needed: since this Admin page is hidden from regular users, you might not link it in the main navbar. Only developers would directly navigate to the URL.)
Using LocalStorage Toggles in Other Components
With the Admin Panel in place, other parts of the dashboard need to respect these toggle settings. Each module or page will read from localStorage to determine if it should render. Since we stored all module preferences under the moduleSettings key in localStorage, we can retrieve that in any component. For example, in the Overview page (which contains the Map View and Stats Cards sections), you might do:
<template>
  <div class="overview-page">
    <!-- Only show MapView component if the toggle is ON -->
    <MapView v-if="isVisible('mapView')" />
    <!-- Only show StatsCards component if toggle is ON -->
    <StatsCards v-if="isVisible('statsCards')" />
    <!-- ...other content... -->
  </div>
</template>

<script>
import MapView from '@/components/MapView.vue';
import StatsCards from '@/components/StatsCards.vue';

export default {
  components: { MapView, StatsCards },
  methods: {
    // Helper to check if a module is enabled in localStorage
    isVisible(moduleKey) {
      const settingsStr = localStorage.getItem('moduleSettings');
      if (!settingsStr) {
        return true; // no settings saved => default to visible
      }
      try {
        const settings = JSON.parse(settingsStr);
        // Return true (show) unless the setting explicitly exists and is false
        return settings[moduleKey] !== false;
      } catch (e) {
        console.error('Error reading module settings:', e);
        return true;
      }
    }
  }
};
</script>
In this snippet, isVisible(key) checks the saved settings for a given module key. We default to true (show the module) if there's no stored setting or if parsing fails, which is a safe fallback. If the Admin Panel has set, for example, { "mapView": false } in storage, then isVisible('mapView') will return false and the <MapView> component will not be rendered. This same pattern can be used in any component or page:
•	Map View component: Render its content only if isVisible('mapView') (or check directly in script and conditionally mount).
•	Stats Cards component: Check statsCards flag similarly.
•	Chart Page route: You might hide the navigation link to the Chart page if chartPage is off. If you want to be thorough, you could also prevent the Chart route from loading or redirect if a user manually visits it when disabled. For now, simply not showing the menu item is sufficient.
•	Raw Data Table page: Likewise, hide its menu link if off, or conditionally render a message if accessed.
•	Export CSV Button: In the Raw Data page (or wherever the button is), wrap the button in a v-if="isVisible('exportCsv')" to hide it when the toggle is off.
Each module reads the same moduleSettings from localStorage, so they all stay in sync with what was set on the Admin page. Because localStorage is a simple key-value store in the browser, this approach is straightforward[1]. However, note that changes take effect for each user session separately (the toggles apply per browser, since there's no server involved). For a development scenario this is fine.
Developer Note: This Admin Panel approach is intentionally lightweight and not secure. Storing feature flags in localStorage means anyone with access to the app (who knows about the Admin URL) could open the dev panel and change settings. There’s no authentication or authorization. Use this only during development or internal demos. If you later introduce a backend, you should move these controls to a secure admin interface (with login) and persist settings in a database or through an API, rather than client-side storage. This way, you can safely toggle features for all users in a controlled manner.
________________________________________
[1] [2] [3] How to Persist User Data with LocalStorage in Vue | alexop.dev
https://alexop.dev/posts/how-to-persist-user-data-with-localstorage-in-vue/
[4] Part 3 - Adding The Vue Router to our Application | TutorialEdge.net
https://tutorialedge.net/projects/building-imgur-clone-vuejs-nodejs/part-3-adding-vue-router/
