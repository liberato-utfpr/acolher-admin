
import useApi from 'src/composables/UseApi'

export default function visitanteService () {
  const table = 'visitante'

  const { getBy, list, listFilter, post, update, remove, supabase } = useApi(table)

  const saveAllVisitantes = async (visitantes) => {
    const { error } = await supabase
      .from(table)
      .insert(visitantes)

    if (error) throw error
  }

  const listVisitantesFromCelebracao = async (idCelebracao) => {

    const { data, error } = await supabase
      .from('visitante')
      .select()
      .eq('celebracao_id', idCelebracao)
      .order('nome')


    if (error) throw error
    return data
  }
  const listVisitantesComCelebracao = async () => {

    const { data, error } = await supabase
      .from('visitante')
      .select(`
        id, nome, celular, sexo, status, idade,
        celebracao(id, data)
      `)
      .order('nome')


    if (error) throw error
    return data
  }

  const removeVisitante = async (id) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error
    return data
  };

  const removeVisitantesFromCelebracao = async (idCelebracao) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('celebracao_id', idCelebracao)

    if (error) throw error
    return data
  }

  return {
    getBy,
    list,
    listFilter,
    update,
    remove,
    post,
    saveAllVisitantes,
    listVisitantesFromCelebracao,
    listVisitantesComCelebracao,
    removeVisitante,
    removeVisitantesFromCelebracao,
  }
}
