
import { ref } from 'vue'
import { formatCelular, formatDate } from 'src/utils/format'



const columnsAcompanhamentos = [
  { name: 'visitante', align: 'left', label: 'Visitante', field: 'visitante', sortable: true },
  { name: 'data_inicio', align: 'left', label: 'Início', field: 'data_inicio', format: (val) => formatDate(val), sortable: true },
  { name: 'data_fim', align: 'left', label: 'Previsão fim', field: 'data_fim', sortable: true },
  { name: 'integrador', align: 'left', label: 'Integrador', field: 'integrador', sortable: true },
  { name: 'parecer', align: 'left', label: 'Parecer', field: 'parecer', sortable: true },
  { name: 'acoes', align: 'center', label: 'Ações', field: 'acoes', sortable: true },
]

const columnsVisitantes = [
  { name: 'visita', align: 'left', label: 'Visita', field: 'visita', sortable: true },
  { name: 'nome', align: 'left', label: 'Nome', field: 'nome', sortable: true },
  { name: 'celular', align: 'left', label: 'Celular', field: 'celular', format: (val) => formatCelular(val), sortable: true },
  { name: 'sexo', align: 'left', label: 'Sexo', field: 'sexo', sortable: true },
  { name: 'idade', align: 'left', label: 'Idade', field: 'idade', sortable: true },
  { name: 'integrador', align: 'left', label: 'Integrador', field: 'integrador', sortable: true },
]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 10
})

export {
  columnsAcompanhamentos,
  columnsVisitantes,
  initialPagination,
}
