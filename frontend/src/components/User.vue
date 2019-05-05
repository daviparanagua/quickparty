<template>
   <q-badge color="gray-2" class="q-pa-xs q-ma-xs">
    {{username}}
   </q-badge>
</template>

<script>
export default {
  computed: {
    username () {
      return this.user ? this.user.user.username : '';
    }
  },
  props: ['user', 'isMe']
};
</script>

<style>
</style>
