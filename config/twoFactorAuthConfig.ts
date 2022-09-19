const TwoFactorAuthConfig  = {
  app: {
    name: 'adonisjs-2fa'
  },
  auth: {
    passwordConfirmedTimeout: 60 * 5, // 5 minutes
  },
}

export default TwoFactorAuthConfig
