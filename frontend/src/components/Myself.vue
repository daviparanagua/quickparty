<template>
  <div @click="edit = true" class="myself text-primary">
    {{user.user.username}}
  </div>
</template>

<script>
export default {
  data: () => ({
    edit: false
  }),
  computed: {

  },
  props: ['user', 'myself']
};
</script>

<style>
  .myself {
    font-weight: bold;
  }
</style>
