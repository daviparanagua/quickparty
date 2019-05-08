<template>
  <div class="row full-height items-center justify-center">
    <div class="col-sm-12 text-center">
      Aguardando todos entrarem...
      <div>
        <q-btn color="primary" v-if="user.isAdmin" @click="start">
            Começar!
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user'],
  methods: {
    start () {
      this.$socket.emit('start', {});
    }
  }
};
</script>

<style>

</style>
