<template>
  <div>
    <h1>Escolha o seu template</h1>
    <div v-for="template in templates" :key="template.name">
      {{template.name}}
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    templates: {}
  }),
  created () {
    let socket = this.$store.socket;
    socket.emit('get-templates');

    socket.on('templates', (templates) => {
      console.log(templates);
      this.templates = templates;
    });
  }
};
</script>

<style>

</style>
