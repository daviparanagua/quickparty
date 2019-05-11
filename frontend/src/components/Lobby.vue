<template>
  <div class="row full-height items-center justify-center">
    <div class="col-sm-12 text-center">
      <h5>{{room.template ? room.template.name : 'O dono da sala está escolhendo uma atividade...'}}</h5>

      <div v-if="room.template" class="game-params q-my-md">
        <div v-if="room.template.players.min" :class="['room-prerequisite', {'valid': room.template.players.min <= usersCount }]">Mínimo de participantes: {{room.template.players.min}} ({{usersCount}})</div>
        <div v-if="room.template.players.max" :class="['room-prerequisite', {'valid': room.template.players.max >= usersCount }]">Máximo de participantes: {{room.template.players.max}} ({{usersCount}})</div>
      </div>
      <div>
        <q-btn color="primary" v-if="user.isAdmin" @click="start" :disable="!canStart">
            Começar!
        </q-btn>
        <q-btn v-if="user.isAdmin" @click="clearTemplate">
          Mudar atividade
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['room', 'user', 'users'],
  computed: {
    usersCount () {
      return this.users.length;
    },
    canStart () {
      return (
        (this.room.template.players.min ? this.room.template.players.min <= this.usersCount : true) &&
        (this.room.template.players.max ? this.room.template.players.max >= this.usersCount : true)
      );
    }
  },
  methods: {
    start () {
      this.$socket.emit('start', {});
    },
    clearTemplate () {
      this.$socket.emit('clear-template', {});
    }
  }
};
</script>

<style>
  .room-prerequisite {
    color: red;
  }

  .room-prerequisite.valid {
    color: inherit;
  }

</style>
