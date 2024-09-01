<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 flex justify-between px-10 py-5 items-center bg-white shadow-lg"
  >
    <h1 class="text-xl text-gray-800 font-bold">YOUNGshop</h1>
    <div class="flex items-center">
      <div class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 pt-0.5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          class="ml-2 outline-none bg-transparent placeholder-gray-500 text-sm"
          type="text"
          name="search"
          id="search"
          placeholder="Search..."
        />
      </div>
      <ul class="flex items-center space-x-6">
        <router-link to="/dashboard">
          <li class="font-semibold text-gray-700">Home</li>
        </router-link>
        <router-link to="/coupon">
          <li class="font-semibold text-gray-700">Coupon</li>
        </router-link>
        <router-link to="/coupon">
          <li class="font-semibold text-gray-700">Order</li>
        </router-link>
        <li>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </li>
        <div class="relative">
          <button @click="toggleDropdown" class="flex items-center">
            <img
              :src="profile.profile_image"
              alt="Profile Image"
              class="h-8 w-8 rounded-full border border-gray-300"
            />
            <p class="ml-2 text-lg font-medium">{{ profile.name }}</p>
          </button>
          <div
            v-if="isDropdownVisible"
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg"
          >
            <router-link
              to="/profile"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              @click="closeDropdown"
            >
              Profile
            </router-link>
            <button
              @click="logout"
              class="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </ul>
    </div>
  </nav>
</template>

<script>
import api from "@/axios";
export default {
  name: "Navbar",
  data() {
    return {
      profile: {
        profile_image: "",
        name: "",
      },
      isDropdownVisible: false,
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
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    closeDropdown() {
      this.isDropdownVisible = false;
    },
    async logout() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        await fetch("/api/dashboard/common/v1/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("access_token");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
