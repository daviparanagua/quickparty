<template>
  <q-page class="row" v-if="state == 'active'">

  </q-page>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'Chat',
  data: () => ({

  }),
  computed: {
    username: {
      get: function () { return this.$store.state.user.username; }
    }
  },
  components: {
  },
  created () {
    // Mostra carregamento (em x segundos: vide quasar.conf)
    this.$q.loading.show();

    // Título da janela
    this.$store.commit('setTitle', 'Administração');

    // Conectar socket
    this.socket = io('http://localhost:3000');
    let socket = this.socket;

    // Tudo ok?
    socket.on('connect', () => {
      this.socketId = socket.io.engine.id;
      socket.emit('authorize', { token: this.$store.state.token });
    });

    socket.on('authorized', (payload) => {
      this.$store.commit('setToken', payload.token);
      this.$store.dispatch('setUserData', { uuid: payload.uuid });
      this.loading = false;
      this.$q.loading.hide();
    });
  },
  methods: {

  },
  beforeRouteUpdate (to, from, next) {
    this.socket.disconnect();
    next();
  },
  beforeRouteLeave (to, from, next) {
    this.socket.disconnect();
    // next();
  }
};
</script>
<style>
</style>
