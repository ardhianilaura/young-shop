<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Update Profile</h1>
      <form @submit.prevent="updateProfile">
        <!-- Display profile image -->
        <div class="mb-4 text-center">
          <img
            :src="profile.profile_image"
            alt="Profile Image"
            class="w-32 h-32 object-cover rounded-full mx-auto mb-4"
          />
          <input type="file" @change="handleFileChange" class="mb-4" />
        </div>
        <!-- Form fields -->
        <div class="space-y-4">
          <div class="flex items-center">
            <label for="name" class="w-1/3 text-gray-700 mb-2">Name</label>
            <input
              v-model="profile.name"
              type="text"
              id="name"
              class="w-2/3 px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div class="flex items-center">
            <label for="phone" class="w-1/3 text-gray-700 mb-2">Phone</label>
            <input
              v-model="profile.phone"
              type="text"
              id="phone"
              class="w-2/3 px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div class="flex items-center">
            <label for="role_name" class="w-1/3 text-gray-700 mb-2">Role</label>
            <input
              v-model="profile.role_name"
              type="text"
              id="role_name"
              class="w-2/3 px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <!-- Action buttons -->
        <div class="flex justify-between mt-6">
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
</template>

<script>
import api from "@/axios";

export default {
  name: "UpdateProfile",
  props: {
    isVisible: Boolean,
    profileData: Object,
  },
  emits: ["updateSuccess", "close"],
  data() {
    return {
      profile: { ...this.profileData },
      file: null,
    };
  },
  watch: {
    profileData: {
      handler(newData) {
        console.log("profileData updated:", newData);
        this.profile = { ...newData };
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async updateProfile() {
      try {
        console.log("Updating profile with data:", this.profile);

        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const updatedData = new FormData();
        updatedData.append("name", this.profile.name);
        updatedData.append("phone", this.profile.phone);
        updatedData.append("role_name", this.profile.role_name);
        if (this.file) {
          updatedData.append("profile_image", this.file);
        }

        const response = await api.post(
          "/api/dashboard/common/v1/auth/profile",
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.response_code === "2000000") {
          this.$emit("updateSuccess", this.profile);
        } else {
          console.error(
            "Failed to update profile:",
            response.data.response_message
          );
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
