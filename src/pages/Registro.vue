<!-- Referência -->
<!-- https://quasar.dev/vue-components/input#internal-validation -->

<template>
  <q-page padding
    class="column justify-center"
  >

    <div class="col-12">
      <p class="text-h5 text-center">
        Inscrição de Integrador
      </p>
    </div>

    <div class="row flex align-center justify-center">
      <q-form class="row justify-center q-col-gutter-sm" @submit.prevent="handleSubmit">
        <q-input
          class="col-10 col-md-4"
          outlined
          label="Primeiro Nome *"
          v-model="form.nome"
          :rules="[val => (val && val.length > 0) || 'Nome é obrigatório']"
          lazy-rules
        />
        <q-input
          class="col-10 col-md-6"
          outlined
          label="Sobrenome"
          v-model="form.sobrenome"
          :rules="[val => (val && val.length > 0) || 'Sobrenome é obrigatório']"
          lazy-rules
        />
        <q-input
          class="col-10 col-md-10"
          outlined
          label="Email*"
          v-model="form.email"
          :rules="[val => (val && val.length > 0) || 'E-mail é obrigatório']"
          lazy-rules
        />

        <q-input
          class="col-10 col-md-10"
          outlined
          label="Senha*"
          v-model="form.password"
          :rules="[val => (val && val.length >= 6) || 'A senha precisa ter no mínimo 6 caracteres']"
          hint="A senha precisa ter no mínimo 6 caracteres"
          lazy-rules
          type="password"
        />
        <q-input
          class="col-10 col-md-10"
          outlined
          label="Confirmação da Senha*"
          v-model="confirmacaoSenha"
          :rules="[val => (val && val === form.password) || 'As senhas não conferem']"
          lazy-rules
          type="password"
          />

          <q-input
          class="col-10 col-md-5"
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
          class="col-10 col-md-5"
          outlined
          label="Nascimento* "
          stack-label
          v-model="form.nascimento"
          type="date"
          reverse-fill-mask
        />

        <div class="col-10 col-md-10 flex wrap justify-center q-mt-lg q-gutter-md">
          <q-btn
            label="Cadastrar"
            color="primary"
            class="full-width"
            size="lg"
            type="submit"
          />
          <q-btn
            label="Cancelar"
            color="primary"
            class="full-width"
            outline
            size="lg"
            :to="{name: '/'}"
          />

        </div>

        <!-- <div class="row col-12 justify-center q-col-gutter-md q-mt-md">

          <div class="col-10 col-md-5">
          <q-btn
            label="Cadastrar"
            color="primary"
            class="full-width"
            size="lg"
            type="submit"
            />
          </div>
          <div class="col-10 col-md-5">
            <q-btn
            label="Cancelar"
            color="primary"
            class="full-width"
            outline
            size="lg"
            :to="{name: '/'}"
            />
          </div>
        </div> -->







      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import useNotify from 'src/composables/UseNotify'
import { useRouter } from 'vue-router'
import integradorService from 'src/services/integradorService'

const router = useRouter()
const { register } = useAuthUser()
const { post, integradorMessages } = integradorService()
const { notifyError, notifySuccess } = useNotify()

const form = ref({
  email: '',
  password: '',
  nome: '',
  sobrenome: '',
  celular: '',
  nascimento: '',
  status: 'pendente',
})
const confirmacaoSenha = ref('')


const validacaoPassword = [
  val => (val && val === form.value.password) || 'As senhas não conferem'
]






const handleSubmit = async () => {
  try {

    // await register(form.value)
    await post(form.value)

    notifySuccess("Cadastro realizado com sucesso")

    router.push({
      name: 'registro-confirmacao'
    })
  } catch (error) {

    notifyError(integradorMessages[error.code] || error.message)


  }
}
</script>
