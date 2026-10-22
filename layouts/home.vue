<template>
  <div class="home-screen relative flex min-h-screen flex-col">
    <SiteHeader />
    <div class="relative z-10 flex min-h-0 flex-1 flex-col">
      <div class="relative z-10 flex min-h-0 flex-1 flex-col">
        <slot />
      </div>
      <SiteFooter class="relative z-10" />
    </div>
  </div>
</template>
