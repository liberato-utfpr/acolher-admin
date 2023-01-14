<template>
  <q-page padding>

    <div class="col-12">
      <p class="text-h5 text-weight-bold">
        Integrador
      </p>
    </div>

    <div class="row flex align-center justify-center">

      <q-form class="col-md-10 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-12 col-md-3"
            outlined
            label="Primeiro Nome *"
            v-model="form.nome"
            :rules="[val => (val && val.length > 0) || 'Nome é obrigatório']"
            lazy-rules
          />

          <q-input
            class="col-12 col-md-7"
            outlined
            label="Sobrenome"
            v-model="form.sobrenome"
            :rules="[val => (val && val.length > 0) || 'Sobrenome é obrigatório']"
            lazy-rules
          />

          <q-input
            class="col-12 col-md-10"
            outlined
            label="Email*"
            v-model="form.email"
            :rules="[val => (val && val.length > 0) || 'E-mail é obrigatório']"
            lazy-rules
          />
          <q-input
            class="col-12 col-md-10"
            outlined
            label="Senha*"
            v-model="form.password"
            :rules="[val => (val && val.length >= 6) || 'A senha precisa ter no mínimo 6 caracteres']"
            lazy-rules
          />

          <q-input
            class="col-12 col-md-5"
            outlined
            label="Celular*"
            v-model="form.celular"
            mask="(##) #####-####"
            hint="Informe o celular com DDD"
            unmasked-value
            :rules="[val => (val && val.length >= 6) || 'O celular precisa ter no mínimo 11 dígitos']"
            lazy-rules
          />

          <q-input
            class="col-12 col-md-5"
            outlined
            label="Nascimento* "
            stack-label
            v-model="form.nascimento"
            type="date"
            reverse-fill-mask
          />

          <div class="col-12 col-md-10">
            <q-btn
              class="full-width q-mt-lg"
              :label="emailUpdate ? 'Atualizar' : 'Salvar'"
              color="primary"
              type="submit"
              size="lg"
            />

            <q-btn
              class="full-width q-mt-md"
              label="Cancelar"
              color="primary"
              outline
              size="lg"
              :to="{name: 'admin-integrador'}"
            />
          </div>
        </div>

      </q-form>
    </div>


  </q-page>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import useNotify from 'src/composables/UseNotify';
import integradorService from 'src/services/integradorService';
import { formatDate } from 'src/utils/format'

const form = ref({
  nome: '',
  sobrenome: '',
  email: '',
  password: '',
  celular: '',
  nascimento: '',
  status: 'pendente',
})

const router = useRouter()
const route = useRoute()
const { update, post, postAprovado, getBy } = integradorService()
const { notifyError, notifySuccess } = useNotify()

const emailUpdate = computed(() => route.params.email)
let integrador = {}


const handleSubmit = async () => {
  try {
    if (emailUpdate.value) {
      await update(form.value, 'email')
      notifySuccess("Atualizado com sucesso")

    } else {
      form.value.status = 'aprovado'
      // await post(form.value)
      await postAprovado(form.value)

      notifySuccess("Cadastrado com sucesso")
    }
    router.push({name: 'admin-integrador'})
  } catch (error) {
    notifyError(error.message)
  }
}

const handleGetIntegrador = async (email) => {
  try {
    integrador = await getBy('email', email)

    // console.log("veio do banco", formatDate(integrador.nascimento))

    form.value = integrador
    // form.value.nascimento = formatDate(integrador.nascimento)
  } catch (error) {
    notifyError(error.message)
  }
}


onMounted(() => {

  if (emailUpdate.value) {
    handleGetIntegrador(emailUpdate.value)
  }
})

</script>
