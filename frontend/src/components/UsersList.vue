<template>
  <div>
    <user
      v-for = "user in users"
      :key = "user.id"
      :user = "user"
      ></user>
  </div>
</template>

<script>
import User from './User';

export default {
  props: ['users'],
  components: {
    User
  }
};
</script>

<style>

</style>
