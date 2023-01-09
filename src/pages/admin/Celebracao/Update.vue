<template>
  <q-page padding>

    <div class="col-12">
      <p class="text-h5 text-weight-bold">
        Editar Celebração
      </p>
    </div>


    <div class="row flex align-center justify-center">

      <q-form
        class="col-md-12 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-12 col-md-5"
            outlined
            label="Data*"
            v-model="form.data"
            :rules="[val => (val && val.length > 0) || 'A data é obrigatória']"
            lazy-rules
            stack-label
            type="date"
          />

          <q-select
            class="col-12 col-md-7"
            outlined
            v-model="form.tipo_celebracao_id"
            :options="opcoesCelebracao"
            label="Tipo"
            use-input
            option-value="id"
            option-label="nome"
            map-options
            emit-value
            @filter="filterCelebracao"
            :rules="[val => (val && val!== '') || 'O tipo é obrigatório']"
            lazy-rules
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>


          <div class="col-12 col-md-6 q-my-md ">
            <q-btn
              class="full-width"
              label="Atualizar"
              color="primary"
              type="submit"
              size="md"
            />

          </div>
          <div class="col-12 col-md-6  q-my-md " >
            <q-btn
              class="full-width"
              label="Cancelar"
              color="primary"
              outline
              size="md"
              :to="{name: 'celebracao-list'}"
            />
          </div>
        </div>
      </q-form>

      <!-- VISITANTES -->
      <div class="col-12">
        <p class="text-h6 text-left">
          Visitantes
        </p>
      </div>

      <q-table
        class="col-12"
        :rows="visitantes"
        :columns="columnsVisitantesList"
        row-key="id"
        :loading="loading"
        sortBy="nome"
        v-model:pagination="initialPagination"
        rows-per-page-label="Visitantes por página"
        no-data-label="Nenhum visitante cadastrado"
      >

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div>
              <q-badge
                :label="props.value"
                :color = "props.value === 'sem integrador' ? 'negative' : 'positive'"
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

    <DialogVisitante
      :visible="openEditDialog"
      :visitante="visitanteToEdit"
      @closeDialog="openEditDialog = false"
      @atualizarClick="atualizarVisitante"
    />
  </q-page>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import useNotify from 'src/composables/UseNotify';
import tipoCelebracaoService from 'src/services/tipoCelebracaoService';
import celebracaoService from 'src/services/celebracaoService';
import visitanteService from 'src/services/visitanteService';
import DialogVisitante from 'src/components/DialogVisitante.vue';

import { columnsVisitantesList, initialPagination } from './table'


const form = ref({
  data: '',
  tipo_celebracao_id: '',
})

const celebracao = ref({}) // variável para receber a celebracao que será atualizada
const opcoesCelebracao = ref([])
const visitantes = ref([])
const loading = ref(true)

const openEditDialog = ref(false)
const visitanteToEdit = ref({}) // variável temporária para armazenar o visitante que será editado


let listaTipoCelebracao = [] // variável temporária para armazenar os tipos de celebração

const router = useRouter()
const route = useRoute()
const { list:listTipoCelebracao } = tipoCelebracaoService()
const { getBy:getCelebracao, update:updateCelebracao } = celebracaoService()
const { listVisitantesFromCelebracao, removeVisitante, update:updateVisitante } = visitanteService()
const $q = useQuasar()

const { notifyError, notifySuccess } = useNotify()


const idUpdate = computed(() => route.params.id)



const handleSubmit = async () => {
  try {
    if (idUpdate.value) {
      await updateCelebracao(form.value, 'id')
      notifySuccess("Atualizado com sucesso")

    }
    router.push({name: 'celebracao-list'})
  } catch (error) {
    notifyError(error.message)
  }
}




const carregaListaTipoCelebracao = async () => {
  opcoesCelebracao.value = await listTipoCelebracao()
  listaTipoCelebracao = [...opcoesCelebracao.value]
}

// Filtra a lista de tipo de celebração do q-select
const filterCelebracao = (val, update) => {
  if (val === '') {
    update(() => {
      opcoesCelebracao.value = listaTipoCelebracao
    })

    return
  }
  update(() => {
    opcoesCelebracao.value = opcoesCelebracao.value.filter(i => i.nome.toLowerCase().includes(val.toLowerCase()))
  })
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

const handleEditVisitante = async (visitante) => {
  visitanteToEdit.value = {...visitante}
  openEditDialog.value = true
}

const atualizarVisitante = async (visitante) => {
  try {
    await updateVisitante(visitante, 'id')
    notifySuccess("Visitante atualizado")
    carregaListVisitantes()
  } catch (error) {
    notifyError("Erro ao atualizar o visitante")
  }
}



const handleGetCelebracao = async () => {
  try {

    celebracao.value = await getCelebracao('id', idUpdate.value)
    form.value = celebracao.value
    carregaListVisitantes()

  } catch (error) {

    notifyError("Problema no carregamento da celebração")
    router.push({ name:'celebracao-list' })
  }
}

const carregaListVisitantes = async () => {
  try {
    loading.value = true

    visitantes.value = await listVisitantesFromCelebracao(celebracao.value.id)

    loading.value = false

  } catch (error) {
    notifyError(error.message)
    console.log(error.message)
  }

}

onMounted(async () => {

  try {
    if (idUpdate.value) {

      carregaListaTipoCelebracao()
      handleGetCelebracao(idUpdate.value)

    } else {
      router.push({name: 'celebracao'})
    }

  } catch (error) {
    notifyError("Erro no carregamento")
  }
})

</script>
