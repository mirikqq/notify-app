<template>
  <div :class="'ui-auth'">
    <h4>Авторизация</h4>
    <M2Input :input-type="'email'" @email="authData" />
    <M2Input :input-type="'password'" @password="authData" />
    <M2Button @click="authorize"> Войти </M2Button>
  </div>
</template>

<script>
import { useUserStore } from '../../../store/profileState'

export default {
  name: 'Auth',
  data() {
    return {
      emailValue: '',
      passwordValue: ''
    }
  },
  mounted() {
    this.$el.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.authorize()
      }
    })
  },
  methods: {
    authData(value, dataType) {
      switch (dataType) {
        case 'email':
          this.emailValue = value
          break
        case 'password':
          this.passwordValue = value
          break
      }
    },
    authorize() {
      window.tintacle.auth(this.emailValue, this.passwordValue).then(() => {
        window.tintacle.getAccountData((event, data) => {
          this.$emit('authorized', true, data)
          useUserStore().setUserData({
            profile: data,
            isAuthorized: true,
            passwordValue: this.passwordValue,
            emailValue: this.emailValue
          })
        })
      })
    }
  }
}
</script>

<style scoped>
* {
  user-select: none;
  color: white;
}

.ui-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  height: 100vh;
}
</style>
