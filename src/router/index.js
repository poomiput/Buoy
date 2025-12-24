import { createRouter, createWebHistory } from 'vue-router';
import Overview from '../views/Overview.vue';
import Charts from '../views/Charts.vue';
import RawData from '../views/RawData.vue';
import Admin from '../views/Admin.vue';

const routes = [
    { path: '/', name: 'Overview', component: Overview },
    { path: '/charts', name: 'Charts', component: Charts },
    { path: '/raw-data', name: 'RawData', component: RawData },
    { path: '/admin', name: 'Admin', component: Admin }
];

export default createRouter({
    history: createWebHistory(),
    routes
});
