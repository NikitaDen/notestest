<template>
  <div class="edit">
    <Popup :class="{showPopup: isPopupShown}" title="Note successfully saved!"></Popup>

    <Confirm v-if="isLeaveConfirmOpened"
             title="Do you want leave this page?"
             @agreeAction="onCancelEditing"
             @closeConfirm="isLeaveConfirmOpened = false"></Confirm>

    <Confirm v-if="isDeleteConfirmOpened"
             title="Do you want delete this note?"
             @agreeAction="deleteNote"
             @closeConfirm="isDeleteConfirmOpened = false"></Confirm>

    <Form v-if="isTodoFormOpened"
          @closeForm="openTodoForm"
          @addItemInForm="addTodo($event)"></Form>

    <form class="edit-form" @submit.prevent="saveNote">
      <div class="buttons-group buttons-group--interactions">
        <button type="button" class="button button--undo" @click="setPreviousState" :disabled="undoDisabled"></button>
        <button type="button" class="button button--redo" @click="setUpdatedState" :disabled="redoDisabled"></button>
        <button type="button" class="button button--delete" @click="isDeleteConfirmOpened = true"></button>
      </div>

      <h3>Note Title</h3>
      <input @change="setButtonsDisabling"
             @focus="setPreviousNoteVersion"
             @blur="onChangeEvents"
             class="input--title" type="text"
             v-model="actualNoteVersion.title">

      <hr/>

      <h3>Todos</h3>
      <button type="button" class="button button--add" @click="openTodoForm"></button>

      <TodoItem
        v-for="todo in actualNoteVersion.todos"
        @setPreviousNoteVersion="setPreviousNoteVersion($event)"
        @deleteTodo="deleteTodo($event)"
        @setButtonsDisabling="onChangeEvents"
        :todo="todo" :key="todo.id"></TodoItem>

      <div class="buttons-group">
        <button class="button button--save">Save</button>
        <button type="button" class="button button--cancel" @click="isLeaveConfirmOpened=true">Cancel</button>
      </div>

    </form>
  </div>
</template>

<script>
  import Form from "../../components/Form/Form";
  import TodoItem from "../../components/TodoItem/TodoItem";
  import Confirm from "../../components/Confirm/Confirm";
  import Popup from "../../components/Popup/Popup";

  export default {
    components: {Form, TodoItem, Confirm, Popup},
    data() {
      return {
        notes: [],

        // 3 состояния для возможности возвращению/отмены изменений
        previousNoteVersion: {},
        updatedNoteVersion: {},
        actualNoteVersion: {},

        // Состояния дополнительных окон
        isTodoFormOpened: false,
        isLeaveConfirmOpened: false,
        isDeleteConfirmOpened: false,
        stateButtonsDisabled: true,
        isPopupShown: false,

        // Состояния кнопок возвращению/отмены изменений для лучшего UX
        undo: false,
        redo: true,
        undoDisabled: true,
        redoDisabled: true,
      }
    },
    methods: {
      deleteNote() {
        localStorage.setItem('notes', JSON.stringify([...this.notes].filter(item => item.id !== this.updatedNoteVersion.id)));
        this.$router.push('/');
      },
      openTodoForm() {
        this.isTodoFormOpened = !this.isTodoFormOpened
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
        })));

        //Вызов уведомления об удачном сохранении и удаление класса анимации через 3 секунды
        this.isPopupShown = true;
        setTimeout(() => this.isPopupShown = false, 3000);
      },
      onCancelEditing() {
        this.$router.push('/');
      },

      //Функции управления состоянием кнопок возвращению/отмены изменений
      onChangeEvents() {
        if (!this.redoDisabled) {
          this.previousNoteVersion = {...this.updatedNoteVersion};
          this.updatedNoteVersion = {...this.actualNoteVersion};
          this.redoDisabled = true;
          this.undoDisabled = false
        }
      },
      setButtonsDisabling() {
        //Кнопка отмены изменения становится активной после изменения поля title заметки
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
    },
    mounted() {
      this.notes = JSON.parse(localStorage.getItem('notes'));

      // Состояния заметки для возможности отмены изменений при монтировании компоненты равны
      this.previousNoteVersion = JSON.parse(localStorage.getItem('notes')).filter(item => item.id === this.$route.params.id)[0];
      this.updatedNoteVersion = JSON.parse(localStorage.getItem('notes')).filter(item => item.id === this.$route.params.id)[0];
      this.actualNoteVersion = this.updatedNoteVersion;
    },
    watch: {
      updatedNoteVersion() {
        this.actualNoteVersion = this.updatedNoteVersion;
      },
    },
  }
</script>

<style lang="scss">
  @import "edit";
</style>
