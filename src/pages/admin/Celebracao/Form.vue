<template>
  <q-page padding>

    <div class="col-12">
      <p class="text-h5 text-weight-bold">
        Celebração
      </p>
    </div>

    <div class="row flex align-center justify-center">

      <q-form
        class="col-md-10 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-12 col-md-3"
            format="YYYY-MM-DD"
            outlined
            label="Data*"
            v-model="form.data"
            :rules="[val => (val && val.length > 0) || 'A data é obrigatória']"
            lazy-rules
            stack-label
            type="date"
          />

          <q-select
            class="col-12 col-md-7"
            outlined
            v-model="form.tipo_celebracao"
            :options="opcoesCelebracao"
            label="Tipo"
            use-input
            option-value="id"
            option-label="nome"

            @filter="filterCelebracao"
            :rules="[val => (val && val!== '') || 'O tipo é obrigatório']"
            lazy-rules
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sem resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            class="col-12 col-md-7"
            outlined
            label="Visitante"
            placeholder="Nome do visitante, Celular, Sexo, Idade, Pedido de Oração"
            v-model="visitanteInput"
            hint="Ex: João da Silva, 4491234555, M, 35, Saúde"
            @keydown.enter.prevent="adicionarVisitante"
          />

          <div class="col-12 col-md-3">
            <q-btn
              class="full-width q-py-md"
              label="Adicionar"
              color="primary"
              size="md"
              icon="mdi-plus"
              @click="adicionarVisitante"
            />
          </div>



          <!-- LISTA VISITANTES INSERIDOS ---------------------------------------------->
          <div v-if="visitantes.length > 0" class="col-12 col-md-10 q-mt-lg">
            <p class="text-h6 text-center">
              Visitantes
            </p>
            <q-list  bordered separator class="q-mt-md">
              <q-item
                v-for="(visitante, index) in visitantesReversed"
                :key="index"
                :class="visitante.sexo === 'M' ? 'bg-blue-grey-1' : 'bg-red-1'"
              >
                <q-item-section avatar>
                  <q-avatar
                    size="md"
                    :class="visitante.sexo === 'M' ? 'bg-blue-10 text-white' : 'bg-red-9 text-white'"
                    text-color="white"
                  >
                    {{ visitante.nome.charAt(0) }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ visitante.nome }} {{ `(${visitante.idade})` }}</q-item-label>
                  <q-item-label caption>{{ formatCelular(visitante.celular) }}</q-item-label>
                  <q-item-label caption> Oração:{{ visitante.oracao }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    icon="mdi-close"
                    color="negative"
                    dense
                    size="sm"
                    @click="removerVisitante(index)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-10">
            <q-btn
            class="full-width q-mt-lg"
            :label="idUpdate ? 'Atualizar' : 'Salvar'"
            color="primary"
            type="submit"
            size="lg"
            />

            <q-btn
            class="full-width q-mt-md"
            label="Cancelar"
            color="primary"
            outline
            size="lg"
            :to="{name: 'celebracao-list'}"
            />
          </div>
        </div>
      </q-form>


    </div>


  </q-page>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import useNotify from 'src/composables/UseNotify';
import tipoCelebracaoService from 'src/services/tipoCelebracaoService';
import celebracaoService from 'src/services/celebracaoService';
import visitanteService from 'src/services/visitanteService';

import { formatCelular } from 'src/utils/format'

const form = ref({
  data: '',
  tipo_celebracao: '',
})

const visitanteInput = ref('')
const visitantes = ref([])
const opcoesCelebracao = ref([])
let listaTipoCelebracao = [] // variável temporária para armazenar os tipos de celebração

const router = useRouter()
const route = useRoute()
const { list:listTipoCelebracao } = tipoCelebracaoService()
const { post:salvarCelebracao } = celebracaoService()
const { saveAllVisitantes } = visitanteService()

const { notifyError, notifySuccess } = useNotify()


const idUpdate = computed(() => route.params.id)
const visitantesReversed = computed(() => visitantes.value.slice().reverse())


const handleSubmit = async () => {
  try {
    if (idUpdate.value) {

    } else {

      // Cria o objeto celebracao
      const celebracao = {
        data: form.value.data,
        tipo_celebracao_id: form.value.tipo_celebracao.id,
      }

      const data = await salvarCelebracao(celebracao)
      const idCelebracao = data[0].id // obtem o id da celebracao criada

      // adiciona o id na lista de visitantes adicionados
      const listaVisitantes = visitantes.value.map(visitante => {
        visitante.celebracao_id = idCelebracao
        return visitante
      })

      // CRIA VISITANTES
      saveAllVisitantes(listaVisitantes)


      notifySuccess("Cadastro realizado com sucesso")
    }
    router.push({name: 'celebracao-list'})
  } catch (error) {
    console.log(error.message)
    notifyError("Erro na gravação da celebração")
  }
}

// Adiciona o visitante no painel de visitantes
const adicionarVisitante = () => {
  let visitante = visitanteInput.value.split(',')
  if (visitante.length < 4) {
    notifyError('Preencha todos os campos do visitante')
    return
  }

  // Tira os espaços em branco de cada item
  visitante = visitante.map(i => i.trim())

  // CELULAR
  // Remover todos os caracteres que não são números
  visitante[1] = visitante[1].replace(/[^0-9]/g, '')
  if (visitante[1].length < 11) {
    notifyError('Celular precisar ter 11 dígitos (XX) XXXXX-XXXX)')
    return
  }
  if (isNaN(visitante[1])) {
    notifyError('Celular precisar conter apenas números')
    return
  }

  // SEXO
  if (visitante[2].toUpperCase() !== 'M' && visitante[2].toUpperCase() !== 'F') {
    notifyError('Sexo inválido')
    return
  }

  // IDADE
  if (isNaN(visitante[3])) {
    notifyError('Idade precisa ser um número')
    return
  }

  // Montando o objeto visitante
  visitantes.value.push({
    nome: visitante[0].trim(),
    celular: visitante[1],
    sexo: visitante[2].trim().toUpperCase(),
    idade: visitante[3].trim(),
    celebracao_id:'',
    oracao: visitante[4].trim()
  })
  visitanteInput.value = ''

}

const removerVisitante = (index) => {
  visitantes.value.splice(index, 1)
}

const carregaListaTipoCelebracao = async () => {
  opcoesCelebracao.value = await listTipoCelebracao()
  listaTipoCelebracao = [...opcoesCelebracao.value]

}

// Filtra a lista de tipo de celebração do q-select
const filterCelebracao = (val, update) => {
  if (val === '') {
    update(() => {
      opcoesCelebracao.value = listaTipoCelebracao
    })

    return
  }
  update(() => {
    opcoesCelebracao.value = opcoesCelebracao.value.filter(i => i.nome.toLowerCase().includes(val.toLowerCase()))
  })
}


onMounted(() => {
  const today = new Date()
  // let data = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  // form.value.data = data
  // padrão YYYY-MM-DD
  form.value.data = today.toLocaleDateString('en-CA')

  carregaListaTipoCelebracao()
})

</script>
