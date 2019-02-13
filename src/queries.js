import gql from 'graphql-tag'

export const getTodos = gql`
query getTodos {
  getTodos {
    id,
    name,
    completed
  }
}
`
export const createTodo = gql`
mutation createTodo($name: String) {
  createTodo(name: $name) {
    id
    name
    completed
    lastModificationDate
  }
}
`

export const todoCreated = gql`
subscription todoCreated {
  todoCreated {
    id
    name
    completed
    lastModificationDate
  }
}
`
