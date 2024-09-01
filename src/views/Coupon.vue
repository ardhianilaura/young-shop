<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <Navbar />

    <!-- Main content -->
    <div class="container mx-auto py-24">
      <div class="p-6 space-y-6">
        <CouponList />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import CouponList from "@/components/CouponList.vue";

export default {
  name: "Coupon",
  components: {
    Navbar,
    CouponList,
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
