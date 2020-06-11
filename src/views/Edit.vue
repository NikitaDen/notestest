<template>
  <div class="edit">
    <Confirm v-if="isConfirmOpened" @agreeAction="onCancelEditing" @closeConfirm="showConfirmPop"></Confirm>

    <button @click="showConfirmPop">Cancel</button>

    <Form v-if="isTodoFormOpened" @closeForm="openTodoForm" @addItemInForm="addTodo($event)"></Form>

    <form class="form" @submit.prevent="saveNote">
      <h3>Note Title</h3>
      <button @click="showConfirmPop">Delete</button>
      <button @click="setPreviousState" :disabled="undoDisabled">Undo</button>
      <button @click="setUpdatedState" :disabled="redoDisabled">Redo</button>

      <input @change="setButtonsDisabling"
             @focus="setPreviousNoteVersion"
             @blur="onChangeEvents"
             id="title" type="text"
             v-model="actualNoteVersion.title">

      <h3>Todos</h3>
      <button @click="openTodoForm">Add todo</button>

      <TodoItem
        v-for="todo in actualNoteVersion.todos"
        @setPreviousNoteVersion="setPreviousNoteVersion($event)"
        @deleteTodo="deleteTodo($event)"
        @setButtonsDisabling="onChangeEvents"
        :todo="todo" :key="todo.id"></TodoItem>

      <input type="submit" class="button button--save" value="Save">
    </form>
  </div>
</template>

<script>
  import Form from "../components/Form";
  import TodoItem from "../components/TodoItem";
  import Confirm from "../components/Confirm";

  export default {
    components: {Form, TodoItem, Confirm},
    data() {
      return {
        notes: [],
        previousNoteVersion: {},
        updatedNoteVersion: {},
        actualNoteVersion: {},

        isTodoFormOpened: false,
        isConfirmOpened: false,
        stateButtonsDisabled: true,

        undo: false,
        redo: true,
        undoDisabled: true,
        redoDisabled: true,
      }
    },
    methods: {
      onCancelEditing() {
        this.$router.push('/');
      },
      deleteNote() {
        localStorage.setItem('notes', JSON.stringify([...this.notes].filter(item => item.id !== this.updatedNoteVersion.id)));
        this.$router.push('/');
      },
      onChangeEvents() {
        if (!this.redoDisabled) {
          this.previousNoteVersion = {...this.updatedNoteVersion};
          this.updatedNoteVersion = {...this.actualNoteVersion};
          this.redoDisabled = true;
          this.undoDisabled = false
        }
      },
      setButtonsDisabling() {
        if (this.undoDisabled && this.redoDisabled) {
          this.undoDisabled = false;
        }
      },
      setPreviousState() {
        this.undoDisabled = true;
        this.redoDisabled = false;
        this.actualNoteVersion = this.previousNoteVersion
      },
      setUpdatedState() {
        this.undoDisabled = false;
        this.redoDisabled = true;
        this.actualNoteVersion = this.updatedNoteVersion
      },
      openTodoForm() {
        this.isTodoFormOpened = !this.isTodoFormOpened
      },
      showConfirmPop() {
        this.isConfirmOpened = !this.isConfirmOpened
      },
      addTodo(title) {
        if (!this.redoDisabled) {
          this.updatedNoteVersion = {...this.previousNoteVersion};
          this.redoDisabled = true;
          this.undoDisabled = false
        } else {
          this.undoDisabled = false;
          this.previousNoteVersion = {...this.updatedNoteVersion};
        }

        this.isTodoFormOpened = false;
        const newTodo = {title, done: false, id: `${Date.now()}`};
        const todos = [newTodo, ...this.updatedNoteVersion.todos];

        this.previousNoteVersion = {...this.updatedNoteVersion};
        this.updatedNoteVersion = {...this.updatedNoteVersion, todos}
      },
      setPreviousNoteVersion(todoId) {
        this.setButtonsDisabling();
        if (todoId) {
          this.previousNoteVersion = {
            ...this.updatedNoteVersion, todos: [...this.updatedNoteVersion.todos].map(item => {
              if (item.id === todoId) {
                return {...item}
              }
              return item
            })
          }
        } else {
          this.previousNoteVersion = {...this.updatedNoteVersion}
        }
      },
      deleteTodo(todoId) {
        if (!this.redoDisabled) {
          this.updatedNoteVersion = {...this.previousNoteVersion};
          this.redoDisabled = true;
          this.undoDisabled = false
        } else {
          this.undoDisabled = false;
          this.previousNoteVersion = {...this.updatedNoteVersion};
        }

        const todos = [...this.updatedNoteVersion.todos].filter(item => item.id !== todoId);
        this.updatedNoteVersion = {...this.updatedNoteVersion, todos}
      },
      saveNote() {
        localStorage.setItem('notes', JSON.stringify([...this.notes].map(item => {
          if (item.id === this.actualNoteVersion.id) {
            return {...this.actualNoteVersion}
          }
          return item
        })))
      }
    },
    mounted() {
      this.notes = JSON.parse(localStorage.getItem('notes'));

      // Состояния заметки для возможности отмены изменений
      this.previousNoteVersion = JSON.parse(localStorage.getItem('notes')).filter(item => item.id === this.$route.params.id)[0];
      this.updatedNoteVersion = JSON.parse(localStorage.getItem('notes')).filter(item => item.id === this.$route.params.id)[0];
      this.actualNoteVersion = this.updatedNoteVersion;

      // document.addEventListener('keydown', function (event) {
      //   if (event.key === 'z' && event.ctrlKey) this.setPreviousState();
      //   if (event.key === 'y' && event.ctrlKey) this.setUpdatedState();
      // })
    },
    watch: {
      updatedNoteVersion() {
        this.actualNoteVersion = this.updatedNoteVersion;
      },
    },
  }
</script>

<style lang="scss">
  h3 {
    padding: .5rem 0;
    text-align: left;
  }

  .button--save {
    margin-top: 2rem;
  }
</style>
