<template>
  <div class="w-full">
    <section class="bg-white p-4 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Monthly Orders</h2>
      <canvas ref="monthlyOrdersChart" width="400" height="200"></canvas>
    </section>
  </div>
</template>

<script>
import api from "@/axios";
import { Chart, registerables } from "chart.js";

export default {
  name: "MonthlyOrder",
  data() {
    return {
      monthlyOrders: [],
    };
  },
  async mounted() {
    await this.fetchData();
    this.renderChart();
  },
  methods: {
    async fetchData() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Access token is missing");
        return;
      }

      try {
        const response = await api.get(
          "/api/dashboard/common/v1/summaries/orders/monthly?start_month=2024-01&end_month=2024-08",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.response_code === "2000000") {
          this.monthlyOrders = response.data.items;
        } else {
          console.error(
            "Failed to fetch data:",
            response.data.response_message
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    renderChart() {
      Chart.register(...registerables);

      const ctx = this.$refs.monthlyOrdersChart.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.monthlyOrders.map((item) => item.month),
          datasets: [
            {
              label: "Monthly Orders",
              data: this.monthlyOrders.map((item) => parseFloat(item.orders)),
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        },
      });
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
