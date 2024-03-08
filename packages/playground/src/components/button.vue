<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GdButton',
});
</script>

<template>
  <button
    type="button"
    class="inline-flex justify-center rounded bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm select-none ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
  >
    <slot />
  </button>
</template>
