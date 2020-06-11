<template>
  <div class="notes__wrapper">
    <Form v-if="isNoteFormOpened" @closeForm="openNoteForm" @addItemInForm="addNote($event)"></Form>

    <Confirm v-if="isConfirmOpened" @closeConfirm="isConfirmOpened = false" @agreeAction="deleteNote"></Confirm>

    <button @click="openNoteForm">Add note</button>
    <div v-for="note in notes" :key="note.id" class="note">
      <div class="note__header">
        <span>{{note.title}}</span>
        <button class="button button--edit" @click="$router.push(`/${note.id}`)">Edit</button>
        <button class="button button--delete" @click="showConfirmPop(note.id)">Delete</button>
      </div>
      <p v-for="todo in note.todos.slice(0, 2)" :key="todo.id">{{todo.title}}</p>
      <p v-if="note.todos.length > 2">...</p>
    </div>
  </div>
</template>

<script>
  import Form from "@/components/Form";
  import Confirm from "@/components/Confirm";

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
      showConfirmPop(noteId) {
        this.isConfirmOpened = true;
        this.noteId = noteId;
      },
      deleteNote() {
        localStorage.setItem('notes', JSON.stringify([...this.notes].filter(item => item.id !== this.noteId)));
        this.notes = [...this.notes].filter(item => item.id !== this.noteId);
        this.isConfirmOpened = false;
      },
      openNoteForm() {
        this.isNoteFormOpened = !this.isNoteFormOpened
      },
      addNote(title) {
        this.isNoteFormOpened = false;
        const newNote = {title, todos: [], id: `${Date.now()}`};

        localStorage.setItem('notes', JSON.stringify([newNote, ...this.notes]));
        this.notes = [newNote, ...this.notes];
      },
    },
    mounted() {
      this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    }
  }
</script>

<style lang="scss">
  .note {
    box-shadow: 0 0 10px gray;
    width: 300px;
    margin: 1rem auto;
    padding: 1rem;

    &__header {
      margin-bottom: 1rem;
    }
  }

  .backdrop {
    position: fixed;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 100;
  }

  .form {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 0 auto;
    padding: 1rem;
    background: white;
    width: 300px;

    label {
      text-align: left;
      padding: .5rem 0;
    }

    input {
      padding: .25rem;
    }

    .button--close {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

</style>
