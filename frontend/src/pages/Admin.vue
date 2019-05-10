<template>
  <q-page class="q-pa-md row justify-center items-center q-col-gutter-md" v-if="pendingAuth">
    <div class="col-xs-12 col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h6">Protegido por senha</div>
        </q-card-section>
        <q-card-section>
          <q-input
          v-model="password"
          label="Senha de administrador"
          hint="Digite a senha de administrador e aperte ENTER"
          @keyup.enter="tryAccess"
          :error-message="error"
          :error="Boolean(error)"
          ></q-input>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
  <q-page class="q-pa-md row items-start q-col-gutter-md" v-else-if="error === ''">
    <div class="col-xs-12 col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h6">Salas abertas</div>
        </q-card-section>
        <q-card-section>
          <q-list bordered separator>
            <q-item v-for="room in rooms" :key="room.addr" clickable v-ripple :to="room.addr" target="_blank">
              <q-item-section>
                <q-item-label>{{ room.addr }}</q-item-label>
                <q-item-label caption>
                  {{ room.userCount || 0 }} usuário(s) ativos
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-xs-12 col-md-6">
      <q-card>
        <q-card-section>
          <div class="text-h6">Usuários ativos</div>
        </q-card-section>
        <q-card-section>
          <q-list bordered separator>
            <q-item v-for="user in usersInRoom" :key="user.socketId" v-ripple>
              <q-item-section>
                <q-item-label>{{ user.user.username }}</q-item-label>
                <q-item-label caption>

                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Admin',
  data: () => ({
    error: '',
    password: '',
    pendingAuth: true,
    rooms: {},
    users: {}
  }),
  computed: {
    usersInRoom () {
      let validUsers = [];
      let users = this.users;

      for (let socketId in this.users) {
        if (users[socketId].user && (users[socketId].user.username || false)) {
          validUsers.push(Object.assign(users[socketId], { socketId: socketId }));
        }
      }
      return validUsers;
    }
  },
  created () {
    // Mostra carregamento (em x segundos: vide quasar.conf)
    this.$q.loading.show();

    // Título da janela
    this.$store.commit('setTitle', 'Administração');

    // Início
    this.socketId = this.$socket.io.engine.id;
    this.$socket.emit('authorize', { token: this.$store.state.token });
  },
  sockets: {
    'authorized': function (payload) {
      this.$store.commit('setToken', payload.token);
      this.$store.dispatch('setUserData', { uuid: payload.uuid });
      this.$q.loading.hide();
    },
    'admin-authorized': function (payload) {
      this.$socket.emit('admin-list-rooms');
      this.$socket.emit('admin-list-users');
      this.pendingAuth = false;
      this.error = '';
    },
    'admin-unauthorized': function (payload) {
      this.error = 'Sem autorização';
    },
    'admin-rooms': function (payload) {
      this.rooms = payload;
      setTimeout(() => { this.$socket.emit('admin-list-rooms'); }, 2000);
    },
    'admin-users': function (payload) {
      this.users = payload;
      setTimeout(() => { this.$socket.emit('admin-list-users'); }, 2000);
    }
  },
  methods: {
    tryAccess () {
      this.$socket.emit('admin-authorize', this.password);
    }
  }
};
</script>
<style>
</style>
