
import useApi from 'src/composables/UseApi'
import useAuthUser from 'src/composables/UseAuthUser'

export default function integradorService () {
  const table = 'integrador'

  const { getBy, list, listFilter, post, update, remove, supabase } = useApi(table)
  const { register } = useAuthUser()

  const postAprovado = async (integrador) => {

    try {
      const data = await register(integrador)
      integrador.user_id = data.user.id
      const integradorCadastrado = await post(integrador)

      return integradorCadastrado
    } catch (error){
      throw error
    }
  }

  const aprovar = async (integrador) => {
    try {
      const data = await register(integrador)
      integrador.user_id = data.user.id
      integrador.status = 'aprovado'
      const integradorAtualizado = await update(integrador, 'email')
      return integradorAtualizado

    } catch (error){
      throw error
    }
  }

  const desabilitar = async (integrador) => {
    try {

      integrador.status = 'desabilitado'
      const data = await update(integrador, 'email')
      return data

    } catch (error){
      throw error
    }
  }

  const listIntegradoresAprovados = async () => {
    const { data, error } = await supabase
      .from(table)
      .select()
      .eq('status', 'aprovado')
      .order('nome', { ascending: true })

    if (error) {
      throw error
    }

    return data
  }

  const integradorMessages = {
    23505: 'Já existe um integrador cadastrado com esse email',

  }


  return {
    getBy,
    list,
    listFilter,
    update,
    remove,
    post,
    postAprovado,
    aprovar,
    desabilitar,
    integradorMessages,
    listIntegradoresAprovados,
  }
}
