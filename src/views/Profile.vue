<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <Navbar />
    <div class="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div class="w-full max-w-md text-center pt-10">
        <img
          :src="profile.profile_image"
          alt="Profile Image"
          class="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h1 class="text-2xl font-bold mb-2">{{ profile.name }}</h1>
        <p class="text-gray-700 mb-1">
          <strong>Phone:</strong> {{ profile.phone }}
        </p>
        <p class="text-gray-700 mb-4">
          <strong>Role:</strong> {{ profile.role_name }}
        </p>

        <div class="flex w-full gap-2">
          <div class="w-1/2">
            <button
              class="block w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @click="openUpdateProfileModal"
            >
              Ubah Profile
            </button>
            <UpdateProfile
              :isVisible="showModalProfile"
              :profileData="profile"
              @close="closeModalPro"
              @updateSuccess="handleUpdateProfileSuccess"
            />
          </div>
          <div class="w-1/2">
            <button
              class="block w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @click="openUpdatePasswordModal"
            >
              Ubah Password
            </button>
            <UpdatePassword
              :isVisible="showModalPassword"
              :profileData="profile"
              @close="closeModalPass"
              @updateSuccess="handleUpdatePasswordSuccess"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UpdateProfile from "@/components/modals/Profile/UpdateProfile.vue";
import UpdatePassword from "@/components/modals/Password/UpdatePassword.vue";
import Navbar from "@/components/Navbar.vue";
import api from "@/axios";

export default {
  name: "Profile",
  components: {
    UpdateProfile,
    UpdatePassword,
    Navbar,
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
      showModalProfile: false,
      showModalPassword: false,
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
          console.log("Profile data fetched:", response.data);
          this.profile = response.data;
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
    openUpdateProfileModal() {
      this.showModalProfile = true;
    },
    closeModalPro() {
      this.showModalProfile = false;
    },
    handleUpdateProfileSuccess(updatedData) {
      console.log("Updated profile data:", updatedData);
      this.profile = updatedData;
      this.closeModalPro();
    },
    openUpdatePasswordModal() {
      this.showModalPassword = true;
    },
    closeModalPass() {
      this.showModalPassword = false;
    },
    handleUpdatePasswordSuccess() {
      this.fetchUserProfile();
      this.closeModalPass();
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
