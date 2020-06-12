<template>
  <div class="notes__wrapper">

    <Form v-if="isNoteFormOpened" @closeForm="openNoteForm" @addItemInForm="addNote($event)"></Form>

    <Confirm title="Do you want delete this note?" v-if="isConfirmOpened" @closeConfirm="isConfirmOpened = false" @agreeAction="deleteNote"></Confirm>

    <button class="button button--add" @click="openNoteForm"></button>

    <div class="notes__container">
      <p v-if="notes.length === 0" style="grid-column: 1/4">You don't have notes. Let's create one!</p>

      <div v-for="note in notes" :key="note.id" class="note">
        <div class="note__header">
          <h3>{{note.title}}</h3>
          <div class="buttons-group">
            <button class="button button--edit" @click="$router.push(`/${note.id}`)"></button>
            <button class="button button--delete" @click="showConfirmPop(note.id)"></button>
          </div>
        </div>

        <hr/>

        <div class="note__todos">
          <h4>Todos</h4>

          <p v-if="note.todos.length === 0">Add new todo in edit mode</p>

          <div v-else class="note__todos__items">
            <p v-for="todo in note.todos.slice(0, 2)" :key="todo.id">{{todo.title}}</p>
            <p style="text-align: center; font-size: 1.5rem; line-height: .85" v-if="note.todos.length > 2">...</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import Form from "@/components/Form/Form";
  import Confirm from "@/components/Confirm/Confirm";

  export default {
    name: 'Home',
    components: {Form, Confirm},
    data() {
      return {
        isNoteFormOpened: false,
        isConfirmOpened: false,
        notes: [],
        note: {
          title: ''
        },
        noteId: ''
      }
    },
    methods: {
      openNoteForm() {
        this.isNoteFormOpened = !this.isNoteFormOpened
      },
      addNote(title) {
        this.isNoteFormOpened = false;
        const newNote = {title, todos: [], id: `${Date.now()}`};

        localStorage.setItem('notes', JSON.stringify([newNote, ...this.notes]));
        this.notes = [newNote, ...this.notes];
      },
      deleteNote() {
        localStorage.setItem('notes', JSON.stringify([...this.notes].filter(item => item.id !== this.noteId)));
        this.notes = [...this.notes].filter(item => item.id !== this.noteId);
        this.isConfirmOpened = false;
      },
      showConfirmPop(noteId) {
        this.isConfirmOpened = true;
        this.noteId = noteId;
      },
    },
    mounted() {
      this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    }
  }
</script>

<style lang="scss">
  @import "home";
</style>
