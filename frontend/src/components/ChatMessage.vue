<template>
  <div>
    {{message.sender}}: {{message.body}}
  </div>
</template>

<script>
export default {
  props: ['message']
};
</script>

<style>

</style>
