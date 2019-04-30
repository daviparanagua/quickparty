<template>
  <div class="message system" v-if="message.type == 'system'">
      {{message.body}}
    <div class="message-time q-px-sm">
      <timeago :datetime="message.timestamp" :auto-update="60"></timeago>
    </div>
  </div>
  <div v-else
    :class="['message message-user row items-end no-wrap q-pa-sm', {'reverse message-sent': message.sent}]"
  >
    <div class="message-container col-auto">
      <div class="message-sender">{{message.sender}}</div>
      <div class="message-text q-pa-sm q-my-xs" v-for="(msg, index) in message.messages" :key="msg.id">
        {{msg.body}}
        <timeago v-if="index === message.messages.length - 1" class="message-time" :datetime="message.timestamp" :auto-update="60"></timeago>
        <q-tooltip
          v-else
          anchor="top middle"
          self="bottom middle"
          content-class="bg-black"
          :delay="400"
          :offset="[10, 10]"
        >
          <timeago :datetime="message.timestamp" :auto-update="60"></timeago>
        </q-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message'],
  computed: {
  }
};
</script>

<style>
.system {
  background: #EEE;
  font-style: italic;
  font-size: 0.8em;
}

.message-container {
  max-width: 60% !important;
}

.system .message-time {
  float:right;
}

.message-text {
  background: #027BE3;
  color:white;
  border-radius: 8px;
  font-weight: 300;
}

.message-sent .message-text {
  background: #E0E0E0;
  color: black;
}

.message-sender {
  font-size: 0.8em;
  font-weight: 300;
  color: #666;
}

.message-sent .message-sender {
  text-align: right;
}

.message-time {
  font-size: 0.8em;
  opacity: 0.6;
  font-weight: 300;
  display: block;
}

</style>
