<template>
  <div class="message action q-py-sm q-mt-xs bg-secondary text-white">
      {{message.action}}
    <span class="message-time">
      <timeago :datetime="message.timestamp" :auto-update="60"></timeago>
    </span>
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
.message.action {
  text-align: center;
  font-size: 0.9em;
}

.message.action .message-time {
  font-size: 0.8em;
  opacity: 0.6;
  font-weight: 300;
  display: inline-block;
}

</style>
