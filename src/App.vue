<template>
  <div id="app">
    <header>
      <h1>Todo Application</h1>
    </header>

    <section>
      <form
        @submit.prevent="onSubmitCreateTodo"
      >
        <input
          v-model="newTodoName"
          type="text"
          placeholder="Nombre"
        >

        <button type="submit">Crear</button>
      </form>

      <apollo-query
        :query="queries.getTodos"
      >
        <apollo-subscribe-to-more
          :document="queries.todoCreated"
          :updateQuery="onTodoCreated"
        />
        <template slot-scope="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading">
            Cargando...
          </div>

          <div v-else-if="error">An error occured</div>

          <div v-else-if="data">
            <ul v-if="data && data.getTodos && data.getTodos.length">
              <li
                v-for="todo of data.getTodos"
                :key="todo.id"
              >
                <label :for="`todo-${todo.id}`">
                  <input
                    :id="`todo-${todo.id}`"
                    :checked="todo.completed"
                    :disabled="todo.id === -1"
                    @input="onCheckTodo"
                    type="checkbox"
                  >
                  {{ todo.name }}
                </label>
              </li>
            </ul>
            <div v-else>
              <p>No hay resultados</p>
            </div>
          </div>

          <!-- No result -->
          <div v-else>Error</div>
        </template>
      </apollo-query>
    </section>
  </div>
</template>

<script>
import * as queries from './queries'

export default {
  name: 'app',
  data () {
    return {
      queries,
      newTodoName: ''
    }
  },
  methods: {
    onTodoCreated (previousResult, { subscriptionData }) {
      const exist = previousResult.getTodos
        .some(entry =>
          entry.id === subscriptionData.data.todoCreated.id)

      if (exist) {
        return previousResult
      }

      return Object.assign(previousResult, {
        getTodos: previousResult.getTodos.concat(subscriptionData.data.todoCreated)
      })
    },
    onCheckTodo () {
      return void 0
    },
    async onSubmitCreateTodo ({ target: { checked } }) {
      const name = this.newTodoName
      this.newTodoName = ''

      await this.$apollo.mutate({
        mutation: queries.createTodo,
        variables: {
          name
        },
        update: (store, { data: { createTodo: todo } }) => {
          const data = store.readQuery({ query: queries.getTodos })
          data.getTodos.push(todo)
          store.writeQuery({ query: queries.getTodos, data })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createTodo: {
            __typename: 'Todo',
            id: -1,
            name,
            completed: false,
            lastModificationDate: +new Date()
          }
        }
      }).catch(() => {
        this.newTodoName = name
      })
    }
  }
}
</script>

<style lang="scss">
</style>
