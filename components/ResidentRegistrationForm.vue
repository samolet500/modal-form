<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

const emit = defineEmits<{ (e: "success"): void }>();

const isSending = ref<boolean>(false);

// Схема валидации
const schema = yup.object({
  orgName: yup.string().required("Введите наименование организации"),
  phone: yup
    .string()
    .required("Введите телефон")
    .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, "Введите корректный номер"),
  roomType: yup.string().required("Выберите тип помещения"),
  address: yup.string().required("Введите адрес"),
  square: yup
    .object({
      from: yup
        .number()
        .typeError("Укажите площадь (от)")
        .required("Укажите площадь (от)"),
      to: yup
        .number()
        .typeError("Укажите площадь (до)")
        .required("Укажите площадь (до)"),
    })
    .test("square-range", null, function (value) {
      if (!value) return true;
      const { from, to } = value;

      if (from != null && to != null && Number(from) >= Number(to)) {
        return this.createError({
          path: `${this.path}.to`,
          message: "Площадь 'до' должна быть больше 'от'",
        });
      }

      if (from != null && to != null && Number(from) <= 0) {
        return this.createError({
          path: `${this.path}.from`,
          message: "Площадь 'от' должна быть положительной",
        });
      }

      return true;
    }),

  date: yup
    .object({
      from: yup
        .date()
        .typeError("Укажите дату начала")
        .required("Укажите дату начала"),
      to: yup
        .date()
        .typeError("Укажите дату окончания")
        .required("Укажите дату окончания"),
    })
    .test("date-range", null, function (value) {
      if (!value) return true;
      const { from, to } = value;

      if (from && to && new Date(from) >= new Date(to)) {
        return this.createError({
          path: `${this.path}.to`,
          message: "Дата окончания должна быть позже даты начала",
        });
      }

      return true;
    }),
});

// vee-validate
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: orgName } = useField<string>("orgName");
const { value: phone } = useField<string>("phone");
const { value: roomType } = useField<string>("roomType");
const { value: address } = useField<string>("address");
const { value: square } = useField<{ from: number; to: number }>("square");
const { value: date } = useField<{ from: string; to: string }>("date");

//Submit Form
const onSubmit = handleSubmit(async (values) => {
  try {
    isSending.value = true;

    await new Promise((resolve) => setTimeout(resolve, 2000)); // имитация

    const response = await fetch("/api/form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error("Ошибка при отправке формы");
    }

    // если сервер вернул положительный ответ
    const data = await response.json();
    console.log("Ответ сервера:", data);
    emit("success");
  } catch (err) {
    console.error("Ошибка:", err);
  } finally {
    isSending.value = false;
  }
});
</script>

<template>
  <div class="resident-registration-form" :class="{ is_sending: isSending }">
    <BaseSpinner v-if="isSending" class="resident-registration-form__spinner" />

    <h2 class="resident-registration-form__title">
      Заполните заявку, чтобы стать резидентом
    </h2>

    <form
      class="resident-registration-form__form form"
      @submit.prevent="onSubmit"
    >
      <!-- Наименование -->
      <div class="form__group">
        <BaseInput
          v-model="orgName"
          name="orgName"
          label="Наименование организации / ИП"
          :error-message="errors.orgName"
        />
      </div>

      <!-- Телефон -->
      <div class="form__group">
        <BaseInput
          v-model="phone"
          name="phone"
          label="Контактный телефон"
          type="tel"
          mask="'+7 (###) ###-##-##'"
          :error-message="errors.phone"
        />
      </div>

      <!-- Тип помещения -->
      <div class="form__group">
        <BaseSelect
          v-model="roomType"
          label="Тип помещения"
          :error-message="errors.roomType"
          :options="[
            { label: 'Производственная площадь', value: 'production_area' },
            { label: 'Офис', value: 'office' },
            { label: 'Склад', value: 'storage' },
            { label: 'Магазин', value: 'shop' },
          ]"
        />
      </div>

      <!-- Адрес -->
      <div class="form__group">
        <BaseAddressInput v-model="address" :error-message="errors.address" />
      </div>

      <!-- Площадь -->
      <div class="form__group">
        <BaseRange
          v-model="square"
          title="Площадь помещения (м²)"
          type="number"
          :error-message="errors.square"
        />
      </div>

      <!-- Даты -->
      <div class="form-group" :class="{ 'has-error': errors.date }">
        <BaseRange
          v-model="date"
          title="Дата аренды"
          type="date"
          :error-message="errors.date"
        />
      </div>

      <BaseButton type="submit" class="form__submit">Отправить</BaseButton>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.resident-registration-form {
  position: relative;
  width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: $color-white;

  &.is_sending {
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
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 50%;
    z-index: 11;
  }

  &__title {
    font-weight: 600;
    font-size: 24px;
    line-height: 110%;
  }

  &__form {
    margin-top: 40px;
  }
}
</style>
