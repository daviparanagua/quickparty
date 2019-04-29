<template>
  <div @click="edit = true" class="myself text-primary">
    {{username}}
  </div>
</template>

<script>
export default {
  data: () => ({
    edit: false
  }),
  computed: {
    username () {
      return this.user ? this.user.user.username : '';
    }
  },
  props: ['user', 'myself']
};
</script>

<style>
  .myself {
    font-weight: bold;
  }
</style>
