
import useApi from 'src/composables/UseApi'

export default function acompanhamentoService () {
  const table = 'ministerio'

  const { getBy, list, listFilter, post, update, remove, supabase } = useApi(table)

  const listMinisterios = async () => {
    const { data, error } = await supabase
      .from(table)
      .select()
      .order('nome')

    if (error) throw error
    return data
  }

  return {
    getBy,
    list,
    listFilter,
    post,
    update,
    remove,
    listMinisterios
  }
}
