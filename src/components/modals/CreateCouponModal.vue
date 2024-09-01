<template>
  <transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Create New Coupon</h3>
        <form @submit.prevent="createCoupon">
          <div class="mb-4">
            <label for="code" class="block text-sm font-medium text-gray-700"
              >Code</label
            >
            <input
              v-model="coupon.code"
              id="code"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <p v-if="errors.code" class="text-red-500 text-sm">
              {{ errors.code }}
            </p>
          </div>
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              v-model="coupon.name"
              id="name"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <p v-if="errors.name" class="text-red-500 text-sm">
              {{ errors.name }}
            </p>
          </div>
          <div class="mb-4">
            <label
              for="start_date"
              class="block text-sm font-medium text-gray-700"
              >Start Date</label
            >
            <input
              v-model="coupon.start_date"
              id="start_date"
              type="date"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <p v-if="errors.start_date" class="text-red-500 text-sm">
              {{ errors.start_date }}
            </p>
          </div>
          <div class="mb-4">
            <label
              for="end_date"
              class="block text-sm font-medium text-gray-700"
              >End Date</label
            >
            <input
              v-model="coupon.end_date"
              id="end_date"
              type="date"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <p v-if="errors.end_date" class="text-red-500 text-sm">
              {{ errors.end_date }}
            </p>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="$emit('update:isVisible', false)"
              class="mr-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import api from "@/axios";

export default {
  name: "CreateCouponModal",
  props: {
    isVisible: Boolean,
  },
  data() {
    return {
      coupon: {
        code: "",
        name: "",
        start_date: "",
        end_date: "",
      },
      errors: {},
    };
  },
  methods: {
    async createCoupon() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await api.post(
          "/api/dashboard/customer-service/v1/coupons",
          this.coupon,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.response_code === "2000000") {
          this.$emit("couponCreated");
          this.$emit("update:isVisible", false);
        } else {
          console.error(
            "Failed to create coupon:",
            response.data.response_message
          );
        }
      } catch (error) {
        console.error("Error creating coupon:", error);
        if (error.response && error.response.status === 401) {
          this.$router.push("/login");
        } else if (error.response && error.response.status === 422) {
          // Handle validation errors
          this.errors = error.response.data.errors || {};
        }
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
