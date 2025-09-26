<template>
  <div class="spinner" />
</template>

<style scoped lang="scss">
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #ccc;
  border-top: 2px solid #174b7c; // твой брендовый синий
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
