<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-sm">
      <h2 class="text-xl font-bold mb-4">Success</h2>
      <p class="text-gray-700">{{ message }}</p>
      <div class="flex justify-end mt-6">
        <button
          @click="closeModal"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SuccessModal",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
