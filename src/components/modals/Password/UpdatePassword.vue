<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Update Password</h2>
      <form @submit.prevent="updatePassword">
        <!-- Input fields -->
        <div class="flex items-center w-full mb-4">
          <label
            class="block text-sm font-medium text-gray-700 w-1/2"
            for="current_password"
            >Current Password</label
          >
          <input
            type="password"
            id="current_password"
            v-model="form.current_password"
            class="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div class="flex items-center w-full mb-4">
          <label
            class="block text-sm font-medium text-gray-700 w-1/2"
            for="new_password"
            >New Password</label
          >
          <input
            type="password"
            id="new_password"
            v-model="form.new_password"
            class="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div class="flex items-center w-full mb-6">
          <label
            class="block text-sm font-medium text-gray-700 w-1/2"
            for="new_password_confirmation"
            >Confirm New Password</label
          >
          <input
            type="password"
            id="new_password_confirmation"
            v-model="form.new_password_confirmation"
            class="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <!-- Action buttons -->
        <div class="flex justify-between">
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>

  <SuccessModal
    v-if="showSuccessModal"
    :isVisible="showSuccessModal"
    message="Password updated successfully"
    @close="closeSuccessModal"
  />
</template>

<script>
import api from "@/axios";
import SuccessModal from "@/components/modals/Password/SuccessModal.vue";

export default {
  name: "UpdatePassword",
  components: { SuccessModal },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close", "passwordUpdated"],
  data() {
    return {
      form: {
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      },
      showSuccessModal: false,
    };
  },
  methods: {
    async updatePassword() {
      try {
        console.log(this.form);
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await api.put(
          "/api/dashboard/common/v1/auth/password",
          this.form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.response_code === "2000000") {
          this.$emit("passwordUpdated");
          this.showSuccessModal = true;
          this.closeModal();
        } else {
          console.error(
            "Failed to update password:",
            response.data.response_message
          );
        }
      } catch (error) {
        console.error("Error updating password:", error);
      }
    },
    closeModal() {
      this.$emit("close");
      this.form.current_password = "";
      this.form.new_password = "";
      this.form.new_password_confirmation = "";
    },
    closeSuccessModal() {
      this.showSuccessModal = false;
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
