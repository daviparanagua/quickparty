<template>
  <q-page class="row" v-if="state == 'active'">
    <div class="col-xs-12" id="full_container">
      <div id="main_view" class="q-pa-md">
        <component
          v-if="this.room"
          :is = "mainViewComponent"
          :socketId = "socketId"
          :user = "user"
          :room = "room"
          :users = "users"
          :session = "session"
          :sessionEmit = "sessionEmit"
          @stop = "stop"
        ></component>
      </div>
      <div class="q-pa-sm" id="chat_users">
        <users-list
          class= "userslist"
          :users= "users"
          @changeUsername= "changeUsername"
        ></users-list>
      </div>
    </div>
  </q-page>
  <q-page class="row items-center justify-center" v-else-if="state == 'profile'">
    <div class="col-xs-8 col-md-6" id="profiler">
      <q-input
        v-model="form.username"
        label="Nome de usuário"
        hint="Digite um nome de usuário e aperte ENTER"
        @keyup.enter="setUsername"
      ></q-input>
    </div>
  </q-page>
  <q-page class="row items-center justify-center" v-else-if="state == 'template'">
    <div class="col-xs-12" id="full_container">
      <template-chooser
      ></template-chooser>
    </div>
  </q-page>
</template>

<script>
import Lobby from 'components/Lobby';
import UsersList from 'components/UsersList';
import TemplateChooser from 'components/TemplateChooser';
import registerSocketEvents from '../helpers/SocketEvents';

export default {
  name: 'Room',
  data: () => ({
    addr: '',
    firstLoad: true,
    form: {
      username: ''
    },
    loading: true, // Chat ainda está carregando
    user: {},
    room: {},
    socketId: '', // ID do Socket
    users: [] // Todos os participantes do chat
  }),
  computed: {
    username: {
      get: function () { return this.$store.state.user.username; }
    },
    session () {
      return this.room.session;
    },
    canManage () {
      return this.user.isAdmin;
    },
    state () {
      if (!this.$store.state.user.username) return 'profile';
      else if (this.loading) return 'loading';
      else if (this.canManage && !this.room.template) return 'template';
      return 'active';
    },
    mainViewComponent () {
      if (!this.room.started) return 'Lobby';
      return this.room.template.id;
    }
  },
  components: {
    UsersList,
    Lobby,
    TemplateChooser,
    Draw: () => import('../templates/Draw'),
    Liar: () => import('../templates/Liar')
  },
  created () {
    // Mostra carregamento (em x segundos: vide quasar.conf)
    this.$q.loading.show();

    // Chat solicitado
    this.addr = `/${this.$route.params.chatAddr || ''}`;

    // Título da janela
    this.$store.commit('setTitle', this.addr);
  },
  mounted () {
    this.socketId = this.$socket.io.engine.id;
    this.$socket.emit('authorize', { token: this.$store.state.token });
  },
  sockets: {
    // Tudo ok?
    authorized (payload) {
      this.$store.commit('setToken', payload.token);
      this.$store.dispatch('setUserData', { uuid: payload.uuid });
      this.loading = false;
      this.$q.loading.hide();
      if (this.username) {
        this.joinRoom();
      }
    },
    unauthorized (payload) {
      this.$store.commit('setToken', '');
      this.$socket.emit('authorize');
    },
    room (payload) {
      console.log('updateroom');
      this.room = payload;
    },
    roomSession (payload) {
      console.log('roomsession');
      this.room.session = payload;
    },
    'join-accepted': function (payload) {
      this.user = payload.user;
      this.room = payload.room;
      registerSocketEvents.call(this);
    }
  },
  methods: {
    sendMessage (message) {
      this.$socket.emit('um', {
        sender: this.username,
        room: this.addr,
        body: message
      });
    },
    setUsername () {
      let newUsername = this.form.username;
      if (newUsername) {
        this.$store.dispatch('setUserData', { username: newUsername });
        this.$socket.emit('userData', { user: this.$store.state.user });
        this.joinRoom();
      }
    },
    changeUsername (newUsername) {
      // Não disparar o evento caso não haja mudança
      if (newUsername === this.username) {
        return false;
      }

      this.$store.dispatch('setUserData', { username: newUsername });
      this.$socket.emit('userDataEdit', { user: this.$store.state.user });
    },
    joinRoom () {
      // Entrar na sala
      this.$socket.emit('join-request', {
        addr: this.addr,
        user: this.$store.state.user
      });

      this.$store.commit('addToChatHistory', this.addr);
    },
    stop () {
      this.$socket.emit('stop');
    },
    sessionEmit (action, payload) {
      payload.action = payload.action || action;
      this.$socket.emit('session', payload);
    }
  }
};
</script>
<style>
  #full_container {
    height: calc(100vh - 50px);
    display:flex;
    flex-direction: column;
  }

  #main_view {
    overflow: auto;
    background: #FFF;
    flex-grow: 9;
  }

  #chat_users {
    background: #EEE;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0;
  }

  #chat_typer {
    position:fixed;
    bottom:5px;
    left:5px;
    width: calc(100% - 10px);
  }
</style>
