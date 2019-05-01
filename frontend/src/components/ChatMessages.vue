<template>
  <div>
    <component
      v-for = "(message, index) in processedMessages"
      :is-last="index === messages.length - 1"
      :is = "msgComponent(message)"
      :key = "message.id"
      :message = "message"
      :sent = "message.sent || false"
      ></component>
  </div>
</template>

<script>

import ChatMessage from './ChatMessage';
import SystemMessage from './SystemMessage';
import ActionMessage from './ActionMessage';

export default {
  props: ['messages', 'socketId'],
  computed: {
    processedMessages () {
      let processedMessages = [];
      let lastMessage;
      let remainingMessages = this.messages.length;

      for (let message of this.messages) {
        remainingMessages--;

        if (message.userId === this.$store.state.user.uuid) {
          message.sent = true;
        }

        if (!lastMessage) {
          lastMessage = message;
          lastMessage.messages = [message];
        } else if (message.type === 'user' && lastMessage.type === 'user' && message.userId === lastMessage.userId) {
          lastMessage.messages.push(message);
          lastMessage.timestamp = message.timestamp;
          lastMessage.id = lastMessage.id + message.id;
          message = null;
        } else {
          processedMessages.push(lastMessage);
          lastMessage = message;
          lastMessage.messages = [message];
        }

        if (remainingMessages === 0) {
          processedMessages.push(lastMessage);
        }
      }

      return processedMessages;
    }
  },
  methods: {
    msgComponent (message) {
      switch (message.type) {
        case 'user': return 'chat-message';
        case 'system': return 'system-message';
        case 'action': return 'action-message';
      }
    }
  },
  components: {
    ChatMessage,
    SystemMessage,
    ActionMessage
  }
};
</script>

<style>

</style>
