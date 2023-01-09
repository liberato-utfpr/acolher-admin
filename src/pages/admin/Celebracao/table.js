
import { ref } from 'vue'
import { formatCelular } from 'src/utils/format'


const columnsCelebracoesList = [
  { name: 'data', align: 'left', label: 'Data', field: 'data', sortable: true },
  { name: 'celebracao', align: 'left', label: 'Celebração', field: 'nome_celebracao', sortable: true },
  { name: 'visitantes', align: 'center', label: 'Visitantes', field: 'visitantes', sortable: true },
  { name: 'acoes', align: 'center', label: 'Ações', field: 'acoes', sortable: true },
]

const columnsVisitantesList = [
  { name: 'nome', align: 'left', label: 'Nome', field: 'nome', sortable: true },
  { name: 'celular', align: 'left', label: 'Celular', field: 'celular', format: (val) => formatCelular(val), sortable: true },
  { name: 'sexo', align: 'left', label: 'Sexo', field: 'sexo', sortable: true },
  { name: 'idade', align: 'left', label: 'Idade', field: 'idade', sortable: true },
  { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
  { name: 'acoes', align: 'center', label: 'Ações', field: 'acoes', sortable: true },

]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 10
})

export {
  columnsCelebracoesList,
  columnsVisitantesList,
  initialPagination,
}
