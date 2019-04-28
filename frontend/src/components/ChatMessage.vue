<template>
  <div class="system q-px-sm q-py-xs" v-if="message.type == 'system'">
    {{message.body}}
  </div>
  <div class="user q-px-sm q-py-xs" v-else-if="message.type == 'user'">
    {{message.sender}}: {{message.body}}
  </div>
</template>

<script>
export default {
  props: ['message']
};
</script>

<style>
.system {
  background: #AAA;
  font-style: italic;
}
</style>
