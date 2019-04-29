<template>
  <div>
    <myself
      v-for = "user in myself "
      :key = "user.id"
      :user = "user"
    ></myself>
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
  props: ['users', 'my-id'],
  computed: {
    myself () {
      return this.users.filter((user) => user.id === this.myId);
    },
    otherUsers () {
      return this.users.filter((user) => user.id !== this.myId);
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
