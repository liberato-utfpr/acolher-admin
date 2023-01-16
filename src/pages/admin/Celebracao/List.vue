<template>

  <q-page padding>
    <div class="col-12">
      <p class="text-h5 text-weight-bold">
        Celebração
      </p>
    </div>

    <div class="row">

      <q-table
        :rows="celebracoes"
        :columns="columnsCelebracoesList"
        row-key="id"
        :loading="loading"
        sortBy="data"
        class="col-12"
        v-model:pagination="initialPagination"
        rows-per-page-label="Celebrações por página"
        no-data-label="Nenhuma celebração cadastrada"
      >

        <template v-slot:top>
          <q-btn
            v-if="$q.platform.is.desktop"
            label="Novo"
            color="primary"
            icon="mdi-plus"
            :to="{ name: 'celebracao-form' }"
          />
        </template>

        <template v-slot:body-cell-data="props">
          <q-td :props="props">
            <span>{{ formatDate(props.row.data) }}  </span>
            <q-chip square size="sm" icon="event">{{ getDiaSemana(props.row.data) }}</q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-visitantes="props">
          <q-td :props="props">
            <span>{{ !props.row.visitantes ? 0 : props.row.visitantes }}  </span>

          </q-td>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="mdi-pencil-outline"
              color="secondary"
              dense
              size="sm"
              @click="handleEditCelebracao(props.row)"
            >
              <q-tooltip>Editar Celebração</q-tooltip>
            </q-btn>
            <q-btn
              icon  = 'mdi-close'
              color = 'negative'
              size="sm"
              dense
              @click="handleApagarCelebracao(props.row)"
            >
              <q-tooltip>Apagar Celebração</q-tooltip>
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
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn v-if="$q.platform.is.mobile" fab icon="mdi-plus" color="primary" :to="{ name: 'celebracao-form' }" />
    </q-page-sticky>
  </q-page>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import useNotify from 'src/composables/UseNotify';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { columnsCelebracoesList, initialPagination } from './table'
import { getDiaSemana, formatDate } from 'src/utils/format'
import celebracaoService from 'src/services/celebracaoService';
import visitanteService from 'src/services/visitanteService';



const celebracoes = ref([])
const loading = ref(true)


const { listCelebracoesVisitantes, removeCelebracao } = celebracaoService()
const { removeVisitantesFromCelebracao } = visitanteService()
const { notifyError, notifySuccess } = useNotify()

const router = useRouter()
const $q = useQuasar()




const handleEditCelebracao = (celebracao) => {
  try {

    $q.dialog({
      title: 'EDIÇÃO',
      message: `Você deseja editar a celebração do dia ${formatDate(celebracao.data)} (${celebracao.nome_celebracao})?`,
      cancel: true,
      persistent: false,
      ok: {
        label: 'Editar',
        color: 'positive'
      },
      cancel: {
        label: 'Cancelar',
        flat: true,
      }
    }).onOk(async () => {
      // encaminha para a página de atualizacao
      router.push({ name: 'celebracao-update', params: { id: celebracao.id } })

    })
  } catch (error) {
    notifyError(error.message)
  }
}


const handleApagarCelebracao = async (celebracao) => {
  try {
    $q.dialog({
      title: 'ATENÇÃO',
      message: `Deseja apagar a celebração do dia ${formatDate(celebracao.data)} (${celebracao.nome_celebracao}) e TODOS os seus visitantes?`,
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
      await apagarCelebracaoVisitantes(celebracao.id)
      await apagarCelebracao(celebracao.id)
      notifySuccess("Removido com sucesso!")
      carregaListCelebracoes()
    })
  } catch (error) {
    notifyError(error.message)
  }
}

const apagarCelebracaoVisitantes = async (celebracaoId) => {
  try {
    await removeVisitantesFromCelebracao(celebracaoId)
  } catch (error) {
    notifyError("Erro ao remover visitantes da celebração!")
  }
}

const apagarCelebracao = async (celebracaoId) => {
  try {
    await removeCelebracao(celebracaoId)
  } catch (error) {
    notifyError("Erro ao remover celebração!")
    console.log(error.message)
  }
}

const pagesNumber = computed(() =>
  Math.ceil(celebracoes.value.length / initialPagination.value.rowsPerPage)
)

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// https://postgrest.org/en/stable/api.html?highlight=operator
const carregaListCelebracoes = async () => {
  try {

    loading.value = true

    celebracoes.value = await listCelebracoesVisitantes()

    loading.value = false
  } catch (error) {
    notifyError(error.message)
  }
}

onMounted(() => {
  carregaListCelebracoes()
})


</script>
