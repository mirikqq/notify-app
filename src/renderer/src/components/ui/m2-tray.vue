<template>
  <button class="m2-assist-tray" @click="goTray">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.75739 10.5858L9.1716 9.17154L12 12L14.8284 9.17157L16.2426 10.5858L12 14.8284L7.75739 10.5858Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1 5C1 2.79086 2.79086 1 5 1H19C21.2091 1 23 2.79086 23 5V19C23 21.2091 21.2091 23 19 23H5C2.79086 23 1 21.2091 1 19V5ZM5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
        fill="white"
      />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'Collapse',
  methods: {
    goTray() {
      window.tintacle.collapseToTray()
    }
  }
}
</script>

<style scoped>
.m2-assist-tray {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background: none;
  border: none;
}
</style>
