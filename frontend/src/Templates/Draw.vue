<template>
  <div class="row full-height items-center justify-center">
    <div class="col-sm-12 text-center">
      O escolhido foi
      <h5>{{chosenOne}}</h5>
      <div>
        Participaram: {{ session.activeUsers.map((item) => item.user.username).join(', ') }}
      </div>
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
  props: ['user', 'room', 'users', 'session'],
  computed: {
    chosenOne () {
      return this.session.chosenUser.user.username;
    }
  },
  sockets: {
    template (payload) {
      console.error(payload);
    }
  }
};
</script>

<style>

</style>
