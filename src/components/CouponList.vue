<template>
  <section class="bg-white p-4 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Coupon List</h2>
    <div class="flex justify-between items-center mb-4">
      <button
        @click="exportCoupons"
        class="flex gap-1 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="me-1 h-5 w-5"
        >
          <path
            fill-rule="evenodd"
            d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V10.5z"
            clip-rule="evenodd"
          />
        </svg>
        Export Coupons
      </button>
      <button
        @click="showCreateModal = true"
        class="flex gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
      >
        Create Coupon
      </button>
    </div>
    <table class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Code
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Name
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Start Date
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            End Date
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coupon in coupons" :key="coupon.code">
          <td class="px-6 py-4 whitespace-nowrap">{{ coupon.code }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ coupon.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ coupon.start_date }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ coupon.end_date }}</td>
          <td class="px-6 py-4 whitespace-nowrap gap-2 flex">
            <button
              @click="openModal(coupon.code)"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
              Detail
            </button>
            <button
              @click="editCoupon(coupon.code)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="totalPages > 1" class="mt-4 gap-4 flex justify-end mr-10">
      <button
        @click="loadPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-400 text-white rounded"
      >
        Previous
      </button>
      <button
        @click="loadPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-400 text-white rounded"
      >
        Next
      </button>
    </div>

    <!-- Coupon Detail Modal -->
    <CouponDetailModal
      :code="selectedCouponCode"
      :isVisible="isModalVisible"
      @update:isVisible="isModalVisible = $event"
    />

    <!-- Create Coupon Modal -->
    <CreateCouponModal
      :isVisible="showCreateModal"
      @update:isVisible="showCreateModal = $event"
      @couponCreated="fetchCoupons"
    />

    <!-- Update Coupon Modal -->
    <UpdateCouponModal
      v-show="showUpdateModal"
      :isVisible="showUpdateModal"
      :couponCode="selectedCouponCode"
      @update:isVisible="showUpdateModal = $event"
      @couponUpdated="fetchCoupons"
    />
  </section>
</template>

<script>
import api from "@/axios";
import CouponDetailModal from "@/components/modals/CouponDetailModal.vue";
import CreateCouponModal from "@/components/modals/CreateCouponModal.vue";
import UpdateCouponModal from "@/components/modals/UpdateCouponModal.vue";
import { saveAs } from "file-saver";

export default {
  name: "CouponList",
  components: {
    CouponDetailModal,
    CreateCouponModal,
    UpdateCouponModal,
  },
  data() {
    return {
      coupons: [],
      currentPage: 1,
      totalPages: 1,
      isModalVisible: false,
      selectedCouponCode: "",
      showCreateModal: false,
      showUpdateModal: false,
    };
  },
  async created() {
    await this.fetchCoupons();
  },
  methods: {
    async fetchCoupons(page = 1) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await api.get(
          `/api/dashboard/customer-service/v1/coupons?page=${page}&per_page=10&sort_by=name&sort_direction=asc&search_by=name&search_query=`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.response_code === "2000000") {
          this.coupons = response.data.items;
          this.totalPages = response.data.last_page;
          this.currentPage = page;
        } else {
          console.error(
            "Failed to fetch coupons:",
            response.data.response_message
          );
          if (response.data.response_code === "401") {
            this.$router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        if (error.response && error.response.status === 401) {
          this.$router.push("/login");
        }
      }
    },
    editCoupon(couponCode) {
      this.selectedCouponCode = couponCode;
      this.showUpdateModal = true;
    },
    loadPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.fetchCoupons(page);
      }
    },
    openModal(code) {
      this.selectedCouponCode = code;
      this.isModalVisible = true;
    },
    async exportCoupons() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await api.get(
          `/api/dashboard/customer-service/v1/coupons/export?sort_by=name&sort_direction=asc&search_by=name&search_query=`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );

        if (response.data) {
          const fileName = "coupons_export.csv";
          saveAs(response.data, fileName);
        } else {
          console.error("Failed to export coupons");
        }
      } catch (error) {
        console.error("Error exporting coupons:", error);
        if (error.response && error.response.status === 401) {
          this.$router.push("/login");
        }
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
