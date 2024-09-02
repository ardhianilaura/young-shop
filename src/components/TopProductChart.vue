<template>
  <div class="w-full">
    <div class="bg-white p-4 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Top Products</h2>
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else>
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/axios";
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  CategoryScale
);

export default {
  components: {
    Doughnut,
  },
  data() {
    return {
      loading: true,
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Product Amount",
            data: [],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              },
            },
          },
        },
      },
    };
  },
  async created() {
    await this.fetchTopProducts();
  },
  methods: {
    async fetchTopProducts() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await api.get(
          "/api/dashboard/common/v1/summaries/top/products?limit=5",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.response_code === "2000000") {
          const products = response.data.items;
          this.chartData.labels = products.map((product) => product.name);
          this.chartData.datasets[0].data = products.map((product) =>
            parseFloat(product.amount.replace("M", "").replace(",", ""))
          );
        } else {
          console.error(
            "Failed to fetch top products:",
            response.data.response_message
          );
        }
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
