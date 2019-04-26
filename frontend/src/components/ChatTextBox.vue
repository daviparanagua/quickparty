<template>
  <div>
    <q-input outlined v-model="text" @keyup.enter.prevent.exact="emitMessage" label="Digite uma mensagem e pressione ENTER para enviar" />
  </div>
</template>

<script>
export default {
  data: () => ({
    text: ''
  }),
  methods: {
    emitMessage () {
      // Precisa estar preenchido
      if (this.text.length === 0) {
        return false;
      }
      this.$emit('sendMessage', this.text);
      this.text = '';
    }
  }
};
</script>

<style>

</style>
