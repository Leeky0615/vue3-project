<template>
  <div v-if="loading">
    Loading...
  </div>
  <form
      v-else
      @submit.prevent="onSave"
  >
    <div class="row">
      <div class="col-6">
        <Input
            label="Subject"
            v-model="todo.subject"
            :error="subjectError"
        />
      </div>
      <div class="col-6">
        <div v-if="editing" class="form-group">
          <label>Status</label>
          <div>
            <button
                class="btn"
                type="button"
                :class="todo.completed ? 'btn-success' : 'btn-danger'"
                @click="toggleTodoStatus"
            >
              {{ todo.completed ? 'Completed' : 'InComplete' }}
            </button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label>Body</label>
          <textarea
            v-model="todo.body"
            class="form-control"
            cols="30"
            rows="10"
          ></textarea>
        </div>
      </div>
    </div>
    <button
        type="submit"
        class="btn btn-primary"
        :disabled="!todoUpdated"
    >
      {{ editing ? 'Update' : 'Create' }}
    </button>
    <button
        class="btn btn-outline-dark ms-2"
        @click="moveTodoListPage"
    >
      Cancel
    </button>
  </form>
  <transition name="fade">
    <Toast
        v-if="showToast"
        :message="toastMessage"
        :type="toastAlertType"
    />
  </transition>
</template>
<script>
import {useRoute, useRouter} from 'vue-router';
import axios from "axios";
import {ref, computed, onUpdated, getCurrentInstance} from "vue";
import _ from 'lodash';
import Toast from "@/components/Toast";
import {useToast} from "@/composables/toast";
import Input from '@/components/Input';

export default {
  components: {
    Input,
    Toast
  },
  props: {
    editing: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const props = getCurrentInstance();
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: '',
      completed: false,
      body: ''
    });
    onUpdated(()=>{
      console.log(todo.value.subject);
    })
    const subjectError = ref('');
    const originalTodo = ref(null);
    const loading = ref(false);
    const todoId = route.params.id;
    const {
      toastMessage,
      toastAlertType,
      showToast,
      triggerToast
    } = useToast();

    const getTodo = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`http://localhost:3000/todos/${todoId}`);
        todo.value = {...res.data};
        originalTodo.value = {...res.data};
        loading.value = false;
      } catch (err) {
        loading.value = false
        console.log(err)
        triggerToast('Something went wrong..', 'danger');
      }

    };

    const todoUpdated = computed(() => {
      return !_.isEqual(todo.value, originalTodo.value);
    })


    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed
    }

    const moveTodoListPage = () => {
      router.push({
        name: 'Todos'
      })
    };

    const onSave = async () => {
      subjectError.value = '';
      if(!todo.value.subject){
        subjectError.value = 'Subject is required'
        return;
      }
      try {
        let res;
        const data = {
          subject: todo.value.subject,
          completed: todo.value.completed,
          body: todo.value.body
        };
        let message = 'Saved !';
        if(props.editing){
          res = await axios.put(`http://localhost:3000/todos/${todoId}`, data);
          originalTodo.value = {...res.data}
        }else {
          await axios.post('http://localhost:3000/todos/', data);
          message = 'Created'
          todo.value.subject = '';
          todo.value.body = '';
        }
        triggerToast('Successfully ' + message);
      } catch (err) {
        triggerToast('Something went wrong..', 'danger');
      }
    }
    if (props.editing) {
      getTodo();
    }
    return {
      todo,
      loading,
      toggleTodoStatus,
      moveTodoListPage,
      onSave,
      todoUpdated,
      showToast,
      toastMessage,
      toastAlertType,
      subjectError,
    }
  },
}
</script>
<style scoped>
  .text-red{
    color: red;
  }
  .form-group{
    margin-bottom: 15px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
    transform: translateY(0px);
  }

</style>