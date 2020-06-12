<template>
  <div class="backdrop">
    <form class="form" @submit.prevent="$emit('addItemInForm', title)">
      <button class="button button--close" @click="$emit('closeForm')"></button>
      <label for="title">Title</label>
      <input ref="title" id="title" class="input" type="text" v-model="title">
      <button class="button button--add"></button>
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
    },
    mounted() {
      this.$refs.title.focus();
    }
  }
</script>

<style lang="scss">
  @import "form";
</style>