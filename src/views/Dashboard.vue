<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <Navbar />

    <!-- Main content -->
    <div class="container mx-auto py-24">
      <div class="p-6 space-y-6">
        <div class="flex gap-4 w-full">
          <div class="w-1/2">
            <MonthlyOrder />
          </div>
          <div class="w-1/2">
            <YearlyOrder />
          </div>
        </div>
        <OrderComparison />
        <div class="flex gap-4 w-full">
          <div class="w-1/2">
            <TopProduct />
          </div>
          <div class="w-1/2">
            <TopBuyer />
          </div>
        </div>
        <TopStore />
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/axios";
import Navbar from "@/components/Navbar.vue";
import MonthlyOrder from "@/components/MonthlyOrderChart.vue";
import YearlyOrder from "@/components/YearlyOrderChart.vue";
import OrderComparison from "@/components/OrderComparison.vue";
import TopProduct from "@/components/TopProductChart.vue";
import TopBuyer from "@/components/TopBuyerChart.vue";
import TopStore from "@/components/TopStoreChart.vue";

export default {
  name: "Dashboard",
  components: {
    Navbar,
    MonthlyOrder,
    YearlyOrder,
    OrderComparison,
    TopProduct,
    TopBuyer,
    TopStore,
  },
  data() {
    return {
      profile: {
        name: "",
        phone: "",
        profile_image: "",
        role_code: "",
        role_name: "",
      },
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await api.get(
          "/api/dashboard/common/v1/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.response_code === "2000000") {
          this.profile = {
            name: response.data.name,
            phone: response.data.phone,
            profile_image: response.data.profile_image,
            role_code: response.data.role_code,
            role_name: response.data.role_name,
          };
        } else {
          console.error(
            "Failed to fetch profile:",
            response.data.response_message
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
    goToProfile() {
      this.$router.push("/profile");
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
