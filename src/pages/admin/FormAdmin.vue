<template>

  <q-page padding>
    <div class="col-10">
      <p class="text-h5 text-center">
        Cadastro Administrador
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
            lazy-rules
          />

          <q-input
            class="col-10 col-md-10"

            outlined
            label="Celular*"
            v-model="form.celular"
            mask="(##) #####-####"
            hint="Informe o celular com DDD"
            unmasked-value
            :rules="[val => (val && val.length >= 6) || 'O celular precisa ter no mínimo 11 dígitos']"
            lazy-rules
          />

          <div class="col-10 col-md-10 flex wrap justify-center q-mt-lg q-gutter-md">

            <q-btn
              label="Cadastrar"
              color="primary"
              type="submit"
              size="lg"
            />

            <q-btn
              label="Cancelar"
              color="primary"
              outline
              size="lg"
              :to="{name: '/'}"
            />
          </div>

      </q-form>
    </div>
  </q-page>

</template>

<script setup>

import { ref, onMounted } from 'vue'
import useApi from 'src/composables/UseApi';
import useAuthUser from 'src/composables/UseAuthUser';
import useNotify from 'src/composables/UseNotify';
import { useRouter } from 'vue-router'

const form = ref({
  nome: '',
  sobrenome: '',
  email: '',
  password: '',
  celular: ''
})

const { register, user } = useAuthUser()
const { post } = useApi('administrador')
const { notifySuccess, notifyError } = useNotify()
const router = useRouter()

const handleSubmit = async () => {
  try {
      let admin = { ...form.value }
      admin.user_type = 'admin'
      const data = await register(admin)

      let userAdmin = { ...form.value } // pra não gerar conflito com o user_type
      userAdmin.user_id = data.user.id

      await post(userAdmin)
      notifySuccess("Cadastro realizado com sucesso")
      router.push({
        name: 'admin-login'
      })


    } catch (error){

      // notifyError("Já existe um administrador cadastrado com esse email")
      notifyError(error.message)
    }

}

onMounted(() => {

  // if (user.value.email !== 'rafael.liberato@gmail.com') {
  //   router.push({
  //     name: 'admin-dash'
  //   })
  // }
})


</script>
