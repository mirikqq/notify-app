<template>
  <div class="m2-widget-layout">
    <Auth v-if="!isAuthorized" :class="'auth-interaction'" @authorized="profiler" />
    <WelcomeMsg v-if="isAuthorized" :user_name="profile.name" @welcomeShowed="welcomeMsg = true" />
    <UserProfile v-if="isAuthorized && welcomeMsg" :user-profile="profile" />
    <Logout class="drag-assist" />
    <Collapse class="drag-assist" />
    <MicroSipStatus class="drag-assist" :status="supportStatus" />
  </div>
</template>

<script>
import anime from 'animejs'
import { useUserStore } from '../../../store/profileState'

export default {
  name: 'UserView',
  data() {
    return {
      isAuthorized: useUserStore().isAuthorized,
      profile: useUserStore().profile,
      welcomeMsg: false,
      supportStatus: useUserStore().supportStatus
    }
  },
  created() {
    window.tintacle.supportStatusHandler((event, value) => {
      useUserStore().setSupportStatus(value)
      this.supportStatus = value
    })
  },
  mounted() {
    anime({
      targets: '.auth-interaction',
      opacity: [{ value: 1, duration: 1000, easing: 'linear' }]
    })
    setTimeout(() => {
      window.tintacle.collapseToTray()
    }, 120000)
  },
  methods: {
    profiler(isAuthorized, profile) {
      this.profile = profile
      anime({
        targets: '.auth-interaction',
        opacity: [{ value: 0, duration: 500, easing: 'linear' }],
        complete: (animation) => {
          if (animation.finished) {
            this.isAuthorized = isAuthorized
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.auth-interaction {
  opacity: 0;
}

.drag-assist {
  -webkit-app-region: no-drag;
}
</style>
