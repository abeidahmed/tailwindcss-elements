<template>
  <div class="flex h-screen flex-col overflow-hidden bg-gray-700 font-sans text-gray-900 antialiased">
    <header
      class="relative z-10 flex flex-shrink-0 items-center border-b border-gray-200 bg-gray-700 px-4 py-4 sm:px-6 lg:px-8"
    >
      <router-link to="/">
        <h1 class="text-white text-lg">tailwindcss-elements</h1>
      </router-link>
    </header>
    <main class="flex-1 flex flex-col overflow-auto bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <slot></slot>
    </main>
  </div>
</template>
