<template>




  <q-page padding>
    <div class="col-12">
      <p class="text-h5 text-weight-bold">
        Integradores
      </p>
    </div>

    <!-- // LISTA DAS APROVAÇÕES PENDENTES -->
    <div v-if="pendentes.length > 0"  class="row flex q-gutter-xs q-mb-md justify-between wrap">
      <q-list bordered separator class="rounded-borders col-12" >

        <q-item v-for="integrador in pendentes" :key="integrador.email">
          <q-item-section avatar v-if="$q.platform.is.desktop">
            <q-avatar color="secondary" text-color="white" size="lg">
              {{ integrador?.nome[0] }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ integrador.nome }}</q-item-label>
            <q-item-label caption lines="1">{{ integrador.email }}</q-item-label>
            <q-item-label caption lines="1">{{ formatCelular(integrador.celular) }}</q-item-label>
            <q-item-label caption lines="1">{{ formatDate(integrador.nascimento) }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="q-gutter-xs row flex wrap">
              <q-btn label="Aprovar" size="md" color="positive" @click="handleAprovarIntegrador(integrador)" />
              <q-btn label="Excluir" size="md" color="negative" @click="handleExcluirIntegrador(integrador)" />
            </div>
          </q-item-section>
        </q-item>

      </q-list>


    </div>

    <div class="row">


      <q-table
        :rows="integradores"
        :columns="columnsIntegradores"
        row-key="email"
        :loading="loading"
        sortBy="name"
        class="col-12"
        v-model:pagination="initialPagination"
        rows-per-page-label="Integradores por página"
        no-data-label="Nenhum integrador cadastrado"
        >

        <template v-slot:top>
          <q-btn
            v-if="$q.platform.is.desktop"
            label="Novo"
            color="primary"
            icon="mdi-plus"
            :to="{ name: 'integrador-form' }"
          />
        </template>

        <template v-slot:body-cell-nome="props">
          <q-td :props="props">
            <div>
              {{ props.row.nome }} {{ props.row.sobrenome }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div>
              <q-badge
                :label="props.value"
                color = 'primary'
              />
            </div>
          </q-td>
        </template>


        <template v-slot:body-cell-acoes="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="mdi-pencil-outline"
              color="secondary"
              dense
              size="sm"
              @click="handleEdit(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              icon  = 'mdi-account-cancel'
              color = 'negative'
              size="sm"
              dense
              @click="desabilitarIntegrador(props.row)"
            >
              <q-tooltip>Desabilitar</q-tooltip>
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
      <q-btn v-if="$q.platform.is.mobile" fab icon="mdi-plus" color="primary" :to="{ name: 'integrador-form' }" />
    </q-page-sticky>
  </q-page>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import useNotify from 'src/composables/UseNotify';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { columnsIntegradores, initialPagination } from './table'
import { formatDate, formatCelular } from 'src/utils/format'
import integradorService from 'src/services/integradorService';



const integradores = ref([])
const pendentes = ref([])
const loading = ref(true)


const { listFilter, aprovar, desabilitar, remove } = integradorService()
const { notifyError, notifySuccess } = useNotify()

const router = useRouter()
const $q = useQuasar()

// https://postgrest.org/en/stable/api.html?highlight=operator
const handleListIntegradores = async () => {
  try {

    loading.value = true

    // Filtar por status diferente de desabilitado e ordenar por nome
    const todosIntegradores = await listFilter('status', 'neq', 'desabilitado', 'nome')
    integradores.value = todosIntegradores.filter((integrador) => integrador.status !== 'pendente')
    pendentes.value = todosIntegradores.filter((integrador) => integrador.status === 'pendente')

    loading.value = false
  } catch (error) {
    notifyError(error.message)
  }
}

const handleEdit = (integrador) => {
  router.push({ name: 'integrador-form', params: { email: integrador.email } })
}


const handleAprovarIntegrador = async (integrador) => {
  try {
    $q.dialog({
      title: 'APROVAÇÃO',
      message: `Você confirma a aprovação do integrador ${integrador.nome}`,
      cancel: true,
      persistent: false,
      ok: {
        label: 'Aprovar',
        color: 'positive'
      },
      cancel: {
        label: 'Cancelar',
        flat: true,
      }
    }).onOk(async () => {
      await aprovar(integrador)
      notifySuccess("Aprovado")
      handleListIntegradores()
    })
  } catch (error) {
    notifyError(error.message)
  }
}

const handleExcluirIntegrador = async (integrador) => {
  try {
    $q.dialog({
      title: 'EXCLUSÃO',
      message: `Você te certeza que deseja excluir a solicitação de cadastro do integrador ${integrador.nome}`,
      cancel: true,
      persistent: false,
      ok: {
        label: 'Excluir',
        color: 'negative'
      },
      cancel: {
        label: 'Cancelar',
        flat: true,
      }
    }).onOk(async () => {
      await remove(integrador, 'email') // remover o integrador pelo email
      notifySuccess("Excluído com sucesso")
      handleListIntegradores()

    })
  } catch (error) {
    notifyError(error.message)
  }
}

const pagesNumber = computed(() =>
  Math.ceil(integradores.value.length / initialPagination.value.rowsPerPage)
)

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  handleListIntegradores()
})


</script>
