<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h2>To-Do List</h2>
      <button
          class="btn btn-primary"
          @click="moveToCreatePage"
      >
        Create Todo
      </button>
    </div>

    <input
        class="form-control"
        type="text"
        v-model="searchText"
        placeholder="Search"
        @keyup.enter="searchTodo"
    >
    <hr/>
    <div class="errorStyle" v-if="!todos.length">
      There is nothing to display
    </div>
    <todo-list
        :todos="todos"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteTodo"/>
    <hr/>
    <Pagination
        v-if="todos.length"
        :number-of-pages="numberOfPages"
        :current-page="currentPage"
        @click="getTodos"
    />
  </div>
</template>

<script>
import {computed, ref, watch} from 'vue';
import TodoList from '@/components/TodoList.vue'
import axios from '@/axios';
import {useToast} from "../../composables/toast";
import {useRouter} from "vue-router";
import Pagination from "../../components/Pagination";

export default {
  components: {
    Pagination,
    TodoList,
  },
  setup() {
    const router = useRouter();
    const todos = ref([]);
    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);
    const searchText = ref('');
    const {
      toastMessage,
      toastAlertType,
      showToast,
      triggerToast
    } = useToast();

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value / limit);
    })

    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page
      try {
        const res = await axios.get(`todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`)
        numberOfTodos.value = res.headers['x-total-count'];
        todos.value = res.data;
      } catch (err) {
        console.log(err);
        triggerToast('Something went wrong..', 'danger');
      }
    }
    getTodos();


    const addTodo = async (todo) => {
      // Save Todos in database
      try {
        await axios.post("todos", {
          subject: todo.subject,
          completed: todo.completed
        });
        getTodos(1);
      } catch (err) {
        console.log(err)
        triggerToast('Something went wrong..', 'danger');
      }
    }
    const toggleTodo = async (index, checked) => {
      const id = todos.value[index].id;
      try {
        await axios.patch(`todos/${id}`, {
          completed: !todos.value[index].completed
        });
        todos.value[index].completed = checked
      } catch (err) {
        console.log(err);
        triggerToast('Something went wrong..', 'danger');
      }
    }
    const deleteTodo = async (id) => {
      try {
        await axios.delete(`todos/${id}`);
        getTodos(1);
      } catch (err) {
        console.log(err)
        triggerToast('Something went wrong..', 'danger');
      }

    }

    let timeout = null;
    const searchTodo = () => {
      clearTimeout(timeout);
      getTodos(1)
    }
    watch(searchText, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodos(1);
      }, 2000)
    })
    const moveToCreatePage = () => {
      router.push({
        name: 'TodoCreate'
      })
    }
    const todoStyle = {
      textDecoration: 'line-through',
      color: 'gray'
    }

    return {
      todos,
      getTodos,
      addTodo,
      todoStyle,
      toggleTodo,
      deleteTodo,
      searchText,
      searchTodo,
      numberOfPages,
      currentPage,
      showToast,
      toastMessage,
      toastAlertType,
      moveToCreatePage
    }
  },
}
</script>

<style>

.todo {
  color: gray;
  text-decoration: line-through;
}
</style>