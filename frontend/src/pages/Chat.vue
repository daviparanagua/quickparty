<template>
  <q-page class="flex flex-center">
    <chat-messages
      :messages = "messages"
    ></chat-messages>
    <users-list
      :users = "users"
    ></users-list>
    <chat-text-box
      :text = "textbox"
    ></chat-text-box>
  </q-page>
</template>

<style>
</style>

<script>
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
  }
};
</script>
