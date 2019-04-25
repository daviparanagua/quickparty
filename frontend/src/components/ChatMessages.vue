<template>
  <div>
    <chat-message
      v-for = "message in messages"
      :key = "message.id"
      :message = "message"
      ></chat-message>
  </div>
</template>

<script>

import ChatMessage from './ChatMessage';

export default {
  props: ['messages'],
  components: {
    ChatMessage
  }
};
</script>

<style>

</style>
