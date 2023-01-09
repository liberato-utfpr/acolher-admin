
import useSupabase from "src/boot/supabase"


export default function useApi (table) {
  const  { supabase } = useSupabase()

  const getBy = async (atributo, valor) => {
    const { data, error } = await supabase.from(table).select('*').eq(atributo, valor);

    if (data.length === 0) throw new Error('Nenhum registro encontrado')
    if (error) throw error

    return data[0]
    // O selec traz um array como resultado. Como estamos buscando por um id único, retornamos a primeira posição desse array
  };

  const list = async (atributoFiltro1='', valorFiltro1='') => {
    const { data, error } = await supabase
      .from(table)
      .select()
      .eq(atributoFiltro1, valorFiltro1)


    if (error) throw error
    return data
  }

  const listFilter = async (coluna, operador, valor, colunaOrdem='id') => {
    const { data, error } = await supabase
      .from(table)
      .select()
      .filter(coluna, operador, valor)
      .order(colunaOrdem)
      if (error) throw error
      return data

  };


  const post = async (form) => {
    const { data, error } = await supabase
      .from(table)
      .insert({ ...form })
      .select()

    if (error) throw error
    return data
  };


  const update = async (form, atributoId) => {
    const { data, error } = await supabase
      .from(table)
      .update({...form})
      .eq(atributoId, form[atributoId])

      if (error) throw error
    return data
  };

  const remove = async (form, atributoId) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq(atributoId, form[atributoId])

    if (error) throw error
    return data
  };

  return {
    supabase,
    getBy,
    list,
    listFilter,
    post,
    update,
    remove
  }

}
