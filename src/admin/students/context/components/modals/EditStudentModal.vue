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
    <div>
      <div>
        <p>Editar usuario</p>
      </div>
      <div>
        <div>
          <p>Nombre</p>
          <input
          type="text"
          placeholder="Nombre"
          >
        </div>
        <div>
          <p>Apellido</p>
          <input
            type="text"
            placeholder="Nombre"
          >
        </div>
        <div>
          <p>Tipo de documento</p>
          <input
            type="text"
            placeholder="Nombre"
          >
        </div>
        <div>
          <p>Documento</p>
          <input
            type="text"
            placeholder="Nombre"
          >
        </div>
        <div>
          <p>Fecha de nacimiento</p>
          <input
            type="text"
            placeholder="Nombre"
          >
        </div>
        <div>
          <p>Grado</p>
          <input
            type="text"
            placeholder="Nombre"
          >
        </div>
        <div>
          <p>Valor de matrícula</p>
          <input
            type="text"
            placeholder="Nombre"
          >
        </div>
        <div>
          <p>Valor de pensión</p>
          <input
            type="text"
            placeholder="Nombre"
          >
        </div>

      </div>
      <button class="button-edit" @click="closeModal">
        Confirm
      </button>

    </div>


  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'

const vfm = useVfm()

const closeModal = () => {
  vfm.close('editStudentModal')
}

</script>
