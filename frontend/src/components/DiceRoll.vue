<template>
  <div v-if="message.parsedBy == 'roll'" class="message action dice q-pa-xs q-mt-xs bg-secondary text-white">
      <div class="dice-result">
        <q-icon name="fas fa-dice" /> {{message.sender}} tirou {{message.result}}
      </div>
      <div>
          {{message.amount}}D{{message.sides}}:
          <span v-for="outcome of message.outcomes" :key="Math.random() * outcome">
            {{outcome}}
          </span>
      </div>
    <div class="message-time">
      <timeago :datetime="message.timestamp" :auto-update="60"></timeago>
    </div>
  </div>
  <div v-else class="message action action-default q-py-sm q-mt-xs bg-secondary text-white">
      {{message.sender}} {{message.action}}
    <span class="message-time">
      <timeago :datetime="message.timestamp" :auto-update="60"></timeago>
    </span>
  </div>
</template>

<script>
export default {
  props: ['message'],
  computed: {
  }
};
</script>

<style>

.dice-result {
  font-size:2em;
}

.message.action {
  text-align: center;
  font-size: 0.9em;
}

.action-default .message-time {
  font-size: 0.8em;
  opacity: 0.6;
  font-weight: 300;
  display: inline-block;
}

</style>
