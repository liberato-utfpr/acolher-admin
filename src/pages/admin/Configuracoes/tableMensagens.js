
import { ref } from 'vue'


const columnsMensagens = [
  { name: 'nome', align: 'left', label: 'Nome', field: 'nome', sortable: true },
  { name: 'mensagem', align: 'left', label: 'Mensagem', field: 'mensagem', sortable: true },
  { name: 'acoes', align: 'center', label: 'Ações', field: 'acoes', sortable: true },
]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 10
})

export {
  columnsMensagens,
  initialPagination,
}
