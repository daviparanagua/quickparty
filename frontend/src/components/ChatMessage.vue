<template>
  <div class="message system" v-if="message.type == 'system'">
      {{message.body}}
    <div class="time q-px-sm">
      {{printableTime}}
    </div>
  </div>
  <q-chat-message
    v-else
    :name="message.sender"
    :text="message.messages"
    :stamp="printableTime"
    :sent="message.sent"
    name-sanitize
    text-sanitize
  />
</template>

<script>
export default {
  props: ['message'],
  computed: {
    printableTime () {
      return new Date(this.message.timestamp).toLocaleString();
    }
  }
};
</script>

<style>
.system {
  background: #EEE;
  font-style: italic;
  font-size: 0.8em;
}

.message .time {
  font-size: 0.8em;
  color: #666;
  float:right;
}
</style>
