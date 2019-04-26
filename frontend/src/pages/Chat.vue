<template>
  <q-page class="row">
    <div class="col-xs-12" id="chat_container">
      <div class="q-pa-sm" id="chat_messages">
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
