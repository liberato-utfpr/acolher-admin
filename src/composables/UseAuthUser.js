import { ref } from 'vue'
import useSupabase from 'boot/supabase'

import useApi from './UseApi'

// o usuário é definido fora da função useAuthUser para que atue como um estado global
// e sempre se refira a um único usuário
const user = ref(null)

export default function useAuthUser () {

  const { supabase } = useSupabase()


  /**
   * Login with email and password
   */
  const login = async ({ email, password }) => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return user
  }

  const loginIntegrador = async ({ email, password }) => {
    const { getBy } = useApi('integrador')
    const integrador = await getBy('email', email)

    // Não está cadastrado como integrador
    if (!integrador) {
      throw {
        status: 900,
        message: 'Este email não está cadastrado como integrador. Entre em contato com o coordenador do ministério.'
      }
    }

    // É integrador mas não está aprovado
    if (integrador && integrador.status === 'pendente') {

      throw {
        status: 901,
        message: 'Seu cadastro ainda não foi aprovado. Entre em contato com o coordenador do ministério.'
      }
    }

    // É integrador mas está inativo
    if (integrador && integrador.status === 'desabilitado') {
      const { error } = await supabase.auth.signOut()
      throw {
        status: 902,
        message: 'Seu cadastro foi DESABILITADO. Entre em contato com o coordenador do ministério.'
      }
    }

    const { user, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw error
    return user
  }

  const loginAdmin = async ({ email, password }) => {
    const { getBy } = useApi('administrador')
    const admin = await getBy('email', email)

    // Não está cadastrado como administrador
    if (!admin) {
      throw {
        status: 800,
        message: 'Este email não está cadastrado como Administrador.'
      }
    }

    const { user, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw error
    return user
  }



  /**
   * Logout
   */
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Check if the user is logged in or not
   */
  const isLoggedIn = () => {
    return !!user.value
  }

  const isIntegrador = async () => {
    const { getBy } = useApi('integrador')

    if ( isLoggedIn() ) {
      const integrador = getBy('user_id', user.value.id)
      return !!integrador
    }

    return !!user.value
  }

  /**
   * Register
   */
  const register = async ({ email, password, ...meta }) => {
    // const { post } = useApi('integradores')
    const { data, error } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          // arbitrary meta data is passed as the second argument under a data key to the Supabase signUp method
          data: meta,
        }
      }
    )

    if (error) throw error
    return data
  }

  const registerIntegrador = async ({userId, name}) => {

  }

  /**
   * Update user email, password, or meta data
   */
  const update = async (data) => {
    const { user, error } = await supabase.auth.update(data)
    if (error) throw error
    return user
  }


  const errorMessages = {
    400: 'Erro ao autenticar! Verifique suas credenciais.',
    800: 'Este email não está cadastrado como Administrador.',
    900: 'Este email não está cadastrado como integrador. Entre em contato com o coordenador do ministério.',
    901: 'Seu cadastro ainda não foi aprovado. Entre em contato com o coordenador do ministério.',
    902: 'Seu cadastro foi DESABILITADO. Entre em contato com o coordenador do ministério.',
  }


  return {
    user,
    login,
    loginIntegrador,
    loginAdmin,
    isLoggedIn,
    isIntegrador,
    logout,
    register,
    update,
    errorMessages,

  }
}
