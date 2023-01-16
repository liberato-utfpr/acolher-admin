<template>
<q-page padding>
  <div class="col-12">
    <p class="text-h5 text-weight-bold">
      Configurações
    </p>
  </div>
  <div class="row flex q-gutter-md q-mb-md justify-start wrap">
    <q-btn
        color="primary"
        :to="{name: 'mensagem-list'}"
      >
        <q-icon left size="3em" name="mdi-message-reply-text" />
        <div>Mensagens</div>
      </q-btn>
  </div>

</q-page>
</template>
