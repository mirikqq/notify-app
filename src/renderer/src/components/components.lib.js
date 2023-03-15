import M2Input from './ui/m2-input.vue'
import Auth from './@core/userActions/auth.vue'
import M2Button from './ui/m2-button.vue'
import UserView from './@core/layout/userView.vue'
import UserProfile from './@core/user/userProfile.vue'
import Logout from './ui/m2-logout.vue'
import WelcomeMsg from './@core/user/userWelcome.vue'
import Collapse from './ui/m2-tray.vue'
import MicroSipStatus from './ui/m2-ms-status.vue'

export default [
  M2Input,
  Auth,
  M2Button,
  UserView,
  UserProfile,
  Logout,
  WelcomeMsg,
  Collapse,
  MicroSipStatus
]
