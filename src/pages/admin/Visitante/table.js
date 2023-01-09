
import { ref } from 'vue'
import { formatCelular, formatDate } from 'src/utils/format'



const columnsVisitantes = [

  { name: 'nome', align: 'left', label: 'Nome', field: 'nome', sortable: true },
  { name: 'celular', align: 'left', label: 'Celular', field: 'celular', format: (val) => formatCelular(val), sortable: true },
  { name: 'sexo', align: 'left', label: 'Sexo', field: 'sexo', sortable: true },
  { name: 'visita', align: 'left', label: 'Visita', field: 'visita', sortable: true },
  { name: 'idade', align: 'left', label: 'Idade', field: 'idade', sortable: true },
  { name: 'integrador', align: 'left', label: 'Integrador', field: 'integrador', sortable: true },
  { name: 'acoes', align: 'center', label: 'Ações', field: 'acoes', sortable: true },
]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 10
})

export {
  columnsVisitantes,
  initialPagination,
}
