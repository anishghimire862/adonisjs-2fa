import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'

export default class RequirePassword {
  public async handle({ session, response }: HttpContextContract, next: () => Promise<void>) {
    const diffInSecs = (Date.now() - session.get('password_confirmed_at', 0)) / 1000
    const passwordConfirmedTimeout = Config.get('twoFactorAuthConfig.auth.passwordConfirmedTimeout')
    const shouldAskPasswordConfirmation = diffInSecs > passwordConfirmedTimeout

    if (shouldAskPasswordConfirmation) {
      return response.redirect('/confirm-password')
    } else {
      await next()
    }
  }
}
