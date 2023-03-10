<template>

  <q-page padding>
    <div class="col-12">
      <p class="text-h5 text-weight-bold">
        Em andamento
      </p>
    </div>

    <div class="row">
      <q-table
        class="col-12"
        :rows="acompanhamentos"
        :columns="columnsAcompanhamentos"
        row-key="id"
        :loading="loading"
        sortBy="nome"
        v-model:pagination="initialPagination"
        rows-per-page-label="Acompanhamentos por página"
        no-data-label="Nenhum acompanhamento cadastrado"
      >
        <template v-slot:body-cell-visitante="props">
          <q-td :props="props" >
            <span>{{ props.row.visitante.nome }}  </span>
          </q-td>
        </template>

        <template v-slot:body-cell-data_inicio="props">
          <q-td :props="props" >
            <span
              v-if="props.row.data_inicio"
            >
              {{ props.row.data_inicio }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-data_fim="props">
          <q-td :props="props" >
            <span
              v-if="props.row.data_inicio"
              :class="foraDoPrazo(props.row.data_inicio) ? 'text-white text-weight-bold bg-red  q-pa-xs' : 'text-black'"
            >
              {{ somaData(props.row.data_inicio, 15) }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-integrador="props">
          <q-td :props="props">
            <div v-if="props.row.integrador">
              <q-btn
                class="q-mr-sm"
                icon="mdi-whatsapp"
                color="green-7"
                size="sm"
                rounded
                dense
                @click="handleSendWhats(props.row.integrador.celular, props.row.integrador.nome)"
              />
              <span>{{ props.row.integrador.nome }}  </span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-parecer="props">
          <q-td :props="props" >
            <q-btn
              v-if="props.row.parecer_integrador"
              class="q-mr-sm"
              icon="mdi-file-search"
              label="Ver"
              size="sm"
              dense
              @click="handleParecer(props.row.parecer_integrador)"
            >
              <q-tooltip>Ver Parecer</q-tooltip>
            </q-btn>
            <span v-else>
              Sem parecer
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              label="Finalizar"
              icon="mdi-check-bold"
              dense
              size="sm"
              @click="handleFinalizar(props.row)"
            >
              <q-tooltip>Finalizar</q-tooltip>
            </q-btn>
          </q-td>
        </template>

      </q-table>

    </div>
    <div class="row justify-center q-mt-sm">
      <q-pagination
        v-model="initialPagination.page"
        :max="pagesNumber"
        direction-links
        @update:model-value="handleScrollToTop"
      />
    </div>

    <DialogFinalizarAcompanhamento
      :visible="openFinalizarDialog"
      :acompanhamento="acompanhamento"
      @closeDialog="openFinalizarDialog = false"
      @finalizarClick="onFinalizarClick"
    />

  </q-page>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import useNotify from 'src/composables/UseNotify';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { openURL } from 'quasar';
import { columnsAcompanhamentos, initialPagination } from './table'
import acompanhamentoService from 'src/services/acompanhamentoService';
import { somaData, foraDoPrazo } from 'src/utils/format'
import DialogFinalizarAcompanhamento from 'src/components/DialogFinalizarAcompanhamento.vue'

const { listAcompanhamentoComVisitante, listAcompanhamentoAbertos, update:updateAcompanhamento } = acompanhamentoService()
const { notifyError, notifySuccess } = useNotify()

const router = useRouter()
const $q = useQuasar()

const acompanhamento = ref('')
const acompanhamentos = ref([])
const loading = ref(true)
// Dialog
const openFinalizarDialog = ref(false)

// --------------------------------------------------------------------------

const handleSendWhats = (celular, nome) => {
  const msg = `Olá ${nome}, tudo bem?`
  const link = encodeURI(`https://api.whatsapp.com/send?phone=55${celular}&text=${msg}`)
  openURL(link)
}

const carregaAcompanhamentos = async () => {
  try {
    loading.value = true
    acompanhamentos.value = await listAcompanhamentoAbertos()

    //acompanhamentos.value = await listAcompanhamentoComVisitante()
    loading.value = false

  } catch (error) {
    notifyError("Erro ao carregar a lista de acompanhamentos")
    console.log(error.message)
  }
}

const handleParecer = (parecer) => {
  $q.dialog({
    title: 'PARECER',
    message: parecer,
  })
}

const handleFinalizar = (acompanhamentoSelecionado) => {

  acompanhamento.value = acompanhamentoSelecionado
  openFinalizarDialog.value = true

}

const onFinalizarClick = async (acompanhamento) => {
  console.log(acompanhamento)
  acompanhamento.integrador_email = acompanhamento.integrador.email
  acompanhamento.visitante_id = acompanhamento.visitante.id
  delete acompanhamento.integrador
  delete acompanhamento.visitante

  try {
    await updateAcompanhamento(acompanhamento, 'visitante_id')
    carregaAcompanhamentos()
    notifySuccess("Acompanhamento finalizado com sucesso")
  } catch (error) {
    console.log(error.message)
  }
}

/************************************************************************
TABELA
*************************************************************************/
const pagesNumber = computed(() =>
  Math.ceil(acompanhamentos.value.length / initialPagination.value.rowsPerPage)
)

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
/**************************************************************************/

onMounted(() => {
  carregaAcompanhamentos()
})




// --------------------------------------------------------------------------


const handleEditVisitante = async (visitante) => {
  visitanteToEdit.value = {...visitante}
  openEditDialog.value = true
}

const handleApagarVisitante = async (visitante) => {
  try {
    $q.dialog({
      title: 'ATENÇÃO',
      message: `Você realmente deseja apagar o visitante ${visitante.nome}?`,
      cancel: true,
      persistent: true,
      ok: {
        label: 'APAGAR',
        color: 'negative'
      },
      cancel: {
        label: 'Cancelar',
        flat: true,
      }
    }).onOk(async () => {
      await removeVisitante(visitante.id)
      notifySuccess("Removido com sucesso!")
      carregaListVisitantes()
    })
  } catch (error) {
    notifyError(error.message)
  }

}



const atualizarVisitante = async (visitante) => {
  try {
    await updateVisitante(visitante, 'id')
    notifySuccess("Visitante atualizado")
    carregaListVisitantes()
  } catch (error) {
    notifyError("Erro ao atualizar o visitante")
    console.log(error.message)
  }
}


const handleAtribuirIntegrador = async (visitante) => {
  visitanteToEdit.value = {...visitante}
  openIntegradorDialog.value = true
}

const iniciarAcompanhamento = async (acompanhamento) => {
  try {
    visitanteToEdit.value.status = "em acompanhamento"

    const {celebracao, ...resto} = visitanteToEdit.value

    const visitante = {
      ...resto,
      celebracao_id:celebracao.id
    }



    await updateVisitante(visitante, 'id')
    await salvarAcompanhamento(acompanhamento)


    notifySuccess("Integrador atribuido")
    carregaListVisitantes()



  } catch (error) {
    notifyError("Erro ao atribuir o integrador")
    console.log(error.message)

  }
}





</script>
