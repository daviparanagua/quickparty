<template>
  <div class="row full-height items-center justify-center">
    <div class="col-sm-12 text-center">
      Nada feito
      <q-btn
        v-if="user.isAdmin"
        color= "primary"
        @click= "$emit('stop')"
        label= "Reiniciar"
      ></q-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user', 'room', 'users'],
  sockets: {
  }
};
</script>

<style>

</style>
