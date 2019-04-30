<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="/statics/logo.png">
          </q-avatar>
          {{windowTitle}}
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="right" side="right" bordered>
      <q-item-label header>Salas visitadas</q-item-label>
      <q-item clickable v-ripple v-for="(trueValue, room) in $store.state.chatHistory" :key="room" :to="room" exact>
        <q-item-section>
          <q-item-label>
            {{room}}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.params.chatAddr" />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      right: this.$q.platform.is.desktop
    };
  },
  computed: {
    windowTitle () {
      return this.$store.state.windowTitle;
    }
  }
};
</script>
