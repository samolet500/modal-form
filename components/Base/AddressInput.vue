<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  modelValue: string;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const dataList = ref<any[]>([]);
const activeIndex = ref(0);
const loading = ref(false);
const isFocused = ref(false);
const dadataError = ref(false);
const manualInput = ref(false);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const fetchAddress = async (query: string) => {
  if (manualInput.value) return;

  if (!query || query.length < 3) {
    dataList.value = [];
    dadataError.value = false;
    return;
  }

  loading.value = true;
  dadataError.value = false;

  try {
    const { suggestions: result } = await $fetch("/api/dadata/address", {
      method: "POST",
      body: { query },
    });

    dataList.value = Array.isArray(result) ? result : [];

    // Если нет результатов — разрешаем ручной ввод
    if (!result.length) {
      dadataError.value = true;
      manualInput.value = true; // переключаем на ручной ввод
    }
  } catch (e) {
    console.error("Ошибка Dadata", e);
    dataList.value = [];
    dadataError.value = true; // ошибка запроса, разрешаем ручной ввод
    manualInput.value = true;
  } finally {
    loading.value = false;
  }
};

const selectAddress = (value: string) => {
  emit("update:modelValue", value);
  dataList.value = [];
  dadataError.value = false;
};

const onKeydown = (e: KeyboardEvent) => {
  if (!dataList.value.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % dataList.value.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex.value =
      (activeIndex.value - 1 + dataList.value.length) % dataList.value.length;
  } else if (e.key === "Enter") {
    e.preventDefault();
    const selected = dataList.value[activeIndex.value];
    if (selected) selectAddress(selected.value);
  }
};

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit("update:modelValue", value);

  if (manualInput.value) return;

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => fetchAddress(value), 300);
};

const hasValue = computed(
  () => !!props.modelValue && props.modelValue.length > 0
);

const isLoadingData = computed(() => loading.value && !dadataError.value);
</script>

<template>
  <div
    class="base-address-input"
    :class="{ invalid: errorMessage, is_loading: isLoadingData }"
  >
    <label
      class="base-address-input__label"
      :class="{ floated: isFocused || hasValue }"
      for="address"
    >
      Адрес
    </label>

    <input
      id="address"
      class="base-address-input__input"
      name="address"
      type="text"
      :value="modelValue"
      :disabled="isLoadingData"
      @input="onInput"
      @keydown="onKeydown"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <BaseSpinner v-if="isLoadingData" class="base-address-input__spinner" />

    <p v-if="dadataError" class="base-address-input__manual">
      Нет данных в Dadata или ошибка загрузки данных? Введите адрес вручную.
    </p>

    <!-- Список подсказок -->
    <ul v-if="dataList.length" class="base-address-input__list">
      <li
        v-for="(s, idx) in dataList"
        :key="s.value"
        :class="{ active: idx === activeIndex }"
        @click="selectAddress(s.value)"
      >
        {{ s.value }}
      </li>
    </ul>

    <!-- Ручной ввод, если DaData пусто или ошибка -->

    <span v-if="errorMessage" class="base-address-input__error">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.base-address-input {
  position: relative;
  display: inline-block;
  width: 100%;

  &.is_loading {
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      background: white;
      opacity: 0.7;
      z-index: 10;
    }
  }

  &__spinner {
    position: absolute;
    left: 20px;
    top: 50%;
    z-index: 11;
  }

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
    transform: translateY(calc(-50% - 25px));
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

  &__list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid $color-grey;
    border-radius: 6px;
    background: $color-white;
    max-height: 170px;
    overflow-y: auto;
    z-index: 100;
  }

  &__list li {
    padding: 8px;
    cursor: pointer;
  }

  &__list li:hover,
  &__list li.active {
    background: $color-primary-light;
  }

  &__manual {
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>
