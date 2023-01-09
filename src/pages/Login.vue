<template>
  <q-page
    padding
    class="column justify-center align-center full-width full-height"
  >
    <q-form class="row justify-center fit" @submit.prevent="handleLogin">
      <!-- <p class="col-12 text-h5 text-center">Login</p> -->
      <div
        class="full-width row justify-center q-mb-lg"
      >
        <q-img
          src="~assets/logo_acolher.jpg"

          v-bind:style="$q.screen.lt.sm ? {'width': '40%'} : {'width': '15%'}"
        />
      </div>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-sm">
        <q-input
          label="Email"
          v-model="form.email"
          type="email"
          outlined
          lazy-rules
          :rules="validacaoEmail"
        />
        <q-input
          label="Senha"
          v-model="form.password"
          type="password"
          outlined
          lazy-rules
          :rules="validacaoPassword"
        />

        <div class="full-width">
          <q-btn
            label="Entrar"
            color="primary"
            class="full-width"
            size="lg"
            type="submit"
          />
        </div>
        <div class="full-width q-gutter-y-sm">
          <q-btn
            label="Cadastrar"
            color="primary"
            class="full-width"
            flat
            size="md"
            :to="{name:'registro'}"
          />
          <!-- <q-btn label="Esqueci a senha" color="primary" class="full-width" flat size="md" -->
            <!-- :to="{ name: 'forgot-password' }" /> -->
        </div>
      </div>
    </q-form>
  </q-page>




  <!-- <div class="row flex justify-center align-center" height="85vh" style="height: 100vh">

    <div class="col-12 col-md-6 flex justify-center content-center">
      <q-card v-bind:style="$q.screen.lt.sm ? {'width': '80%'} : {'width': '50%'}" >
        <q-card-section class="row justify-center">
          <q-img src="~assets/logo_acolher.jpg" style="width: 35%; " />
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent="handleLogin" >
            <q-input
              label="Email"
              v-model="form.email"
              type="email"
              outlined
              lazy-rules
              :rules="validacaoEmail"
            />
            <q-input
              label="Password"
              v-model="form.password"
              type="password"
              outlined
              lazy-rules
              :rules="validacaoPassword"
            />

            <div class="q-gutter-y-md q-mb-md">
              <q-btn
                class="full-width"
                color="primary"
                label="Entrar"
                type="submit"
                size="lg"

                />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div> -->

</template>



<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useAuthUser from 'src/composables/UseAuthUser'
import useNotify from 'src/composables/UseNotify'
import { useQuasar } from 'quasar'

const router = useRouter()
const {loginIntegrador, errorMessages } = useAuthUser()
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

    const status = await loginIntegrador(form.value)
    notifySuccess('Autenticado com sucesso!')
    router.push({ name: 'home' })

  } catch (error) {

    notifyError(errorMessages[error.status])

  }
}



</script>
