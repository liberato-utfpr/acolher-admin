<template>
  <q-page padding>

    <div class="col-12">
      <p class="text-h5 text-weight-bold">
        Mensagem
      </p>
    </div>

    <div class="row flex align-center justify-center">

      <q-form class="col-md-10 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-12 col-md-4"
            outlined
            label="Nome da mensagem*"
            v-model="form.nome"
            :rules="[val => (val && val.length > 0) || 'Nome é obrigatório']"
            lazy-rules
          />

          <div class="" style="width: 100%">
            <div class="text-subtitle2 q-mb-sm">Mensagem*</div>
            <q-input
              v-model="form.texto"
              outlined
              type="textarea"
              :rules="[val => (val && val.length > 0) || 'Mensagem é obrigatória']"
              lazy-rules
            />
          </div>


          <div class="text-caption ">
            <div><strong>[nome_visitante]</strong>: Insere o nome do visitante </div>
            <div><strong>[oracao_visitante]</strong>: Insere o motivo de oração do visitante</div>
            <div><strong>[nome_integrador]</strong>: Insere o nome do integrador</div>
            <div><strong>(termo masculino/termo feminino)</strong>: Define o termo de acordo com o sexo do visitante</div>

          </div>


          <div class="col-12 q-gutter-sm flex justify-center q-mt-md">
            <q-btn
              :style="$q.platform.is.desktop? 'width: 48%;' : 'width: 100%;'"
              class=""
              :label="idUpdate ? 'Atualizar' : 'Salvar'"
              color="primary"
              type="submit"
              size="md"
            />
            <q-btn
              :style="$q.platform.is.desktop? 'width: 48%;' : 'width: 100%;'"
              label="Cancelar"
              color="primary"
              outline
              size="md"
              :to="{name: 'mensagem-list'}"
            />
          </div>


        </div>

      </q-form>

    </div>


  </q-page>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import useNotify from 'src/composables/UseNotify';
import { useRouter, useRoute } from 'vue-router';
import mensagemService from 'src/services/mensagemService'
import { openURL } from 'quasar';



const form = ref({
  nome: '',
  texto: '',

})


const { notifyError, notifySuccess } = useNotify()
const { getBy, post:postMensagem, update:updateMensagem } = mensagemService()
const router = useRouter()
const route = useRoute()

const idUpdate = computed(() => route.params.id)




const handleSubmit = async () => {
  try {

    if (idUpdate.value) {
      await updateMensagem(form.value, 'id')
      notifySuccess("Atualizado com sucesso")
    } else {
      await postMensagem(form.value)
      notifySuccess("Cadastrado com sucesso")
    }

    router.push({name: 'mensagem-list'})

  } catch (error) {
    notifyError("Não foi possível cadastrar a mensagem")
    router.push({name: 'mensagem-list'})
  }
}




onMounted(async () => {

  try {
    if (idUpdate.value) {

      form.value = await getBy('id', idUpdate.value)
    }
  } catch (error) {
    notifyError("Não foi possível carregar a mensagem")
    router.push({name: 'mensagem-list'})
  }

})

</script>
