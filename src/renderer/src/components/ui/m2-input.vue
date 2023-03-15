<template>
  <input
    v-model="value"
    class="m2-input-assist"
    :type="inputType"
    :placeholder="inputType"
    @input="$emit(inputType, value, inputType)"
  />
</template>

<script>
export default {
  name: 'M2Input',
  props: {
    inputType: {
      type: String
    }
  },
  data() {
    return {
      value: ''
    }
  }
}
</script>

<style scoped>
.m2-input-assist {
  -webkit-app-region: no-drag;
  padding: 0 12px 0 12px;
  border-radius: 6px;
  border: none;
  box-sizing: border-box;
  height: 30px;
  outline: none;
  background-color: #111111;
  color: white;
}

.m2-input-assist::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.514);
}
</style>
