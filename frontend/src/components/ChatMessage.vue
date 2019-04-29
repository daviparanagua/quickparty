<template>
  <div class="message system q-px-sm q-py-xs" v-if="message.type == 'system'">
    {{message.body}}
    <div class="time">
      {{printableTime}}
    </div>
  </div>
  <div class="message user q-px-sm q-py-xs" v-else-if="message.type == 'user'">
    {{message.sender}}: {{message.body}}
    <div class="time">
      {{printableTime}}
    </div>
  </div>
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
  background: #AAA;
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
