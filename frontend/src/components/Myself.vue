<template>
  <div class="myself text-primary">
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
