<template>
   <q-chip :color="chipColor" text-color="white" class="q-px-md q-ma-xs">
    {{username}}
   </q-chip>
</template>

<script>
export default {
  computed: {
    username () {
      return this.user ? this.user.user.username : '';
    },
    chipColor () {
      if (this.isMe) { return 'primary'; }
      return 'info';
    }
  },
  props: ['user', 'isMe']
};
</script>

<style>
</style>
