<script setup lang="ts">
import DialogElement from 'tailwindcss-elements/elements/dialog';
import GdButton from '../../components/button.vue';
import { ref } from 'vue';

const dialog = ref<DialogElement | null>(null);
const dialog2 = ref<DialogElement | null>(null);
const dialog3 = ref<DialogElement | null>(null);

function openDialog(el: DialogElement | null) {
  if (el) {
    el.open = true;
  }
}
</script>

<template>
  <div class="flex-1 flex items-center justify-center gap-x-4">
    <div>
      <GdButton @click="openDialog(dialog)">Open dialog</GdButton>

      <twc-dialog ref="dialog">
        <dialog data-target="twc-dialog.dialog" class="p-4 rounded max-w-md w-full">
          <h2 class="text-lg font-semibold">Deactivate account</h2>
          <p class="mt-2 text-sm">
            Are you sure you want to deactivate your account? All of your data will be permanently removed. This action
            cannot be undone.
          </p>

          <div class="mt-4 flex items-center justify-end gap-x-2">
            <GdButton data-action="click->twc-dialog#hide">Close</GdButton>
            <GdButton>Ok</GdButton>
          </div>
        </dialog>
      </twc-dialog>
    </div>

    <div>
      <GdButton @click="openDialog(dialog2)">Show nested</GdButton>
      <twc-dialog ref="dialog2">
        <dialog data-target="twc-dialog.dialog" class="p-4 rounded max-w-md w-full">
          <h2 class="text-lg font-semibold">Parent dialog</h2>
          <GdButton @click="openDialog(dialog3)">Nested 1</GdButton>

          <twc-dialog ref="dialog3">
            <dialog data-target="twc-dialog.dialog" class="p-4 rounded max-w-sm w-full">
              <h2>Nested 1</h2>
            </dialog>
          </twc-dialog>
        </dialog>
      </twc-dialog>
    </div>
  </div>
</template>
