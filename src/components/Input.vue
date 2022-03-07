<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input
        :value="modelValue"
        @input="onInput"
        type="text"
        class="form-control"
    >
    <div v-if="error" class="text-red">
      {{ error }}
    </div>
  </div>
</template>

<script>
import {getCurrentInstance} from "vue";


export default {
  props: {
    label: {
      type: String,
      required: true
    },
    error: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    }
  },
  setup() {
    const {emit} = getCurrentInstance();
    const onInput = (e) => {
      emit('update:modelValue', e.target.value);
    }
    return {
      onInput
    }
  }
}

</script>

<style scoped>
.text-red {
  color: red;
}

.form-group {
  margin-bottom: 15px;
}
</style>