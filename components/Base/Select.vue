<script setup lang="ts">
import { ref, watchEffect } from "vue";

interface Option {
  label: string;
  value: string;
}

const props = defineProps<{
  label: string;
  modelValue: string | string[] | undefined;
  options: Option[];
  multiple?: boolean;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const isFocused = ref(false);

// 🔹 Локальное значение
const internalValue = ref<string | string[]>(
  props.modelValue ?? (props.multiple ? [] : "") // если multiple → [], иначе ''
);

const hasValue = computed(
  () => props.modelValue && props.modelValue.length > 0
);

// 🔹 Слежение за изменением props
watchEffect(() => {
  if (props.modelValue === undefined) {
    internalValue.value = props.multiple ? [] : "";
  } else {
    internalValue.value = props.modelValue;
  }
});

// 🔹 Отправляем наверх
const updateValue = (val: string | string[]) => {
  internalValue.value = val;
  emit("update:modelValue", val);
};
</script>

<template>
  <div
    class="base-select"
    :class="{ focused: isFocused, invalid: !!props.errorMessage }"
  >
    <label
      class="base-select__label"
      :class="{ floated: isFocused || hasValue }"
    >
      {{ label }}
    </label>

    <select
      class="base-select__select"
      :multiple="multiple"
      :value="internalValue"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @change="
        updateValue(
          multiple
            ? Array.from(
                ($event.target as HTMLSelectElement).selectedOptions
              ).map((o) => o.value)
            : ($event.target as HTMLSelectElement).value
        )
      "
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <span v-if="errorMessage" class="base-select__error">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.base-select {
  position: relative;
  display: inline-block;
  width: 100%;

  &::after {
    content: "";
    position: absolute;
    right: 24px;
    top: 50%;
    width: 18px;
    height: 18px;
    pointer-events: none;
    transform: translateY(-50%);
    background: url("data:image/svg+xml,%3Csvg fill='none' stroke='%23174B7C' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")
      no-repeat center/contain;
  }

  &__select {
    width: 100%;
    padding: 30px 20px 10px 18px;
    color: $color-primary;
    font-weight: 500;
    font-size: 18px;
    line-height: 100%;
    outline: none;
    border: 2px solid $color-grey;
    border-radius: 6px;
    background: transparent;
    box-sizing: border-box;
    transition: $transition;

    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  &.invalid &__select {
    border-color: $color-error;
  }

  &__label {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: $color-primary;
    pointer-events: none;
    font-size: 14px;
    font-weight: 300;
    line-height: 100%;
    transition: $transition;
  }

  &.focused &__label,
  &__label.floated {
    transform: translateY(calc(-50% - 15px));
  }

  &__error {
    position: absolute;
    left: 0;
    bottom: -15px;
    font-size: 12px;
    font-weight: 300;
    line-height: 100%;
    color: $color-error;
  }
}
</style>
