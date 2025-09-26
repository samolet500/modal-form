<script setup lang="ts">
interface Props {
  modelValue: string;
  name: string;
  label: string;
  type?: "text" | "tel" | "email";
  mask?: string;
  placeholder?: string;
  errorMessage?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const isFocused = ref(false);

const hasValue = computed(
  () => props.modelValue && props.modelValue.length > 0
);

const onInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};
</script>

<template>
  <div
    class="base-input"
    :class="{ focused: isFocused, invalid: errorMessage }"
  >
    <label
      class="base-input__label"
      :class="{ floated: isFocused || hasValue }"
      :for="props.name"
    >
      {{ props.label }}
    </label>

    <input
      v-if="props.type === 'tel'"
      :id="props.name"
      class="base-input__input"
      v-mask="'+7 (###) ###-##-##'"
      :name="props.name"
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder || ''"
      @input="onInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <input
      v-else
      :id="props.name"
      class="base-input__input"
      :name="props.name"
      :type="props.type || 'text'"
      :value="props.modelValue"
      :placeholder="props.placeholder || ''"
      @input="onInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <span v-if="errorMessage" class="base-input__error">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.base-input {
  position: relative;
  display: inline-block;
  width: 100%;

  &__input {
    width: 100%;
    padding: 30px 20px 10px 20px;
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
  }

  &.invalid &__input {
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
