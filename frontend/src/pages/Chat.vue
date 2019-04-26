<template>
  <q-page class="row">
    <div class="col-xs-9">
      <div class="column full-height">
        <div class="col">
          <chat-messages
            :messages = "messages"
          ></chat-messages>
        </div>
        <div class="col-auto">
          <chat-text-box
            @sendMessage = "sendMessage"
            :text = "textbox"
          ></chat-text-box>
        </div>
      </div>
    </div>
    <div class="col-xs-3">
      <users-list
        :users = "users"
      ></users-list>
    </div>
  </q-page>
</template>

<style>
</style>

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
    messages: [ // Todas as mensagens do chat
      {
        id: 1,
        sender: 'Davi',
        body: 'Olá!'
      },
      {
        id: 2,
        sender: 'Davi',
        body: 'Tudo bem?'
      },
      {
        id: 3,
        sender: 'Robô',
        body: 'Desculpe. Não posso falar no momento.'
      }
    ],
    users: [ // Todas as mensagens do chat
      {
        name: 'Davi',
        status: 'online'
      },
      {
        name: 'Robô',
        status: 'online'
      },
      {
        name: 'Daniel',
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
  created () {
    this.socket = io('http://localhost:3000');
    let socket = this.socket;

    socket.on('connect', () => {
      console.log('Socket.io conectado');
    });

    socket.on('system', (message) => {
      console.log(message);
    });
  },
  methods: {
    sendMessage (message) {
      console.warn(message);
    }
  }
};
</script>
