
import useApi from 'src/composables/UseApi'

export default function acompanhamentoService () {
  const table = 'acompanhamento'

  const { getBy, list, listFilter, post, update, remove, supabase } = useApi(table)

  const listAcompanhamentoComVisitante = async () => {

    const { data, error } = await supabase
      .from('acompanhamento')
      .select(`
        data_inicio, data_fim, parecer_integrador,
        integrador(email, nome, celular),
        visitante(id, nome, sexo, celular)
      `)
      .order('data_inicio')


    if (error) throw error
    return data
  }

  const listAcompanhamentoAbertos = async () => {

    const { data, error } = await supabase
      .from('acompanhamento')
      .select(`
        data_inicio, data_fim, parecer_integrador,
        integrador(email, nome, celular),
        visitante(id, nome, sexo, celular)
      `)
      .is('conclusao_acompanhamento', null)
      .not('data_inicio', 'is', null)
      .order('data_inicio')

      // .filter(coluna, operador, valor)

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

    listAcompanhamentoAbertos
  }
}
