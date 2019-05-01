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
  <q-page class="q-pa-md row items-start q-col-gutter-md" v-else-if="!error">
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
                  {{ room.messages.length || 0 }} mensagens
                  • {{ room.userCount || 0 }} usuário(s) ativos
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
import io from 'socket.io-client';

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
      this.$q.loading.hide();
    });

    socket.on('admin-authorized', (payload) => {
      socket.emit('admin-list-rooms');
      socket.emit('admin-list-users');
      this.pendingAuth = false;
    });

    socket.on('admin-unauthorized', (payload) => {
      this.error = 'Sem autorização';
    });

    socket.on('admin-rooms', (payload) => {
      this.rooms = payload;
      setTimeout(() => { socket.emit('admin-list-rooms'); }, 2000);
    });

    socket.on('admin-users', (payload) => {
      this.users = payload;
      setTimeout(() => { socket.emit('admin-list-users'); }, 2000);
    });
  },
  methods: {
    tryAccess () {
      this.socket.emit('admin-authorize', this.password);
    }
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
