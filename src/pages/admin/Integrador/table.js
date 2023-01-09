
import { ref } from 'vue'
import { formatCelular, formatDate } from 'src/utils/format'



const columnsIntegradores = [

  { name: 'nome', align: 'left', label: 'Nome', field: 'nome', sortable: true },
  { name: 'acoes', align: 'center', label: 'Ações', field: 'acoes', sortable: true },
  { name: 'email', align: 'left', label: 'E-mail', field: 'email', sortable: true },
  { name: 'celular', align: 'left', label: 'Celular', field: 'celular', format: (val) => formatCelular(val), sortable: true },
  { name: 'nascimento', align: 'left', label: 'Nascimento', field: 'nascimento', format: (val) => formatDate(val), sortable: true },
  { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 10
})

export {
  columnsIntegradores,
  initialPagination,
}
