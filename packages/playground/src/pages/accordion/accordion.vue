<template>
  <div class="mx-auto w-full max-w-lg divide-y rounded-xl bg-gray-100">
    <twc-accordion class="block p-6">
      <button type="button" data-target="twc-accordion.trigger">What is your refund policy?</button>
      <div class="mt-2 text-sm hidden data-[headlessui-state=open]:block" data-target="twc-accordion.panel">
        If you're unhappy with your purchase, we'll refund you in full.
      </div>
    </twc-accordion>
    <twc-accordion class="block p-6">
      <button type="button" data-target="twc-accordion.trigger">Do you offer technical support?</button>
      <div class="mt-2 text-sm hidden data-[headlessui-state=open]:block" data-target="twc-accordion.panel">No.</div>
    </twc-accordion>
  </div>
</template>
