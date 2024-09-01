<template>
    <transition name="fade">
      <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="fixed inset-0 bg-black opacity-50" @click="closeModal"></div>
        <div class="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full mx-4 sm:mx-0">
          <h2 class="text-2xl font-semibold mb-6">Coupon Details</h2>
          <div v-if="coupon" class="space-y-4">
            <p><strong class="font-medium">Code:</strong> {{ coupon.code }}</p>
            <p><strong class="font-medium">Name:</strong> {{ coupon.name }}</p>
            <p><strong class="font-medium">Start Date:</strong> {{ coupon.start_date }}</p>
            <p><strong class="font-medium">End Date:</strong> {{ coupon.end_date }}</p>
            <p><strong class="font-medium">Created At:</strong> {{ coupon.created_at }}</p>
          </div>
          <div v-else class="text-gray-500">Loading...</div>
          <button @click="closeModal" class="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">Close</button>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  import api from "@/axios";
  
  export default {
    name: "CouponDetailModal",
    props: {
      code: {
        type: String,
        default: '',
      },
      isVisible: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        coupon: null,
      };
    },
    watch: {
      code(newCode) {
        if (newCode) {
          this.fetchCouponDetail();
        }
      },
    },
    methods: {
      async fetchCouponDetail() {
        try {
          const response = await api.get(`/api/dashboard/customer-service/v1/coupons/${this.code}`);
          if (response.data.response_code === "2000000") {
            this.coupon = response.data;
          } else {
            console.error("Failed to fetch coupon detail:", response.data.response_message);
          }
        } catch (error) {
          console.error("Error fetching coupon detail:", error);
        }
      },
      closeModal() {
        this.$emit('update:isVisible', false);
      },
    },
    mounted() {
      if (this.code) {
        this.fetchCouponDetail();
      }
    },
  };
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  