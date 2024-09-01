<template>
  <transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div class="fixed inset-0 bg-black opacity-50" @click="closeModal"></div>
      <div
        class="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full mx-4 sm:mx-0"
      >
        <h2 class="text-2xl font-semibold mb-6">Edit Coupon</h2>
        <form @submit.prevent="updateCoupon" class="space-y-4">
          <div>
            <label
              for="start_date"
              class="block text-sm font-medium text-gray-700"
              >Start Date:</label
            >
            <input
              type="date"
              v-model="coupon.start_date"
              id="start_date"
              required
              class="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              for="end_date"
              class="block text-sm font-medium text-gray-700"
              >End Date:</label
            >
            <input
              type="date"
              v-model="coupon.end_date"
              id="end_date"
              required
              class="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <button
            type="submit"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Save Changes
          </button>
        </form>
        <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import api from "@/axios";

export default {
  name: "UpdateCouponModal",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      coupon: {
        start_date: "",
        end_date: "",
      },
      error: null,
    };
  },
  watch: {
    couponCode(newCode) {
      if (newCode) {
        this.fetchCouponDetails();
      }
    },
    isVisible(newVal) {
      if (newVal && this.couponCode) {
        this.fetchCouponDetails();
      }
    },
  },
  methods: {
    async fetchCouponDetails() {
      try {
        const response = await api.get(
          `/api/dashboard/customer-service/v1/coupons/${this.couponCode}`
        );
        if (response.data.response_code === "2000000") {
          this.coupon.start_date = response.data.start_date;
          this.coupon.end_date = response.data.end_date;
        } else {
          this.error = "Failed to fetch coupon details.";
        }
      } catch (error) {
        this.error = "Error fetching coupon details: " + error.message;
      }
    },
    async updateCoupon() {
      try {
        const response = await api.put(
          `/api/dashboard/customer-service/v1/coupons/${this.couponCode}`,
          {
            start_date: this.coupon.start_date,
            end_date: this.coupon.end_date,
          }
        );

        if (response.data.response_code === "2000000") {
          this.$emit("couponUpdated");
          this.closeModal();
        } else {
          this.error = "Failed to update coupon.";
        }
      } catch (error) {
        this.error = "Error updating coupon: " + error.message;
      }
    },
    closeModal() {
      this.$emit("update:isVisible", false);
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
