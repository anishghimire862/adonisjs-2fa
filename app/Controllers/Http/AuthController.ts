import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
const twoFactor = require('node-2fa')

export default class AuthController {
  public async login({ request, response, auth, view, session }) 
    const { email, password } = request.only(['email', 'password'])
    try {
      const user = await auth.use('web').verifyCredentials(email, password)

      if (user.isTwoFactorEnabled) {
        session.put('login.id', user.id)
        return view.render('pages/two-factor-challenge')
      }

      session.forget('login.id')
      session.regenerate()
      await auth.login(user)
      response.redirect('/')
    } catch {
      return view.render('pages/login', {
        status: {
          type: 'error',
          message: 'Invalid credentials.',
        }
      })
    }
  }

  public async logout({ response, auth }) {
    await auth.logout()
    response.redirect('/login')
  }

  public async confirmPassword({ request, session, auth, view }) {
    const password = request.input('password')
    const user = auth.user!
    
    if (!(await Hash.verify(user.password, password))) {
      return view.render('pages/confirm-password', {
        status: {
          type: 'error',
          message: 'The provided password was incorrect.',
        },
        twoFactorEnabled: user?.isTwoFactorEnabled
      })  
    }
    session.put('password_confirmed_at', Date.now())

    return view.render('pages/settings', {
      status: {
        type: 'success',
        message: 'Password confirmed. You can now perform the action requiring password confirmation.',
      },
      twoFactorEnabled: user?.isTwoFactorEnabled
    })
  }

  public async twoFactorChallenge({ request, session, view, auth, response }) {
    const { code, recoveryCode } = request.only(['code', 'recoveryCode'])
    if (!session.has('login.id')) {
      return view.render('pages/two-factor-challenge', {
        status: {
          type: 'error',
          message: 'The provided two factor authentication code was invalid.'
        }
      })
    }

    const user = await User.query().where('id', session.get('login.id')).first()
    if (!user || !user.twoFactorSecret) {
      return view.render('pages/two-factor-challenge', {
        status: {
          type: 'error',
          message: 'Two factor authentication failed. Invalid user.'
        }
      })
    }

    session.forget('login.id')
    session.regenerate()

    if (code) {
      const isValid = await twoFactor.verifyToken(user.twoFactorSecret, code)
      if(isValid) {
        await auth.login(user)
        return response.redirect('/')
      }
    } else if (recoveryCode) {
      const codes = user?.twoFactorRecoveryCodes ?? []
      if (codes.includes(recoveryCode)) {
        user.twoFactorRecoveryCodes = codes.filter((c) => c !== recoveryCode)
        await user.save()
        await auth.login(user)
        return response.redirect('/')
      }
    }
  }
}
