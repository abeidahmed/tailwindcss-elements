<script setup lang="ts">
import GdButton from '../../components/button.vue';
</script>

<template>
  <div class="flex-1 flex items-center justify-center">
    <twc-tooltip>
      <twc-floating-panel placement="top" offset-options="8">
        <GdButton data-target="twc-tooltip.trigger twc-floating-panel.trigger">Hover me</GdButton>
        <div
          data-target="twc-tooltip.panel twc-floating-panel.panel"
          class="m-0 group overflow-visible bg-gray-900 rounded text-white py-1 px-2"
        >
          <div
            class="absolute h-0 w-0 border-x-[10px] border-x-transparent border-t-[10px] border-t-gray-900 group-data-[current-placement^='top']:-bottom-2 group-data-[current-placement^='bottom']:-top-2 group-data-[current-placement^='right']:-left-2 group-data-[current-placement^='left']:-right-2"
            data-target="twc-floating-panel.arrow"
          ></div>
          Hello, Tooltip!
        </div>
      </twc-floating-panel>
    </twc-tooltip>
  </div>
</template>
