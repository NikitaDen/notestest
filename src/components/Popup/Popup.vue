<template>
  <div class="popup">
    <p>{{title}}</p>
  </div>
</template>

<script>
  export default {
    props: ['title']
  }
</script>

<style lang="scss">
  @import "popup";
</style>