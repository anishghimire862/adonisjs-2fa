import TwoFactorAuthProvider from 'App/Services/TwoFactorAuthProvider'

export default class UserController {
  public async enableTwoFactorAuthentication({ auth, view }) {
    const user = auth?.user

    user.twoFactorSecret = TwoFactorAuthProvider.generateSecret(user)
    user.twoFactorRecoveryCodes = await TwoFactorAuthProvider.generateRecoveryCodes()
    await user.save()
  
    return view.render('pages/settings', {
      status: {
        type: 'success',
        message: 'Two factor authentication enabled.',
      },
      twoFactorEnabled: user.isTwoFactorEnabled,
      code: await TwoFactorAuthProvider.generateQrCode(user)
    })
  }

  public async disableTwoFactorAuthentication({ auth, view }) {
    const user = auth?.user

    user.twoFactorSecret = null
    user.twoFactorRecoveryCodes = null
    await user.save()
    return view.render('pages/settings', {
      status: {
        type: 'success',
        message: 'Two factor authentication disabled.',
      },
      twoFactorEnabled: user.isTwoFactorEnabled,
    })
  }

  public async fetchRecoveryCodes({ auth, view }) {
    const user = auth?.user

    return view.render('pages/settings', {
      twoFactorEnabled: user.isTwoFactorEnabled,
      recoveryCodes: user.twoFactorRecoveryCodes
    })
  }
}
