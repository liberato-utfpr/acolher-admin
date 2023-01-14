<template>

  <q-page padding>
    <div class="col-12">
      <p class="text-h5 text-weight-bold">
        Definir Integrador
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
        <template v-slot:body-cell-visita="props">
          <q-td :props="props" >
            <span>{{ formatDate(props.row.data_celebracao) }}  </span>
            <q-chip square size="sm" >{{ getDiaSemana(props.row.data_celebracao) }}</q-chip>
          </q-td>
        </template>

        <!-- <template v-slot:body-cell-integrador="props">
          <q-td :props="props" >

            <q-btn
              icon="mdi-account-circle"
              color="primary"
              dense
              size="sm"
            >
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section>New tab</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template> -->
        <template v-slot:body-cell-integrador="props">
          <q-td :props="props" >

            <q-btn
              class="q-mr-xs"
              icon="mdi-account"
              color="primary"
              dense
              size="sm"
              @click="handleAbrirDialogIntegrador(props.row)"
            />


            <q-badge
                :label="props.row.integrador_nome ? props.row.integrador_nome : 'sem integrador'"
                :color = "props.row.integrador_nome ? 'positive' : 'negative'"
              />

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


    <DialogIntegrador
      :visible="openIntegradorDialog"
      @closeDialog="openIntegradorDialog = false"
      @atribuirClick="handleAtribuirIntegrador"
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
import acompanhamentoService from 'src/services/acompanhamentoService';
import { getDiaSemana, formatDate } from 'src/utils/format'

import DialogIntegrador from 'src/components/DialogIntegrador.vue';



const visitantes = ref([])
const loading = ref(true)
// Dialog
const openEditDialog = ref(false)
const visitanteAcompanhamento = ref({})
const openIntegradorDialog = ref(false)


const { update:updateVisitante, listVisitantesCelebracaoAcompanhamentoSemIntegrador  } = visitanteService()
const { update:updateAcompanhamento } = acompanhamentoService()
const { notifyError, notifySuccess } = useNotify()

const router = useRouter()
const $q = useQuasar()




const handleEditVisitante = async (visitante) => {
  visitanteAcompanhamento.value = {...visitante}
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


const handleAbrirDialogIntegrador = async (visitante) => {
  visitanteAcompanhamento.value = visitante
  openIntegradorDialog.value = true
}

const handleAtribuirIntegrador = async (integrador) => {
  try {
    // Cria o objeto acompanhamento para atualização
    let acompanhamento = {
      visitante_id: visitanteAcompanhamento.value.id,
      integrador_email: integrador.email,
      integrador_nome: integrador.nome,
      data_inicio: new Date().toLocaleDateString('en-CA'), /* padrão YYYY-MM-DD */
    }

    if (integrador.sexo !== visitanteAcompanhamento.value.sexo) {
      notifyError("O integrador deve ser do mesmo sexo do visitante")
      return
    }

    // Atualiza o status do visitante para 'em acompanhamento'
    await updateVisitante({ id:visitanteAcompanhamento.value.id, status:'em acompanhamento'}, 'id')
    // Atualiza o acompanhamento do visitante com a data de inicio e o integrador
    await updateAcompanhamento(acompanhamento, 'visitante_id')

    notifySuccess("Integrador atribuído")
    carregaListVisitantes()

  } catch (error) {
    notifyError("Erro ao atribuir o integrador")
    console.log(error.message)

  }
}



const carregaListVisitantes = async () => {

  try {
    loading.value = true
    visitantes.value = await listVisitantesCelebracaoAcompanhamentoSemIntegrador()
    loading.value = false

  } catch (error) {
    notifyError("Erro ao carregar a lista de visitantes")
    console.log(error.message)
  }

}



/* TABELA ----------------------------------------------------------------*/
const pagesNumber = computed(() =>
  Math.ceil(visitantes.value.length / initialPagination.value.rowsPerPage)
)

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* -----------------------------------------------------------------------*/




onMounted(() => {
  carregaListVisitantes()
})


</script>
