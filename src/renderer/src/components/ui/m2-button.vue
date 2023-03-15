<template>
  <button class="m2-button-assist">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'M2Button'
}
</script>

<style scoped>
.m2-button-assist {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12.5rem;
  height: 2rem;
  background-color: #111111;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.5s;
  -webkit-app-region: no-drag;
}

.m2-button-assist:hover {
  background-color: #080808;
}
</style>
