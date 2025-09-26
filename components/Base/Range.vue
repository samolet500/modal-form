<script setup lang="ts">
interface Props {
  title: string;
  type: "number" | "date";
  modelValue?: { from: string | number; to: string | number };
  errorMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ from: "", to: "" }),
  errorMessage: "",
});

const emit = defineEmits(["update:modelValue"]);

const onInput = (field: "from" | "to", e: Event) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: (e.target as HTMLInputElement).value,
  });
};
</script>

<template>
  <div class="base-range" :class="{ invalid: errorMessage }">
    <div class="base-range__title">{{ title }}</div>

    <div class="base-range__inputs">
      <!-- from -->
      <div class="base-range__field base-range-field">
        <label class="base-range-field__label">{{
          type === "number" ? "от" : "с"
        }}</label>

        <input
          class="base-range-field__input"
          :type="type"
          :value="modelValue.from"
          @input="onInput('from', $event)"
        />
      </div>

      <!-- to -->
      <div class="base-range__field base-range-field">
        <label class="base-range-field__label">{{
          type === "number" ? "до" : "по"
        }}</label>

        <input
          class="base-range-field__input"
          :type="type"
          :value="modelValue.to"
          @input="onInput('to', $event)"
        />
      </div>
    </div>

    <!-- error -->
    <span v-if="errorMessage" class="base-range__error">{{
      errorMessage
    }}</span>
  </div>
</template>

<style lang="scss" scoped>
.base-range {
  position: relative;

  &__title {
    color: $color-primary;
    font-size: 14px;
    font-weight: 300;
    line-height: 100%;
  }

  &__inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 20px;
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

.base-range-field {
  position: relative;
  display: inline-block;
  width: 100%;

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

  &__input {
    width: 100%;
    padding: 20px 20px 20px 40px;
    color: $color-primary;
    font-weight: 500;
    font-size: 18px;
    line-height: 100%;
    outline: none;
    border: 2px solid $color-grey;
    border-radius: 6px;
    background: transparent;
    box-sizing: border-box;
    text-align: right;
    transition: $transition;

    .invalid & {
      border-color: $color-error;
    }

    // type number
    &[type="number"] {
      -webkit-appearance: none;
      -moz-appearance: textfield;
    }
    &[type="number"]::-webkit-inner-spin-button,
    &[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    // type date
    &[type="date"]::-webkit-calendar-picker-indicator {
      display: none;
    }
    &[type="date"] {
      -webkit-appearance: none;
      -moz-appearance: textfield;
      appearance: none;
    }
  }
}
</style>
