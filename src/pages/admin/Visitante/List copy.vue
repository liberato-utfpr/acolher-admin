<template>

  <q-page padding>
    <div class="col-12">
      <p class="text-h5 text-weight-bold">
        Visitantes
      </p>
    </div>

    <div class="row">
      <q-table
        class="col-12"
        :rows="visitantes"
        :columns="columnsVisitantes"
        row-key="id"
        :loading="loading"
        sortBy="nome"
        v-model:pagination="initialPagination"
        rows-per-page-label="Visitantes por página"
        no-data-label="Nenhum visitante cadastrado"
      >

        <template v-slot:body-cell-integrador="props">
          <q-td :props="props" >
            <q-btn
              icon="mdi-account-circle"
              color="primary"
              dense
              size="sm"
              @click="handleAtribuirIntegrador(props.row)"
            >
              <q-tooltip>Atribuir integrador</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td :props="props" class="q-gutter-x-sm">

            <q-btn
              icon="mdi-pencil-outline"
              color="secondary"
              dense
              size="sm"
              @click="handleEditVisitante(props.row)"
            >
              <q-tooltip>Editar Celebração</q-tooltip>
            </q-btn>

            <q-btn
              icon  = 'mdi-close'
              color = 'negative'
              size="sm"
              dense
              @click="handleApagarVisitante(props.row)"
            >
              <q-tooltip>Excluir Visitante</q-tooltip>
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
      @atualizarClick="atribuirIntegrador"
    />
  </q-page>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import useNotify from 'src/composables/UseNotify';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { columnsVisitantes, initialPagination } from './table'
import visitanteService from 'src/services/visitanteService';

import DialogVisitante from 'src/components/DialogVisitante.vue';
import DialogIntegrador from 'src/components/DialogIntegrador.vue';



const visitantes = ref([])
const loading = ref(true)
// Dialog
const openEditDialog = ref(false)
const visitanteToEdit = ref({})
const openIntegradorDialog = ref(false)


const { list:listVisitantes, update:updateVisitante } = visitanteService()
const { notifyError, notifySuccess } = useNotify()

const router = useRouter()
const $q = useQuasar()


const handleAtribuirIntegrador = async (visitante) => {
  visitanteToEdit.value = {...visitante}
  openIntegradorDialog.value = true
}

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

const carregaListVisitantes = async () => {

  try {
    loading.value = true
    visitantes.value = await listVisitantes()
    loading.value = false
  } catch (error) {
    notifyError("Erro ao carregar a lista de visitantes")
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

const atribuirIntegrador = async (visitante) => {
  try {

  } catch (error) {
    notifyError("Erro ao atribuir o integrador")

  }
}


onMounted(() => {
  carregaListVisitantes()
})


</script>
