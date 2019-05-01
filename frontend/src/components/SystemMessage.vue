<template>
  <div class="message system">
      {{message.body}}
    <div class="message-time q-px-sm">
      <timeago :datetime="message.timestamp" :auto-update="60"></timeago>
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

<style scoped>
.system {
  text-align: center;
  font-style: italic;
  font-size: 0.8em;
  opacity: 0.8;
}

.system:hover .message-time {
  display: block;
}

.system .message-time {
  display: none;
}

.message-time {
  font-size: 0.8em;
  opacity: 0.6;
  font-weight: 300;
  display: block;
}

</style>
