import useAuthUser from 'src/composables/UseAuthUser'

const routes = [

  {
    // PUBLIC
    path: '/',
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
    path: '/',
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
      { path: 'acompanhamento', name:'acompanhamento-list', component: () => import('src/pages/admin/Acompanhamento/List.vue') },

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
