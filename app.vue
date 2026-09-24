<script setup lang="ts">
useHead({
    script: [
        {
            key: 'theme-init',
            tagPriority: 'critical',
            innerHTML: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
        },
    ],
});
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
