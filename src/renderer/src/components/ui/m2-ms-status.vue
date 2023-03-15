<template>
  <div class="m2-tech-assist-status" :title="`Статус Microsip ${status}`">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256">
      <path
        :fill="currentFill"
        d="M233.5 136v56a24.1 24.1 0 0 1-24 24h-16a24 24 0 0 1-24-24v-40a24 24 0 0 1 24-24h23.6a88 88 0 0 0-88.3-80h-.1a87.8 87.8 0 0 0-88.3 80H64a24.1 24.1 0 0 1 24 24v40a24.1 24.1 0 0 1-24 24H48a24.1 24.1 0 0 1-24-24v-56A104 104 0 0 1 128.7 32h.8a104.1 104.1 0 0 1 104 104Z"
      />
    </svg>
    <span v-if="status === 'offline'" class="m2-tech-assist-status-state"></span>
  </div>
</template>

<script>
export default {
  name: 'MicroSipStatus',
  props: {
    status: {
      type: String
    }
  },
  data() {
    return {
      currentFill: 'white' // init
    }
  },
  watch: {
    status(status) {
      if (status === 'offline') {
        this.currentFill = 'red'
      } else if (status === 'online') {
        this.currentFill = 'green'
      } else {
        this.currentFill = 'white'
      }
    }
  },
  mounted() {
    if (this.status === 'offline') {
      this.currentFill = 'red'
    } else if (this.status === 'online') {
      this.currentFill = 'green'
    } else {
      this.currentFill = 'white'
    }
  }
}
</script>

<style scoped>
.m2-tech-assist-status {
  -webkit-app-region: no-drag;
  position: absolute;
  left: 2px;
  bottom: 2px;
  user-select: none;
}

.m2-tech-assist-status-state {
  background-color: red;
  width: 24px;
  height: 2px;
  position: absolute;
  top: 8px;
  right: -4px;
  transform: rotate(45deg);
}
</style>
