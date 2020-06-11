<template>
  <div class="confirm">
    <p>Are you sure?</p>
    <div>
      <button @click="$emit('agreeAction')">Yes</button>
      <button @click="$emit('closeConfirm')">No</button>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="scss">
  .confirm {
    background: white;
    padding: 1rem;
    box-shadow: 0 0 10px gray;
    width: 300px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }
</style>