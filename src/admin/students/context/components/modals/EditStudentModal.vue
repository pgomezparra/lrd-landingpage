<template>
  <VueFinalModal
    modal-id="editStudentModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
  >
    <h1>Holaaaaaaaa</h1>
    <button class="button-edit" @click="closeModal">
      Confirm
    </button>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'

const vfm = useVfm()

const closeModal = () => {
  vfm.close('editStudentModal')
}

</script>
