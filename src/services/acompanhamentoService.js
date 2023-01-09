
import useApi from 'src/composables/UseApi'

export default function acompanhamentoService () {
  const table = 'acompanhamento'

  const { getBy, list, listFilter, post, update, remove, supabase } = useApi(table)


  return {
    getBy,
    list,
    listFilter,
    post,
    update,
    remove,

  }
}
