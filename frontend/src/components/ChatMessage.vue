<template>
  <div class="system q-px-sm q-py-xs" v-if="message.type == 'system'">
    {{message.body}}
  </div>
  <div v-else>
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
