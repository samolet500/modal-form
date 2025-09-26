<script setup lang="ts">
const props = withDefaults(
  defineProps<{ type?: "button" | "submit" | "reset" }>(),
  {
    type: "button",
  }
);
</script>

<template>
  <button :type="props.type" class="base-btn">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.base-btn {
  display: inline-block;
  align-self: center;
  padding: 13px 40px;
  color: $color-white;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  text-align: center;
  border: none;
  border-radius: 20px;
  background: $color-primary;
  transition: $transition;
  cursor: pointer;

  &:hover {
    background-color: $color-primary-light;
    color: $color-black;
  }
}
</style>
