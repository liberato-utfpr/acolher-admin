<template>
<q-dialog v-model="props.visible">
  <q-card style="width: 500px; max-width: 80vw;">

    <q-card-section>
      <div class="text-h6">Integrador</div>
    </q-card-section>

    <q-card-section>
      <q-select
        outlined
        v-model="integrador"
        :options="listaIntegradores"
        label="Integrador"
        use-input
        option-value="email"
        option-label="nome"
        @filter="filterIntegrador"
        :rules="[val => (val && val!== '') || 'O tipo é obrigatório']"
        lazy-rules
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Sem resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>

    <q-card-actions>
      <q-btn flat label="CANCELAR" color="primary" @click="cancelar" />
      <q-btn label="ATRIBUIR" color="primary" @click="salvar" />
    </q-card-actions>

  </q-card>
</q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import integradorService from 'src/services/integradorService';

const props = defineProps(['visible', 'visitante', 'mensagem'])
const emit = defineEmits(['closeDialog', 'atualizarClick'])

const { listIntegradoresAprovados } = integradorService()

const integrador = ref('')
const listaIntegradores = ref([]) // lista de integradores para o q-select
let integradores = [] // variável temporária para armazenar os integradores


const cancelar = () => {
  integrador.value = ''
  emit('closeDialog')
}

const salvar = () => {

  const acompanhamento = criarAcompanhamento(props.visitante, integrador.value)
  integrador.value = ''
  emit('atribuirClick', acompanhamento)
  emit('closeDialog')
}


const criarAcompanhamento = (visitante, integrador) => {

  const acompanhamento = {
    visitante_id: visitante.id,
    data_inicio: new Date(),
    integrador_email: integrador.email,
    integrador_nome: integrador.nome,
  }

  return acompanhamento

}


// Filtra a lista de tipo de celebração do q-select
const filterIntegrador = (val, update) => {
  if (val === '') {
    update(() => {
      listaIntegradores.value = integradores
    })

    return
  }
  update(() => {
    listaIntegradores.value = listaIntegradores.value.filter(i => i.nome.toLowerCase().includes(val.toLowerCase()))
    // const needle = val.toLowerCase()
    // listaIntegradores.value = listaIntegradores.value.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
}

const carregaListaIntegradores = async () => {
  listaIntegradores.value = await listIntegradoresAprovados()
  integradores = [...listaIntegradores.value]
}

onMounted(() => {
  carregaListaIntegradores()
})


</script>
