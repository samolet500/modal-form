<script setup lang="ts">
import { ModalsContainer } from "vue-final-modal";
</script>

<template>
  <main class="main">
    <slot />
    <ModalsContainer />
  </main>
</template>
