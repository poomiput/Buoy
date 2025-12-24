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
