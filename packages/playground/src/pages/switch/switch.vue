<template>
  <div class="flex-1 flex items-center justify-center">
    <twc-switch>
      <button
        type="button"
        class="group relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 bg-indigo-50 aria-checked:bg-indigo-600"
        data-target="twc-switch.trigger"
      >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out translate-x-0 group-aria-checked:translate-x-9"
        ></span>
      </button>
    </twc-switch>
  </div>
</template>
