
const formatDate = (date) => {
  const vetor = date.split('-')
  const formattedDate = `${vetor[2]}/${vetor[1]}/${vetor[0]}`
  return formattedDate
}

const formatCelular = (str) => {
  let match = str.match(/^(\d{2})(\d{5})(\d{4})$/);

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  };

  return null
}

const getDiaSemana = (str) => {
  const diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const vetor = str.split('-')
  const data = new Date(vetor[0], vetor[1] - 1, vetor[2])
  return diaSemana[data.getDay()]
}

const somaData = (strData, dias) => {
  const vetor = strData.split('-')
  const data = new Date(vetor[0], vetor[1] - 1, vetor[2])
  data.setDate(data.getDate() + dias)
  return data.toLocaleDateString()
}

const foraDoPrazo = (dataInicio) => {
  const vetor = dataInicio.split('-')
  const dataFim = new Date(vetor[0], vetor[1] - 1, vetor[2])
  dataFim.setDate(dataFim.getDate() + 15)
  const dataAtual = new Date()

  return dataAtual > dataFim
}

export {
  formatDate,
  formatCelular,
  getDiaSemana,
  somaData,
  foraDoPrazo,
}
