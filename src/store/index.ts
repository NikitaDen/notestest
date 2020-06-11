import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notes: [
      {
        title: 'Domestic tasks',
        todos: [
          {title: 'Task 10', done: true, id: 1},
          {title: 'Task 20', done: false, id: 2},
        ],
        id: 1,
      },
      {
        title: 'Another tasks',
        todos: [
          {title: 'Task 11', done: true, id: 1},
          {title: 'Task 21', done: false, id: 2},
        ],
        id: 2,
      }
    ],
    editedNote: {},
    editedNoteBeforeChange: {}
  },
  mutations: {
    setNotes: (state, notes) => {
      state.notes = notes
    },
    setEditedNote: (state, editedNote) => {
      state.editedNote = editedNote
    },
    setEditedNoteBeforeChange: (state, editedNoteBeforeChange) => {
      state.editedNoteBeforeChange = editedNoteBeforeChange
    },
  },
  actions: {},
  getters: {
    notes: (state) => state.notes
  },
  modules: {}
})
