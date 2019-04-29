<template>
  <div :class="{'myself': myself, 'text-primary': myself}">
    {{user.user.username}}
  </div>
</template>

<script>
export default {
  props: ['user', 'myself']
};
</script>

<style>
  .myself {
    font-weight: bold;
  }
</style>
