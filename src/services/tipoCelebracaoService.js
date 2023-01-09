
import useApi from 'src/composables/UseApi'

export default function celebracaoService () {
  const table = 'tipo_celebracao'

  const { getBy, listFilter, post, update, remove, supabase } = useApi(table)

  const list = async () => {
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
    update,
    remove,
    post,

  }
}
