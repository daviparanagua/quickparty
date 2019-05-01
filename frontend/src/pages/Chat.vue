<template>
  <q-page class="row" v-if="state == 'active'">
    <div class="col-xs-12" id="chat_container">
      <div id="chat_messages" class="q-pa-md">
        <chat-messages
          :messages = "messages"
          :socketId = "socketId"
        ></chat-messages>
      </div>
      <div class="q-pa-sm" id="chat_users">
        <users-list
          class = "userslist"
          :users = "users"
          :my-id = "socketId"
          @changeUsername="changeUsername"
        ></users-list>
      </div>
    </div>
    <div id="chat_typer">
      <chat-text-box
        class = "textarea"
        @sendMessage = "sendMessage"
      ></chat-text-box>
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
</template>

<script>
import io from 'socket.io-client';
import ChatMessages from 'components/ChatMessages';
import ChatTextBox from 'components/ChatTextBox';
import UsersList from 'components/UsersList';

export default {
  name: 'Chat',
  data: () => ({
    addr: '',
    form: {
      username: ''
    },
    messages: [], // Todas as mensagens do chat
    loading: true, // Chat ainda está carregando
    socketId: '', // ID do Socket
    users: [] // Todos os participantes do chat
  }),
  computed: {
    username: {
      get: function () { return this.$store.state.user.username; }
    },
    state () {
      if (!this.$store.state.user.username) return 'profile';
      if (this.loading) return 'loading';
      return 'active';
    }
  },
  components: {
    ChatMessages,
    ChatTextBox,
    UsersList
  },
  created () {
    // Mostra carregamento (em x segundos: vide quasar.conf)
    this.$q.loading.show();

    // Chat solicitado
    this.addr = `/${this.$route.params.chatAddr || ''}`;

    // Título da janela
    this.$store.commit('setTitle', this.addr);

    // Conectar socket
    this.socket = io('http://localhost:3000');
    let socket = this.socket;

    // Tudo ok?
    socket.on('connect', () => {
      this.socketId = socket.io.engine.id;
      this.loading = false;
      this.$q.loading.hide();
    });

    // Se já é conhecido, pode iniciar
    if (this.username) {
      this.joinRoom();
    }
  },
  methods: {
    sendMessage (message) {
      this.socket.emit('um', {
        sender: this.username,
        room: this.addr,
        body: message
      });
    },
    setUsername () {
      let newUsername = this.form.username;
      if (newUsername) {
        this.$store.dispatch('setUserData', { username: newUsername });
        this.socket.emit('userData', { user: this.$store.state.user });
        this.joinRoom();
      }
    },
    changeUsername (newUsername) {
      // Não disparar o evento caso não haja mudança
      if (newUsername === this.username) {
        return false;
      }

      this.$store.dispatch('setUserData', { username: newUsername });
      this.socket.emit('userDataEdit', { user: this.$store.state.user });
    },
    joinRoom () {
      /**
       * Entrar na sala
       */
      this.socket.emit('join-request', {
        addr: this.addr,
        user: this.$store.state.user
      });

      this.$store.commit('addToChatHistory', this.addr);
      this.registerSocketEvents();
    },
    addMessage (message) {
      this.messages.push(message);
      this.$nextTick(() => {
        let container = this.$el.querySelector('#chat_messages');
        container.scrollTop = container.scrollHeight;
      });
    },
    registerSocketEvents () {
      // ### Eventos ###

      let socket = this.socket;

      // Entrada na sala autorizada
      socket.on('join-accepted', (payload) => {
        this.socket.emit('users');
      });

      // Log de mensagens recebido
      socket.on('msg_log', (payload) => {
        for (let message of payload) {
          this.addMessage(message);
        }
      });

      // SM: System Message: Mensagem do sistema
      socket.on('sm', (message) => {
        this.addMessage(message);
      });

      // UM: User Message: Mensagem de usuário
      socket.on('um', (message) => {
        this.addMessage(message);
      });

      // USERS: Lista de usuários na sala
      socket.on('users', (users) => {
        let orderedUsers = (users.sort((a, b) => {
          if (a.user.username < b.user.username) { return -1; };
          if (a.user.username > b.user.username) { return 1; };
          return 0;
        }));
        this.users = orderedUsers;
      });
    }
  },
  beforeRouteUpdate (to, from, next) {
    console.log('Desconectando');
    this.socket.disconnect();
    next();
  },
  beforeRouteLeave (to, from, next) {
    console.log('Desconectando');
    this.socket.disconnect();
    // next();
  }
};
</script>
<style>
  #chat_container {
    height: calc(100vh - 50px - 64px);
    display: flex;
  }

  #chat_messages {
    overflow: auto;
    background: #FFF;
    flex-grow: 9;
  }

  #chat_users {
    background: #EEE;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 30%;
  }

  #chat_typer {
    position:fixed;
    bottom:5px;
    left:5px;
    width: calc(100% - 10px);
  }
</style>
