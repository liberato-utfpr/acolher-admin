<template>

  <q-page padding>
    <div class="col-12">
      <p class="text-h5 text-weight-bold">
        Painel
      </p>
    </div>

    <!-- LISTA INTEGRADORES PENDENTES -->
    <div v-if="pendentes.length > 0"  class="row flex q-gutter-xs q-mb-md justify-between wrap">
      <q-list bordered separator class="rounded-borders col-12">

        <q-item
          v-for="integrador in pendentes" :key="integrador.email"

        >
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
              <q-btn label="Aprovar" size="md" color="positive" @click="aprovarIntegrador(integrador)" />
              <q-btn label="Excluir" size="md" color="negative" @click="excluirIntegrador(integrador)" />
            </div>
          </q-item-section>
        </q-item>

      </q-list>


    </div>

    <div class="row flex q-gutter-md q-mb-md justify-start wrap">

      <q-btn
        color="primary"
        :to="{name: 'celebracao-form'}"
      >
        <q-icon left size="3em" name="mdi-account-group" />
        <div>Cadastrar <br/> visitantes</div>
      </q-btn>

      <q-btn
        color="primary"
        :to="{name: 'celebracao-form'}"
      >
        <q-icon left size="3em" name="mdi-account-multiple-check" />
        <div>Associar <br/> Integrador</div>
      </q-btn>

      <!-- <q-btn @click="openDialog = !openDialog">
        teste
      </q-btn>

      <DialogVisitante :visible="openDialog" @closeDialog="openDialog = false"  /> -->

    </div>
  </q-page>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import useNotify from 'src/composables/UseNotify';
import integradorService from 'src/services/integradorService';
import { formatDate, formatCelular } from 'src/utils/format'
import DialogVisitante from 'src/components/DialogVisitante.vue';

const pendentes = ref([])
const openDialog = ref(false)

const $q = useQuasar()
const { notifyError, notifySuccess } = useNotify()
const { listFilter, aprovar } = integradorService()



const aprovarIntegrador = async (integrador) => {
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
      handleListPendentes()
    })
  } catch (error) {
    notifyError(error.message)
  }
}

const excluirIntegrador = async (integrador) => {
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



const handleListPendentes = async () => {
  // Filtar por status igual a pendente e ordenar por nome
  pendentes.value = await listFilter('status', 'eq', 'pendente', 'nome')
}

onMounted(() => {
  handleListPendentes()

})

</script>
