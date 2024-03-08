<template>
  <div class="flex-1 flex items-center justify-center max-w-md w-full mx-auto">
    <twc-tabs class="block w-full px-2 py-16 sm:px-0">
      <twc-tabs-list class="flex space-x-1 rounded-xl bg-gray-200 p-1">
        <button
          type="button"
          data-target="twc-tabs.triggers"
          aria-controls="panel1"
          class="w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 text-gray-900 hover:bg-gray-300 ui-selected:bg-white ui-selected:text-blue-700 ui-selected:shadow"
        >
          Tab 1
        </button>
        <button
          type="button"
          data-target="twc-tabs.triggers"
          aria-controls="panel2"
          class="w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 text-gray-900 hover:bg-gray-300 ui-selected:bg-white ui-selected:text-blue-700 ui-selected:shadow"
        >
          Tab 2
        </button>
      </twc-tabs-list>
      <div class="mt-2">
        <div
          id="panel1"
          data-target="twc-tabs.panels"
          class="hidden shadow ui-selected:block rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
        >
          <ul>
            <li class="relative rounded-md p-3 hover:bg-gray-100">
              <h3 class="text-sm font-medium leading-5">Does drinking coffee make you smarter?</h3>
            </li>
            <li class="relative rounded-md p-3 hover:bg-gray-100">
              <h3 class="text-sm font-medium leading-5">So you've bought coffee... now what?</h3>
            </li>
          </ul>
        </div>
        <div
          id="panel2"
          data-target="twc-tabs.panels"
          class="hidden shadow ui-selected:block rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
        >
          <ul>
            <li class="relative rounded-md p-3 hover:bg-gray-100">
              <h3 class="text-sm font-medium leading-5">Is tech making coffee better or worse?</h3>
            </li>
            <li class="relative rounded-md p-3 hover:bg-gray-100">
              <h3 class="text-sm font-medium leading-5">The most innovative things happening in coffee</h3>
            </li>
          </ul>
        </div>
      </div>
    </twc-tabs>
  </div>
</template>
