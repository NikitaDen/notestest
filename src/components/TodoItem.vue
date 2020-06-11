<template>
  <div  class="todo">
    <input @input="$emit('setPreviousNoteVersion', todo.id)" @focus="$emit('setButtonsDisabling')" type="checkbox" v-model="todo.done">
    <input @change="$emit('setButtonsDisabling')" @focus="$emit('setPreviousNoteVersion', todo.id)" v-model="todo.title">
    <button @click="$emit('deleteTodo', todo.id)">Delete</button>
  </div>
</template>

<script>
  export default {
    props: ['todo'],
  }
</script>

<style lang="scss">
  .todo {
    width: 100%;
    margin: 1rem 0;
    display: flex;
    justify-content: space-between;
  }
</style>