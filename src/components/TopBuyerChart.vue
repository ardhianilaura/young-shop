<template>
  <div class="w-full">
    <div class="bg-white p-4 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Top Buyers</h2>
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
  name: "TopBuyerChart",
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
            label: "Top Buyers Amount",
            data: [],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#E7E9ED",
              "#6B8E23",
            ],
            hoverOffset: 4,
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
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw}M`;
              },
            },
          },
        },
      },
    };
  },
  async created() {
    await this.fetchTopBuyers();
  },
  methods: {
    async fetchTopBuyers() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await api.get(
          "/api/dashboard/common/v1/summaries/top/buyers?limit=5",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.response_code === "2000000") {
          const buyers = response.data.items;
          this.chartData.labels = buyers.map((buyer) => buyer.name);
          this.chartData.datasets[0].data = buyers.map((buyer) =>
            parseFloat(buyer.amount.replace("M", ""))
          );
        } else {
          console.error(
            "Failed to fetch top buyers:",
            response.data.response_message
          );
        }
      } catch (error) {
        console.error("Error fetching top buyers:", error);
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
