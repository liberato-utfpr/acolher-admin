
import useApi from 'src/composables/UseApi'

export default function celebracaoService () {
  const table = 'mensagem_padrao'

  const { getBy, list, listFilter, post, update, remove, supabase } = useApi(table)

  const listMensagens = async () => {
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
    listMensagens,
  }
}
