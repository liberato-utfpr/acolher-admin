<template>
<q-dialog v-model="props.visible">
  <q-card style="width: 700px; max-width: 80vw;">

    <q-card-section>
      <div class="text-h6">Visitante</div>
    </q-card-section>

    <q-card-section class="col-12">
      <q-form>

        <q-input
        class="col-12 col-md-3"
        outlined
        label="Nome*"
        v-model="props.visitante.nome"
        :rules="[val => (val && val.length > 0) || 'Nome é obrigatório']"

        />

        <q-input
        outlined
        label="Celular*"
        v-model="props.visitante.celular"
        mask="(##) #####-####"
        hint="Informe o celular com DDD"
        unmasked-value
        :rules="[val => (val && val.length >= 11) || 'O celular precisa ter no mínimo 11 dígitos']"

        />
        <q-input
        class="col-2 col-md-3"
        outlined
        label="Sexo*"
        v-model="props.visitante.sexo"
        :rules="[val => (val && val.length > 0 && ( val==='M' || val==='F')) || 'M ou F']"
        />

        <q-input
          outlined
          label="Idade*"
          v-model="props.visitante.idade"
          mask="##"
          :rules="[val => (val && val.length > 0) || 'A idade é obrigatória']"
        />
      </q-form>
    </q-card-section>

    <q-card-actions>
      <!-- <q-btn flat label="Cancel" color="primary" @click="$emit('closeDialog')" />
      <q-btn label="Atualizar" color="primary" @click="close" /> -->
      <q-btn flat label="CANCELAR" color="primary" @click="cancelar" />
      <q-btn label="ATUALIZAR" color="primary" @click="salvar" />
    </q-card-actions>

  </q-card>
</q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps(['visible', 'visitante', 'mensagem'])
const emit = defineEmits(['closeDialog', 'atualizarClick'])

const nome = ref('')
nome.value = props.visitante.nome


const cancelar = () => {
  emit('closeDialog')
}

const salvar = () => {
  let visitanteEdit = props.visitante
  // visitanteEdit.value["tipo"] = 'aprovado'
  emit('atualizarClick', visitanteEdit)
  emit('closeDialog')
}



</script>
