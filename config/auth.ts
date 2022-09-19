import { AuthConfig } from '@ioc:Adonis/Addons/Auth'

const authConfig: AuthConfig = {
  guard: 'web',
  guards: {
    web: {
      driver: 'session',

      provider: {
        driver: 'lucid',
        identifierKey: 'id',

        uids: ['email'],

        model: () => import('App/Models/User'),
      },
    },
  },
}

export default authConfig
