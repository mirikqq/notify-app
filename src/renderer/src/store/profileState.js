import { defineStore } from 'pinia'

export const useUserStore = defineStore('userAccess', {
  state: () => ({
    profile: {},
    isAuthorized: false,
    emailValue: '',
    passwordValue: '',
    supportStatus: ''
  }),
  actions: {
    setUserData(data) {
      this.profile = data.profile
      this.isAuthorized = data.isAuthorized
      this.emailValue = data.emailValue
      this.passwordValue = data.passwordValue
    },
    setSupportStatus(status) {
      this.supportStatus = status
    },
    setDefaultValues() {
      this.profile = {}
      this.isAuthorized = false
      this.emailValue = ''
      this.passwordValue = ''
    }
  }
})
