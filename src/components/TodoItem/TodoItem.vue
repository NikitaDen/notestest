<template>
  <div class="todo">
    <div class="checkbox-element">
      <input @input="$emit('setPreviousNoteVersion', todo.id)"
             @focus="$emit('setButtonsDisabling')"
             type="checkbox" v-model="todo.done">
      <label>
        <span class="checked"></span>
      </label>
    </div>

    <input class="input" @change="$emit('setButtonsDisabling')" @focus="$emit('setPreviousNoteVersion', todo.id)"
           v-model="todo.title">
    <button class="button button--delete" @click="$emit('deleteTodo', todo.id)"></button>
  </div>
</template>

<script>
  export default {
    props: ['todo'],
  }
</script>

<style lang="scss">
  @import "todoitem";
</style>