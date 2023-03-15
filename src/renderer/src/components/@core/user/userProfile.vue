<template>
  <div class="ui-user-info">
    <p>{{ userProfile.name }}</p>
    <p>EXT: {{ userProfile.properties.EXT }}</p>
    <div v-if="phone_number" class="ui-incoming-phone">
      <p>Входящий с: +{{ phone_number }}</p>
    </div>
    <div class="m2-assist-control">
      <M2Button class="m2-assist-client-link" @click="openLink">
        <p>Карточка</p>
      </M2Button>
      <M2Button class="m2-call-assist" @click="phoneAssist">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="m2-icon-phone"
        >
          <g fill="none">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.5 4.842C15.976 4.337 14.146 4 12 4c-2.145 0-3.976.337-5.5.842m11 0c3.021 1 4.835 2.66 5.5 3.658L20.5 11l-3-2V4.842zm-11 0c-3.021 1-4.835 2.66-5.5 3.658L3.5 11l3-2V4.842z"
            />
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M10 6a1 1 0 0 1 1 1v2h2V7a1 1 0 1 1 2 0v2.586l5.121 5.121A3 3 0 0 1 21 16.828V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-1.172a3 3 0 0 1 .879-2.12L9 9.585V7a1 1 0 0 1 1-1zm2 11a2 2 0 1 0 0-4a2 2 0 0 0 0 4z"
              clip-rule="evenodd"
            />
          </g>
        </svg>
      </M2Button>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'
import { useUserStore } from '../../../store/profileState.js'

export default {
  name: 'UserProfile',
  props: {
    userProfile: {
      type: Object
    }
  },
  data() {
    return {
      phone_state: 'idle',
      phone_number: ''
    }
  },
  watch: {
    phone_state(state) {
      if (state === 'incoming') {
        window.tintacle.appShow()
        this.$el.querySelector('.m2-call-assist').style.backgroundColor = '#2e804f'
        anime({
          targets: '.m2-icon-phone',
          rotate: [
            { value: 6, duration: 50, easing: 'linear' },
            { value: -6, duration: 50, easing: 'linear' }
          ],
          loop: true
        })
        this.$el.querySelector('.m2-assist-client-link').style.display = 'unset'
        this.$el.querySelector('.m2-assist-client-link').style.opacity = 1
      }
      if (state === 'answered') {
        this.$el.querySelector('.m2-call-assist').style.backgroundColor = '#750909'
        anime.remove('.m2-icon-phone')
        this.$el.querySelector('.m2-icon-phone').style.transform = 'rotate(0deg)'
        this.$el.querySelector('.m2-assist-client-link').style.display = 'unset'
        this.$el.querySelector('.m2-assist-client-link').style.opacity = 1
      }
      if (state === 'idle') {
        anime.remove('.m2-icon-phone')
        this.$el.querySelector('.m2-icon-phone').style.transform = 'rotate(0deg)'
        this.$el.querySelector('.m2-call-assist').removeAttribute('style')
        this.$el.querySelector('.m2-assist-client-link').style.opacity = 0
        this.$el.querySelector('.m2-assist-client-link').style.display = 'none'
      }
    }
  },
  mounted() {
    const socket = new WebSocket(
      `wss://tools.t2tc.ru:8000/?user=${this.userProfile.login}&EXT=${this.userProfile.properties.EXT}`
    )
    socket.addEventListener('open', () => {
      socket.onmessage = (event) => {
        let currentCall = JSON.parse(event.data)
        if (currentCall.notify_type === 'call_incoming') {
          this.phone_state = 'incoming'
          this.phone_number = currentCall.phone
        }
        if (currentCall.notify_type === 'answer') {
          this.phone_state = 'answered'
          this.phone_number = currentCall.phone
        }
        if (currentCall.notify_type === 'hangup') {
          this.phone_state = 'idle'
          this.phone_number = ''
          window.tintacle.collapseToTray()
        }
      }
    })
  },
  methods: {
    openLink() {
      window.tintacle.openCallerCard(
        this.phone_number,
        useUserStore().emailValue,
        useUserStore().passwordValue
      )
    },
    phoneAssist() {
      if (this.phone_state === 'incoming') {
        window.tintacle.callCmd('answer')
      }
      if (this.phone_state === 'answered') {
        window.tintacle.callCmd('hangupall')
      }
    }
  }
}
</script>

<style scoped>
.ui-user-info {
  display: flex;
  color: white;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  padding: 2%;
  flex-direction: column;
  gap: 10px;
}

.m2-call-assist {
  width: 8rem;
  align-self: center;
  transition: all 0.5s;
}

.m2-assist-client-link {
  width: 8rem;
  align-self: center;
  transition: all 0.5s;
  opacity: 0;
  display: none;
}

.m2-call-assist {
  background-color: #111111;
}

.m2-call-assist:hover {
  background-color: #080808;
}

.m2-assist-control {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: auto;
}

.ui-incoming-phone {
  display: flex;
  justify-content: center;
}
</style>
