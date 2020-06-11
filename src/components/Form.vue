<template>
  <div class="backdrop">
    <form class="form" @submit.prevent="$emit('addItemInForm', title)">
      <button class="button button--close" @click="$emit('closeForm')">X</button>
      <label for="title">Title</label>
      <input id="title" type="text" v-model="title">
      <input type="submit" value="Add">
    </form>
  </div>
</template>

<script>
  export default {
    props: ['addNote', 'openNoteForm'],
    data() {
      return {
        title: ''
      }
    }
  }
</script>

<style scoped>

</style>