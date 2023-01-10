
import useApi from 'src/composables/UseApi'

export default function acompanhamentoService () {
  const table = 'acompanhamento'

  const { getBy, list, listFilter, post, update, remove, supabase } = useApi(table)

  const listAcompanhamentoComVisitante = async () => {

    const { data, error } = await supabase
      .from('acompanhamento')
      .select(`
        data_inicio, data_fim, parecer_integrador,
        integrador(nome, celular),
        visitante(nome, sexo, celular)
      `)
      .order('data_inicio')


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
    listAcompanhamentoComVisitante,
  }
}
