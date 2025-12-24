<template>
  <div class="chart-wrapper">
    <div class="chart-header">
      <span class="chart-label">{{ label }}</span>
    </div>
    <div class="chart-container">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
export default {
  name: 'ChartView',
  props: {
    label: String,
    chartData: Array,
    chartLabels: Array,
    color: {
      type: String,
      default: '#3b82f6'
    }
  },
  data() {
    return {
      chartInstance: null
    };
  },
  mounted() {
    const ctx = this.$refs.canvas;
    
    // Create gradient
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, this.hexToRgba(this.color, 0.3));
    gradient.addColorStop(1, this.hexToRgba(this.color, 0));
    
    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: this.label,
          data: this.chartData,
          borderColor: this.color,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#0f172a',
          pointBorderColor: this.color,
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: this.color,
          pointHoverBorderColor: '#f1f5f9',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            displayColors: false,
            titleFont: {
              size: 14,
              weight: '600'
            },
            bodyFont: {
              size: 13
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 11
              }
            }
          }
        }
      }
    });
  },
  methods: {
    hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out forwards;
}

.chart-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.chart-label {
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.chart-container {
  position: relative;
  height: 280px;
  padding: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
