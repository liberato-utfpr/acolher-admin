<template>
  <q-page padding class="column full-width full-height justify-center items-center">
    <div style=" width:100%; max-width: 500px" >
      <q-form @submit.prevent="handleLogin" >
        <p class="text-h5 text-center ">Administrador</p>
        <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md q-mt-lg">
          <q-input label="Email" v-model="form.email" type="email" outlined lazy-rules :rules="validacaoEmail" />
          <q-input label="Password" v-model="form.password" type="password" outlined lazy-rules
          :rules="validacaoPassword" />
          <div class="full-width q-pt-md">
            <q-btn label="Login" color="primary" class="full-width" size="lg" type="submit" />
          </div>
        </div>
      </q-form>
    </div>
  </q-page>



</template>



<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useAuthUser from 'src/composables/UseAuthUser'
import useNotify from 'src/composables/UseNotify'
import { useQuasar } from 'quasar'

const router = useRouter()
const { loginAdmin, errorMessages } = useAuthUser()
const { notifySuccess, notifyError } = useNotify()

const $q = useQuasar()

const form = ref({
  email: '',
  password: ''
})

// VALIDAÇÃO
const validacaoEmail = [val => (val && val.length > 0) || 'E-mail é obrigatório']
const validacaoPassword = [val => (val && val.length >= 6) || 'A senha precisa ter no mínimo 6 caracteres']



// onMounted(() => {
//   if (isLoggedIn) {
//     router.push({ name: 'home' })
//   }
// })

const handleLogin = async () => {
  try {

    await loginAdmin(form.value)
    notifySuccess('Autenticado com sucesso!')
    router.push({ name: 'admin-dash' })
  } catch (error) {
    notifyError(errorMessages[error.status])

  }
}



</script>
