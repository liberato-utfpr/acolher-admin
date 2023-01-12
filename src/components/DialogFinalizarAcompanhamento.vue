<template>
<q-dialog v-model="props.visible">
  <q-card style="width: 500px; max-width: 80vw;">

    <q-card-section>
      <div class="text-h6">Acompanhamento</div>
    </q-card-section>

    <q-card-section>
        <div>Parecer do coordenador</div>
        <q-input
          v-model="parecerCoordenador"
          filled
          type="textarea"
          :rules="[val => (val && val!== '') || 'O parecer é obrigatório']"
          lazy-rules
        />
    </q-card-section>



    <q-card-section>
      <q-select
        outlined
        v-model="conclusao"
        :options="listaConclusao"
        label="Conclusão"
        option-label="status"
        :rules="[val => (val && val!== '') || 'Conclusão é obrigatória']"
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
    </q-card-section>



    <q-card-section v-if="conclusao.status === 'Encaminhado para um ministério' ">
      <span>Selecione o contato para quem o visitante foi encaminhado.</span>
      <q-select
        class="q-pb-sm"
        dense
        outlined
        v-model="ministerio"
        :options="listaMinisterios"
        option-label="nome"
        :rules="[val => (val && val!== '') || 'Minstério é obrigatório']"
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

      <div class="row items-start justify-end q-gutter-x-sm">
        <span class="text-caption">{{ ministerio?.lider }} {{ ministerio && formatCelular(ministerio.contato) }}</span>
        <q-btn
            v-if="conclusao.status === 'Encaminhado para um ministério'"
            dense
            label="Mensagem para o líder"
            icon="mdi-whatsapp"
            color="green-7"
            size="sm"
            @click="handleWhatsLider"
          />
      </div>
    </q-card-section>



    <q-card-actions>
      <q-btn flat label="Cancelar" color="primary" @click="handleCancelarAcompanhamento" />
      <q-btn label="Finalizar" color="primary" @click="handleFinalizarAcompanhamento" />

    </q-card-actions>

  </q-card>
</q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar'
import { openURL } from 'quasar';
import { formatCelular } from 'src/utils/format'
import ministerioService from 'src/services/ministerioService';
import useNotify from 'src/composables/UseNotify';

const props = defineProps(['visible', 'acompanhamento'])
const emit = defineEmits(['closeDialog', 'finalizarClick'])

const { listMinisterios } = ministerioService()
const { notifyError, notifySuccess } = useNotify()
const $q = useQuasar()

const parecerCoordenador = ref('')
const conclusao = ref('')
const listaConclusao = ref([]) // lista de conclusao para o q-select
const ministerio = ref('')
const listaMinisterios = ref([]) // lista de ministerios para o q-select

/* AÇÃO DOS BOTÕES -----------------------------------------------------*/

const handleCancelarAcompanhamento = () => {
  conclusao.value = ''
  ministerio.value = ''
  parecerCoordenador.value = ''

  emit('closeDialog')
}

const salvar = async () => {
  try {

    const acompanhamento = {
      ...props.acompanhamento,
      data_fim: new Date().toLocaleDateString('en-CA'),
      parecer_coordenador: parecerCoordenador.value,
      conclusao_acompanhamento: conclusao.value.status,
      ministerio_id: ministerio.value.id
    }



    conclusao.value = ''
    emit('finalizarClick', acompanhamento)
    emit('closeDialog')

  } catch (error) {

  }
}

const handleFinalizarAcompanhamento = async (acompanhamento) => {

  const visitante = props.acompanhamento.visitante
  $q.dialog({
    title: 'Confirmação',
    message: `Você realmente deseja finalizar o acompanhamento ${visitante.sexo === 'M' ? 'do':'da'} visitante ${visitante.nome}?`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'CONFIRMAR',
      color: 'positive'
    },
    cancel: {
      label: 'Cancelar',
      flat: true,
    }
  }).onOk(() => {
    salvar(acompanhamento)
  })


}

/*----------------------------------------------------------------------*/

const handleWhatsLider = () => {
  const integrador = props.acompanhamento.integrador
  const visitante = props.acompanhamento.visitante

  // const mensagem = `Olá, ${integrador.nome}! O visitante ${visitante.nome} foi encaminhado para o ministério ${ministerio.value.nome}.`

  let mensagem = `
Paz ${integrador.nome}, tudo bem?\n
Recebemos e acompanhamos ${integrador.sexo === 'M' ? 'o':'a'} visitante ${visitante.nome} e estamos encaminhado ${integrador.sexo === 'M' ? 'ele':'ela'} para o seu ministério integra-${integrador.sexo === 'M' ? 'lo':'la'} nas atividades da igreja. Seguem os dados ${integrador.sexo === 'M' ? 'do':'da'} visitante e os pareceres realizados durante o acompanhamento:\n
*Integrador:* ${props.acompanhamento.parecer_integrador}
*Coordenador:* ${parecerCoordenador.value}\n
*VISITANTE*
${integrador.sexo === 'M' ? '👨':'👩'} ${visitante.nome}
${visitante.celular}
`


  // enviaWhatsLider(integrador.nome, integrador.celular, mensagem)
  enviaWhatsLider(integrador.nome, '44988257617', mensagem)
}

const enviaWhatsLider = (nome, celular, mensagem) => {

  const link = encodeURI(`https://api.whatsapp.com/send?phone=55${celular}&text=${mensagem}`)
  openURL(link)
}




const carregaListaConclusao = async () => {
  listaConclusao.value = [
    {id:1, status:'Não respondeu'},
    {id:2, status:'Continuará frequentando'},
    {id:3, status:'Não pretende se tornar membro'},
    {id:4, status:'Encaminhado para um ministério'},
  ]
}

const carregaListaMinisterios = async () => {
  try {
    listaMinisterios.value = await listMinisterios()
  } catch (error) {
    console.log(error.message)
  }
}



onMounted(() => {
  carregaListaConclusao()
  carregaListaMinisterios()
})


</script>
