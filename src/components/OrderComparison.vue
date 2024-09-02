<template>
  <section class="bg-white p-4 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Order Comparison</h2>
    <p class="text-gray-800">
      Percentage Change: {{ orderComparison.percentage }}%
    </p>
    <canvas id="orderComparisonChart" width="400" height="200"></canvas>
  </section>
</template>

<script>
import { Chart, registerables } from "chart.js";
import api from "@/axios";

export default {
  name: "OrderComparison",
  data() {
    return {
      orderComparison: {
        current: {
          month: "",
          amount: "",
        },
        previous: {
          month: "",
          amount: "",
        },
        percentage: "",
      },
    };
  },
  async created() {
    await this.fetchOrderComparison();
    this.renderChart();
  },
  methods: {
    async fetchOrderComparison() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await api.get(
          "/api/dashboard/common/v1/summaries/orders/comparison",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.response_code === "2000000") {
          this.orderComparison = response.data;
        } else {
          console.error(
            "Failed to fetch order comparison:",
            response.data.response_message
          );
        }
      } catch (error) {
        console.error("Error fetching order comparison:", error);
      }
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat().format(amount);
    },
    renderChart() {
      Chart.register(...registerables);

      const ctx = document
        .getElementById("orderComparisonChart")
        .getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            this.orderComparison.previous.month,
            this.orderComparison.current.month,
          ],
          datasets: [
            {
              label: "Order Amount",
              data: [
                parseFloat(this.orderComparison.previous.amount),
                parseFloat(this.orderComparison.current.amount),
              ],
              backgroundColor: [
                "rgba(153, 102, 255, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
              borderColor: ["rgba(153, 102, 255, 1)", "rgba(75, 192, 192, 1)"],
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
