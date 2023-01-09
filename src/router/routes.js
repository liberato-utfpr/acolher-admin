import useAuthUser from 'src/composables/UseAuthUser'

const routes = [
  {
    //PUBLIC
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', name: '/', component: () => import('src/pages/Login.vue') },
      { path: 'registro', name: 'registro', component: () => import('src/pages/Registro.vue') },
      { path: 'registro-confirmacao', name: 'registro-confirmacao', component: () => import('src/pages/Registro-confirmacao.vue') },
    ],
    beforeEnter: (to, from) => {
      const { isLoggedIn } = useAuthUser()
      if (isLoggedIn()) {
        return { name: 'home' }
      }
    }
  },
  {
    // AUTENTICADO
    path: '/',
    component: () => import('layouts/IntegradorLayout.vue'),
    children: [
      { path: 'home', name: 'home', component: () => import('src/pages/Home.vue') },
    ],
    beforeEnter: (to, from) => {
      const { isLoggedIn } = useAuthUser()
      if (!isLoggedIn()) {
        return { name: '/' }
      }

      // const { isIntegrador } = useAuthUser()
      // if (!isIntegrador()) {
      //   return { name: '/' }
      // }
    }
  },
  {
    // PUBLIC
    path: '/admin',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', name:'admin-login', component: () => import('pages/admin/LoginAdmin.vue') },
    ],
    beforeEnter: (to, from) => {
      const { isLoggedIn } = useAuthUser()
      if (isLoggedIn()) {
        return { name: 'admin-dash' }
      }
    }
  },
  {
    // AUTENTICADO
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: 'cadastro', name:'admin-form', component: () => import('pages/admin/FormAdmin.vue') },
      { path: 'dashboard', name:'admin-dash', component: () => import('pages/admin/Dashboard.vue') },
      { path: 'integrador', name:'admin-integrador', component: () => import('src/pages/admin/Integrador/List.vue') },
      { path: 'integrador-form/:email?', name:'integrador-form', component: () => import('src/pages/admin/Integrador/Form.vue') },
      { path: 'celebracao', name:'celebracao-list', component: () => import('src/pages/admin/Celebracao/List.vue') },
      { path: 'celebracao-form/:id?', name:'celebracao-form', component: () => import('src/pages/admin/Celebracao/Form.vue') },
      { path: 'celebracao-update/:id?', name:'celebracao-update', component: () => import('src/pages/admin/Celebracao/Update.vue') },
      { path: 'visitante', name:'visitante-list', component: () => import('src/pages/admin/Visitante/List.vue') },

    ],
    beforeEnter: (to, from) => {
      const { isLoggedIn, user } = useAuthUser()

      if (user.value.user_metadata.user_type !== 'admin'){
        return { name: '/' }
      }

      if (!isLoggedIn()) {
        return { name: 'admin-login' }
      }

    }
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
