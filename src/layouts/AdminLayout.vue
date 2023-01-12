<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <img src="../assets/acolher-branco.svg" alt="logo" id="logo" style="height:54px;"/>
        <q-toolbar-title>
          Administrador
        </q-toolbar-title>

        <q-btn round>
          <q-avatar color="secondary" text-color="white" size="md" label="R">
            {{ user?.user_metadata.nome.substr(0,1) }}
          </q-avatar>
          <q-menu
            transition-show="flip-right"
            transition-hide="flip-left"
          >
            <q-list style="min-width: 100px">
              <q-item>
                <q-item-section>
                  <div class="text-caption text-weight-medium">
                    {{ user?.user_metadata.nome }}

                  </div>
                </q-item-section>
              </q-item>
              <q-separator spaced />
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section>
                  <q-item-label>Sair</q-item-label>
                </q-item-section>
              </q-item>

            </q-list>
          </q-menu>
        </q-btn>





      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="200">

      <q-list class="text-secondary" >

        <q-item-label header class="text-center" >
          <q-avatar color="secondary" text-color="white" size="md" label="R">
            {{ user?.user_metadata.nome.substr(0,1) }}
          </q-avatar>
          <div class="text-black q-mt-sm">
            {{ user?.user_metadata.nome }} {{ user?.user_metadata.sobrenome }}
          </div>
          <div class="text-caption">
            Coordenador
          </div>
        </q-item-label>
        <q-separator />

        <!-- <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        /> -->

        <EssentialLink class="q-mt-md"
          key="Painel" v-bind="{
          title: 'Painel',
          caption: '',
          icon: 'mdi-home',
          routeName: 'admin-dash'
        }"/>

        <EssentialLink key="Integradores" v-bind="{
          title: 'Integradores',
          caption: '',
          icon: 'mdi-account-supervisor-circle',
          routeName: 'admin-integrador'
        }"/>

        <EssentialLink key="Celebrações" v-bind="{
          title: 'Celebrações',
          caption: '',
          icon: 'mdi-church',
          routeName: 'celebracao-list'
        }"/>
        <EssentialLink key="Visitantes" v-bind="{
          title: 'Visitantes',
          caption: '',
          icon: 'mdi-account-group',
          routeName: 'visitante-list'
        }"/>
        <EssentialLink key="Em andamento" v-bind="{
          title: 'Em andamento',
          caption: '',
          icon: 'mdi-feature-search',
          routeName: 'acompanhamento-list'
        }"/>


      </q-list>

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'
import useAuthUser from 'src/composables/UseAuthUser'


const linksList = [
{
    title: 'Painel',
    caption: '',
    icon: 'mdi-home',
    routeName: 'admin-dash'
  },
  {
    title: 'Integradores',
    caption: '',
    icon: 'mdi-account-supervisor-circle',
    routeName: 'admin-integrador'
  },
  {
    title: 'Celebrações',
    caption: '',
    icon: 'mdi-church',
    routeName: 'celebracao-list'
  },
  {
    title: 'Visitantes',
    caption: '',
    icon: 'mdi-account-group',
    routeName: 'visitante-list'
  },
  {
    title: 'Em andamento',
    caption: '',
    icon: 'mdi-feature-search',
    routeName: 'acompanhamento-list'
  },

]


const leftDrawerOpen = ref(false)
const $q = useQuasar()
const router = useRouter()
const { user, logout } = useAuthUser()

const handleLogout = async () => {
  $q.dialog({
    title: 'Desconectar',
    message: 'Você deseja sair?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await logout()
    router.replace({name: 'admin-login'})
  })
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
