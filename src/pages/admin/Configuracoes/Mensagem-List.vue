<template>
<q-page padding>
  <div class="col-12">
    <p class="text-h5 text-weight-bold">
      Mensagens
    </p>
  </div>
  <div>
    <q-table
        :rows="mensagens"
        :columns="columnsMensagens"
        row-key="id"
        :loading="loading"
        sortBy="data"
        class="col-12"
        v-model:pagination="initialPagination"
        rows-per-page-label="Mensagens por página"
        no-data-label="Nenhuma mensagem cadastrada"
      >

        <template v-slot:top>
          <q-btn
            v-if="$q.platform.is.desktop"
            label="Novo"
            color="primary"
            icon="mdi-plus"
            :to="{ name: 'mensagem-form' }"
          />
        </template>



        <template v-slot:body-cell-mensagem="props">
          <q-td :props="props" >
            <q-btn
              class="q-mr-sm"
              icon="mdi-file-search"
              label="Ver mensagem"
              size="sm"
              dense
              @click="handleVerMensagem(props.row.texto)"
            >
              <q-tooltip>Ver mensagem</q-tooltip>
            </q-btn>

            <q-btn
              v-if="props.row.texto"
              dense
              label="Testar"
              icon="mdi-whatsapp"
              color="green-7"
              size="sm"
              @click="handleTesteMensagem(props.row)"
          />

          </q-td>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="mdi-pencil-outline"
              color="secondary"
              dense
              size="sm"
              @click="handleEditMensagem(props.row)"
            >
              <q-tooltip>Editar Mensagem</q-tooltip>
            </q-btn>
            <q-btn
              icon  = 'mdi-close'
              color = 'negative'
              size="sm"
              dense
              @click="handleApagarMensagem(props.row)"
            >
              <q-tooltip>Apagar Mensagem</q-tooltip>
            </q-btn>

          </q-td>
        </template>



      </q-table>

  </div>

</q-page>
</template>


<script setup>

import { ref, onMounted, computed } from 'vue'
import useNotify from 'src/composables/UseNotify'
import { useQuasar } from 'quasar'
import { openURL } from 'quasar';
import mensagemService from 'src/services/mensagemService'
import { columnsMensagens, initialPagination } from './tableMensagens'
import useAuthUser from 'src/composables/UseAuthUser';
import { useRouter } from 'vue-router';

const { getUserAdmin } = useAuthUser()
const $q = useQuasar()
const { notifyError, notifySuccess } = useNotify()
const { listMensagens } = mensagemService()
const router = useRouter()

const mensagens = ref([])
const loading = ref(true)
const userAdmin = ref(null)



const handleVerMensagem = (mensagem) => {
  $q.dialog({
    title: 'Mensagem',
    message: mensagem,
  })
}

const handleEditMensagem = (mensagem) => {
  try {

    $q.dialog({
      title: 'EDIÇÃO',
      message: `Você deseja editar a mensagem: ${mensagem.nome}?`,
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
      router.push({ name: 'mensagem-form', params: { id: mensagem.id } })

    })
  } catch (error) {
    notifyError(error.message)
  }
}


const handleApagarMensagem = async (mensagem) => {
  try {
    $q.dialog({
      title: 'ATENÇÃO',
      message: `Deseja apagar a mensagem: ${mensagem.nome})?`,
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

      notifySuccess("Mensagem excluída com sucesso!")
      carregaListMensagens()
    })
  } catch (error) {
    notifyError(error.message)
  }
}

const handleTesteMensagem = (mensagem) => {
  // console.log(mensagem.texto)
  // console.log(userAdmin.value.celular)

  const link = encodeURI(`https://api.whatsapp.com/send?phone=55${userAdmin.value.celular}&text=${mensagem.texto}`)
  openURL(link)

}

/* FUNÇÕES DE PAGINAÇÃO ----------------------------------------------------*/
const pagesNumber = computed(() =>
Math.ceil(celebracoes.value.length / initialPagination.value.rowsPerPage)
)

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
/* -------------------------------------------------------------------------*/


const carregaListMensagens = async () => {
  try {

    loading.value = true

    mensagens.value = await listMensagens()

    loading.value = false
  } catch (error) {
    notifyError(error.message)
  }
}

onMounted(async () => {
  try {
    carregaListMensagens()
    userAdmin.value = await getUserAdmin()
  } catch (error) {
    notifyError("Erro ao carregar o usuário coordenador")
    console.log(error.message)

  }
})


</script>
