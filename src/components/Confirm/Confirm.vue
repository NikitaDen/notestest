<template>
  <div class="backdrop">
    <div class="confirm">
      <p>{{title}}</p>
      <div class="button-group">
        <button class="button button--confirm" @click="$emit('agreeAction')">Yes</button>
        <button class="button button--refuse" @click="$emit('closeConfirm')">No</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['title']
  }
</script>

<style lang="scss">
  @import "confirm";
</style>