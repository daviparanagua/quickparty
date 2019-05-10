<template>
  <div>
    Entrou no Draw!
  </div>
</template>

<script>
export default {
  props: ['user', 'room', 'users'],
  sockets: {
    template (payload) {
      console.error(payload);
    }
  }
};
</script>

<style>

</style>
