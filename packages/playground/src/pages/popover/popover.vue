<script setup lang="ts">
import GdButton from '../../components/button.vue';
</script>

<template>
  <div class="flex-1 flex items-center justify-center">
    <twc-popover>
      <twc-floating-panel offset-options="8" placement="bottom">
        <GdButton data-target="twc-popover.trigger twc-floating-panel.trigger">Open</GdButton>
        <div
          data-target="twc-popover.panel twc-floating-panel.panel"
          class="group hidden ui-open:block p-4 w-64 bg-white rounded shadow-lg ring-1 ring-gray-300 focus:outline-none"
        >
          <h2>Are you sure?</h2>
          <p class="text-sm mt-2">This is a final warning message. This action cannot be undone.</p>

          <div class="flex items-center justify-end mt-4 gap-x-2">
            <GdButton data-action="click->twc-popover#hide">Cancel</GdButton>
            <GdButton>Ok</GdButton>
          </div>
        </div>
      </twc-floating-panel>
    </twc-popover>
  </div>
</template>
