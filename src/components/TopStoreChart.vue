<template>
  <section class="bg-white p-4 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Top Stores</h2>
    <canvas id="topStoresChart" width="400" height="200"></canvas>
  </section>
</template>

<script>
import api from "@/axios";
import { Chart, registerables } from "chart.js";
import router from "@/router";

export default {
  name: "TopStoreChart",
  data() {
    return {
      topStores: [],
      colors: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ],
      borderColors: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
    };
  },
  async created() {
    await this.fetchTopStores();
    this.renderChart();
  },
  methods: {
    async fetchTopStores() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await api.get(
          "/api/dashboard/common/v1/summaries/top/stores?limit=5",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.response_code === "2000000") {
          this.topStores = response.data.items;
        } else {
          console.error(
            "Failed to fetch top stores:",
            response.data.response_message
          );
          if (response.data.response_code === "401") {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching top stores:", error);

        if (error.response && error.response.status === 401) {
          router.push("/login");
        }
      }
    },
    renderChart() {
      Chart.register(...registerables);

      const ctx = document.getElementById("topStoresChart").getContext("2d");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.topStores.map((store) => store.name),
          datasets: [
            {
              label: "Amount",
              data: this.topStores.map((store) =>
                parseFloat(store.amount.replace("M", "").replace(",", "."))
              ), // Convert amount to number
              backgroundColor: this.colors,
              borderColor: this.borderColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
