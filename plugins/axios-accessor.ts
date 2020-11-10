import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

declare module 'vue/types/vue' {
  interface Vue {
    $toast: any
  }
}

const accessor: Plugin = ({ $axios }) => {
  initializeAxios($axios)
}

export default accessor