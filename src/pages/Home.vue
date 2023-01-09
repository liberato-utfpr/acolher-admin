<template>
  <q-page padding>
    <h4>
      Home
    </h4>
    <p>
      {{ user?.id }}

    </p>
    <p>
      {{ user?.user_metadata.nome }} {{ user?.user_metadata.sobrenome }}
    </p>
    <p>
      {{ user?.user_metadata.celular }}
    </p>
    <p>
      {{ user?.user_metadata.nascimento }}
    </p>
    <p>
      {{ user?.user_metadata }}

    </p>
  </q-page >

</template>

<script setup>
import useAuthUser from 'src/composables/UseAuthUser'

const { user } = useAuthUser()

</script>
