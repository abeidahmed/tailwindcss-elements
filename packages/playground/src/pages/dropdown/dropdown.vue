<script setup lang="ts">
import GdButton from '../../components/button.vue';

function notify(message: string) {
  alert(message);
}
</script>

<template>
  <div class="flex-1 flex items-center justify-center">
    <twc-dropdown>
      <twc-floating-panel offset-options="8">
        <GdButton data-target="twc-dropdown.trigger twc-floating-panel.trigger">Open</GdButton>
        <div
          data-target="twc-dropdown.menu twc-floating-panel.panel"
          class="hidden ui-open:block rounded w-56 bg-white shadow-lg ring-1 ring-gray-300 focus:outline-none p-1"
        >
          <button
            type="button"
            data-target="twc-dropdown.menuItems"
            class="text-gray-900 group flex w-full items-center rounded px-2 py-2 text-sm ui-active:bg-gray-100 disabled:text-gray-400"
            @click="notify('You clicked on Edit')"
          >
            Edit
          </button>
          <button
            type="button"
            data-target="twc-dropdown.menuItems"
            class="text-gray-900 group flex w-full items-center rounded px-2 py-2 text-sm ui-active:bg-gray-100 disabled:text-gray-400"
          >
            Duplicate
          </button>
          <button
            type="button"
            data-target="twc-dropdown.menuItems"
            class="text-gray-900 group flex w-full items-center rounded px-2 py-2 text-sm ui-active:bg-gray-100 disabled:text-gray-400"
            disabled
          >
            Archive
          </button>
          <button
            type="button"
            data-target="twc-dropdown.menuItems"
            class="text-gray-900 group flex w-full items-center rounded px-2 py-2 text-sm ui-active:bg-gray-100 disabled:text-gray-400"
          >
            Move
          </button>
        </div>
      </twc-floating-panel>
    </twc-dropdown>
  </div>
</template>
