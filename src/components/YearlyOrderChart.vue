<template>
  <div class="w-full">
    <section class="bg-white p-4 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Yearly Orders</h2>
      <canvas ref="yearlyOrdersChart" width="400" height="200"></canvas>
    </section>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import api from "@/axios";

export default {
  name: "YearlyOrdersChart",
  data() {
    return {
      yearlyOrders: [],
    };
  },
  async created() {
    await this.fetchYearlyOrders();
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    async fetchYearlyOrders() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await api.get(
          "/api/dashboard/common/v1/summaries/orders/yearly?start_year=2021&end_year=2024",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.response_code === "2000000") {
          this.yearlyOrders = response.data.items;
          this.renderChart(); // Ensure chart is rendered after data is fetched
        } else {
          console.error(
            "Failed to fetch yearly orders:",
            response.data.response_message
          );
        }
      } catch (error) {
        console.error("Error fetching yearly orders:", error);
      }
    },
    renderChart() {
      if (this.yearlyOrders.length === 0) return;

      Chart.register(...registerables);

      new Chart(this.$refs.yearlyOrdersChart, {
        type: "line",
        data: {
          labels: this.yearlyOrders.map((item) => item.year),
          datasets: [
            {
              label: "Yearly Orders",
              data: this.yearlyOrders.map((item) => parseFloat(item.amount)),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value.toLocaleString();
                },
              },
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
