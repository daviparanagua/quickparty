<template>
  <div>
    <h5>Escolha o seu template</h5>
    <div class="row q-col-gutter-sm">
      <q-card class="col-sm-6 col-md-4 col-lg-3" v-for="(template, index) in templates" :key="index" @click="selectTemplate(index)">
        {{template.name}}
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    templates: {}
  }),
  created () {
    this.$socket.emit('get-templates');
  },
  methods: {
    selectTemplate (id) {
      this.$socket.emit('select-template', id);
    }
  },
  sockets: {
    templates (templates) {
      console.log(templates);
      this.templates = templates;
    }
  }
};
</script>

<style>

</style>
