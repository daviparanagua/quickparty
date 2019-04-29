<template>
  <div class="message system q-px-sm q-py-xs" v-if="message.type == 'system'">
      {{message.body}}
    <div class="time">
      {{printableTime}}
    </div>
  </div>
  <q-chat-message
    v-else
    :name="message.sender"
    :text="message.messages"
    :stamp="printableTime"
    :sent="message.sent"
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
}

.message:hover .time{
  display:block;
}

.message .time {
  display: none;
  font-size: 0.8em;
  color: #666;
}
</style>
