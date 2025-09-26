<script lang="ts" setup>
const props = defineProps<{ message: string }>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function handleClose() {
  emit("close");
}
</script>
<template>
  <div class="message-window">
    <p class="message-window__text">{{ props.message }}</p>

    <BaseButton class="message-window__close-btn" @click="handleClose"
      >Закрыть</BaseButton
    >
  </div>
</template>

<style lang="scss" scoped>
.message-window {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background: $color-white;

  &__text {
    font-weight: 600;
    font-size: 24px;
    line-height: 110%;
    text-align: center;
  }
}
</style>
