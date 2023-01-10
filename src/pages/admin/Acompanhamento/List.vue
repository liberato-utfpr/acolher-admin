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
        rows-per-page-label="Visitantes por página"
        no-data-label="Nenhum visitante cadastrado"
      >
        <template v-slot:body-cell-visitante="props">
          <q-td :props="props" >
            <span>{{ props.row.visitante.nome }}  </span>
          </q-td>
        </template>

        <template v-slot:body-cell-data_fim="props">
          <q-td :props="props" >
            <span>{{ somaData(props.row.data_inicio, 15) }}  </span>
          </q-td>
        </template>

        <template v-slot:body-cell-integrador="props">
          <q-td :props="props" >
            <q-btn
              class="q-mr-sm"
              icon="mdi-whatsapp"
              color="green-7"
              size="md"
              rounded
              dense
              @click="handleSendWhats(props.row.integrador.celular, props.row.integrador.nome)"
            />
            <span>{{ props.row.integrador.nome }}  </span>

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

    <!-- DIALOG -->
    <DialogVisitante
      :visible="openEditDialog"
      :visitante="visitanteToEdit"
      @closeDialog="openEditDialog = false"
      @atualizarClick="atualizarVisitante"
    />
    <DialogIntegrador
      :visible="openIntegradorDialog"
      :visitante="visitanteToEdit"
      @closeDialog="openIntegradorDialog = false"
      @atribuirClick="iniciarAcompanhamento"
    />
  </q-page>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import useNotify from 'src/composables/UseNotify';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { openURL } from 'quasar';
import { columnsAcompanhamentos, initialPagination } from './table'

import acompanhamentoService from 'src/services/acompanhamentoService';
import { somaData, getDiaSemana, formatDate } from 'src/utils/format'

import DialogVisitante from 'src/components/DialogVisitante.vue';
import DialogIntegrador from 'src/components/DialogIntegrador.vue';



const acompanhamentos = ref([])
const loading = ref(true)
// Dialog
const openEditDialog = ref(false)
const visitanteToEdit = ref({})
const openIntegradorDialog = ref(false)



const { list:listAcompanhamentos, listAcompanhamentoComVisitante } = acompanhamentoService()
const { notifyError, notifySuccess } = useNotify()

const router = useRouter()
const $q = useQuasar()

// --------------------------------------------------------------------------



const handleSendWhats = (celular, nome) => {

const msg = `Olá ${nome}, tudo bem?`
const link = encodeURI(`https://api.whatsapp.com/send?phone=55${celular}&text=${msg}`)
openURL(link)
}

const carregaAcompanhamentos = async () => {

  try {
    loading.value = true
    acompanhamentos.value = await listAcompanhamentoComVisitante()
    loading.value = false

  } catch (error) {
    notifyError("Erro ao carregar a lista de acompanhamentos")
    console.log(error.message)
  }

}
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

    console.log(visitante)

    await updateVisitante(visitante, 'id')
    await salvarAcompanhamento(acompanhamento)

    // console.log(visitanteToEdit)
    // console.log(acompanhamento)

    notifySuccess("Integrador atribuido")
    carregaListVisitantes()



  } catch (error) {
    notifyError("Erro ao atribuir o integrador")
    console.log(error.message)

  }
}





</script>
