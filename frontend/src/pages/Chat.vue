<template>
  <q-page class="row" v-if="state == 'active'">
    <div class="col-xs-12" id="chat_container">
      <div id="chat_messages">
        <chat-messages
          :messages = "messages"
        ></chat-messages>
      </div>
      <div class="q-pa-sm" id="chat_users">
        <users-list
          class = "userslist"
          :users = "users"
        ></users-list>
      </div>
    </div>
    <div id="chat_typer">
      <chat-text-box
        class = "textarea"
        @sendMessage = "sendMessage"
        :text = "textbox"
      ></chat-text-box>
    </div>
  </q-page>
  <q-page class="row items-center justify-center" v-else-if="state == 'profile'">
    <div class="col-xs-8 col-md-6" id="profiler">
      <q-input
        v-model="username"
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
    id: 0, // ID do chat
    myName: 'User', // Nome do usuário
    messages: [], // Todas as mensagens do chat,
    username: '',
    state: 'loading',
    users: [ // Todos os participantes do chat
      {
        name: 'Isto',
        status: 'online'
      },
      {
        name: 'não está',
        status: 'online'
      },
      {
        name: 'implantado (offline)',
        status: 'offline'
      }
    ],
    textbox: '' // Texto da caixa de digitação
  }),
  components: {
    ChatMessages,
    ChatTextBox,
    UsersList
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
      if (this.username) {
        this.state = 'active';
      }
    }
  },
  created () {
    // Verificação do perfil
    this.state = 'profile';

    // Chat solicitado
    this.addr = `/${this.$route.params.chatAddr}`;

    // Título da janela
    this.$store.commit('setTitle', this.addr);

    /**
     * Conectar socket
     */
    this.socket = io('http://localhost:3000');
    let socket = this.socket;

    /**
     * Entrar na sala
     */
    socket.emit('join-request', {
      addr: this.addr
    });

    /**
     * Tudo ok?
     */
    socket.on('connect', () => {
      console.log('Socket.io conectado');
    });

    /**
     * SM: System Message
     */
    socket.on('sm', (message) => {
      this.messages.push(Object.assign(message, {
        type: 'system'
      }));
    });

    /**
     * UM: User Message
     */
    socket.on('um', (message) => {
      this.messages.push(Object.assign(message, {
        type: 'user'
      }));
    });
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
    background: #DFDFDF;
    flex-grow: 3;
  }

  #chat_users {
    background: #EEE;
    flex-grow: 1;
  }

  #chat_typer {
    position:fixed;
    bottom:5px;
    left:5px;
    width: calc(100% - 10px);
  }
</style>
