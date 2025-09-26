<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";

// Реактивная переменная для управления видимостью модального окна
const showModal = ref(false);
const modalStep = ref<"form" | "success">("form");

// Функции для открытия и закрытия модального окна
const openModal = () => {
  modalStep.value = "form";
  showModal.value = true; // Или можно использовать: open()
};

const closeModal = () => {
  showModal.value = false; // Или можно использовать: close()
};

const handleFormSuccess = () => {
  modalStep.value = "success";
};
</script>

<template>
  <div class="main-page">
    <BaseButton class="message-window__close-btn" @click="openModal">
      Открыть модальное окно
    </BaseButton>

    <!-- Компонент модального окна c формой -->
    <VueFinalModal
      v-model="showModal"
      name="example-modal"
      class="modal-container"
      content-class="modal-content"
      :overlay-transition="'vfm-fade'"
      :content-transition="'vfm-slide-down'"
      :click-to-close="true"
      :esc-to-close="true"
    >
      <Transition name="fade" mode="out-in">
        <!-- форма -->
        <ResidentRegistrationForm
          v-if="modalStep === 'form'"
          key="form"
          @success="handleFormSuccess"
        />

        <!-- сообщение об успехе -->
        <MessageWindow
          v-else-if="modalStep === 'success'"
          key="success"
          message="Форма успешно отправлена!"
          @close="closeModal"
        />
      </Transition>
    </VueFinalModal>
  </div>
</template>

<style lang="scss" scoped>
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}
/* анимация fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
