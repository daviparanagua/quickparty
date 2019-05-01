<template>
  <div>
    <a v-if="!edit" @click="edit = true">
      <myself
        :user = "myuser"
      ></myself>
    </a>
    <div v-else>
      <q-input
          :value="username"
          dense
          hint="Digite um nome de usuário e aperte ENTER"
          @keyup.enter="$emit('changeUsername', $event.target.value); edit=false"
      ></q-input>
    </div>
    <user
      v-for = "user in otherUsers"
      :key = "user.id"
      :user = "user"
      ></user>
  </div>
</template>

<script>
import Myself from './Myself';
import User from './User';

export default {
  data: () => ({
    edit: false
  }),
  props: ['users', 'my-id'],
  computed: {
    myuser () {
      let myuser = this.users.filter((user) => user.id === this.$store.state.user.uuid);
      return myuser[0];
    },
    username: {
      get: function () { return this.$store.state.user.username; }
    },
    otherUsers () {
      return this.users.filter((user) => user.id !== this.$store.state.user.uuid);
    }
  },
  components: {
    Myself,
    User
  }
};
</script>

<style>

</style>
