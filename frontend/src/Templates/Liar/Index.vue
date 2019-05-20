<template>
  <div class="row full-height items-center justify-center">
    <div class="col-sm-12 text-center">
      <div v-if="session.currentQuestion">
        <div class="question">{{session.currentQuestion.title}}</div>
        <div class="action">{{session.currentQuestion.action}}</div>
      </div>
      <div>
        Aguarde...
      </div>
      <q-btn
        color= "primary"
        @click= "doTest"
        label= "Fazer"
      ></q-btn>
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
  props: ['user', 'room', 'users', 'session', 'sessionEmit'],
  methods: {
    doTest () {
      this.sessionEmit('test', {
        extraParameter: 'hehehe'
      });
    }
  },
  sockets: {
    session (payload) {
      console.error(payload);
    }
  }
};
</script>

<style>

</style>
