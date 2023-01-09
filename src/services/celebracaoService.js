
import useApi from 'src/composables/UseApi'

export default function celebracaoService () {
  const table = 'celebracao'

  const { getBy, list, listFilter, post, update, remove, supabase } = useApi(table)

  const listCelebracoesVisitantes = async () => {
    const { data, error } = await supabase
    .from('celebracao_visitantes_com_null')
    .select()
    .order('data', { ascending: false })

    if (error) throw error
    return data
  }

  const removeCelebracao = async (id) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

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
    listCelebracoesVisitantes,
    removeCelebracao
  }
}
