<template>
  <div class="raw-data-page" v-if="isVisible('rawDataTable')">
    <DataTable :buoys="buoysData" />
  </div>
  <div v-else class="data-disabled">
    <p>Raw Data Table is disabled by admin settings.</p>
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
  },
  methods: {
    isVisible(moduleKey) {
      const settingsStr = localStorage.getItem('moduleSettings');
      if (!settingsStr) {
        return true;
      }
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

<style>
.raw-data-page {
  padding: 1rem;
}
.data-disabled {
  padding: 2rem;
  text-align: center;
  color: #666;
}
</style>
