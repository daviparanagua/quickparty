<template>
  <div>
    <chat-message
      v-for = "(message, index) in processedMessages"
      :is-last="index === messages.length - 1"
      :key = "message.id"
      :message = "message"
      :sent = "message.sent || false"
      ></chat-message>
  </div>
</template>

<script>

import ChatMessage from './ChatMessage';

export default {
  props: ['messages', 'socketId'],
  computed: {
    processedMessages () {
      let processedMessages = [];
      let lastMessage;
      let remainingMessages = this.messages.length;

      for (let message of this.messages) {
        remainingMessages--;

        if (message.socket === this.socketId) {
          message.sent = true;
        }

        if (!lastMessage) {
          lastMessage = message;
          lastMessage.messages = [message.body];
        } else if (message.type === 'user' && message.socket === lastMessage.socket) {
          lastMessage.messages.push(message.body);
          lastMessage.timestamp = message.timestamp;
          lastMessage.id = lastMessage.id + message.id;
          message = null;
        } else {
          processedMessages.push(lastMessage);
          lastMessage = message;
          lastMessage.messages = [message.body];
        }

        if (remainingMessages === 0) {
          processedMessages.push(lastMessage);
        }
      }

      return processedMessages;
    }
  },
  components: {
    ChatMessage
  }
};
</script>

<style>

</style>
