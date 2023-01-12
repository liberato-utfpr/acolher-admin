
import useApi from 'src/composables/UseApi'

export default function visitanteService () {
  const table = 'visitante'

  const { getBy, list, listFilter, post, update, remove, supabase } = useApi(table)

  // Para todo visitante criado existe uma trigger que cria um acompanhamento
  const saveAllVisitantes = async (listaVisitantes) => {
    const { error } = await supabase
      .from(table)
      .insert(listaVisitantes)

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
  const listVisitantesComAcompanhamento = async () => {

    const { data, error } = await supabase
      .from('acompanhamento')
      .select(`
        *,
        visitante(*)
      `)



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
    listVisitantesComAcompanhamento,
    removeVisitante,
    removeVisitantesFromCelebracao,
  }
}
