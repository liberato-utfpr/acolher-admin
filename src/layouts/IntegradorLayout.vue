<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <img src="../assets/acolher-branco.svg" alt="logo" id="logo" style="height:54px;"/>
        <q-toolbar-title>
          Integrador
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

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list class="text-secondary" >
        <q-item-label header>
          Menu
        </q-item-label>

        <!-- <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" /> -->
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
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
    title: 'Home',
    caption: '',
    icon: 'mdi-home',
    routeName: 'home'
  },
  {
    title: 'Categoria',
    caption: '',
    icon: 'mdi-shape-outline',
    routeName: 'category'
  },
  {
    title: 'Produto',
    caption: '',
    icon: 'mdi-archive',
    routeName: 'product'
  },
  {
    title: 'Config',
    caption: '',
    icon: 'mdi-cog',
    routeName: 'form-config'
  }

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
    router.replace({name: '/'})
  })
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
