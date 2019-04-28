<template>
  <q-page class="row">
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
</template>

<script>
import io from 'socket.io-client';
import ChatMessages from 'components/ChatMessages';
import ChatTextBox from 'components/ChatTextBox';
import UsersList from 'components/UsersList';

export default {
  name: 'Chat',
  data: () => ({
    id: 0, // ID do chat
    myName: 'User', // Nome do usuário
    messages: [], // Todas as mensagens do chat,
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
      console.warn(message);
    }
  },
  created () {
    // Chat solicitado
    let addr = `/${this.$route.params.chatAddr}`;

    // Título da janela
    this.$store.commit('setTitle', addr);

    /**
     * Conectar socket
     */
    this.socket = io('http://localhost:3000');
    let socket = this.socket;

    /**
     * Entrar na sala
     */
    socket.emit('join-request', {
      addr
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
      console.log(message);
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
    background: #CCC;
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
