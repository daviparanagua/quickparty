<template>
  <div>
    <user
      v-for = "user in users"
      :key = "user.id"
      :user = "user"
      :myself = "user.id == myId"
      ></user>
  </div>
</template>

<script>
import User from './User';

export default {
  props: ['users', 'my-id'],
  components: {
    User
  }
};
</script>

<style>

</style>
