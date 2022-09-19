const twoFactor = require('node-2fa')
import cryptoRandomString from 'crypto-random-string'
import QRCode from 'qrcode'
import Config from '@ioc:Adonis/Core/Config'
import User from 'App/Models/User'

class TwoFactorAuthProvider {
  private issuer = Config.get('twoFactorAuthConfig.app.name') || 'adonisjs-2fa'

  public generateSecret(user: User) {
    const secret = twoFactor.generateSecret({
      name: this.issuer,
      account: user.email,
    })
    return secret.secret
  }

  public async generateRecoveryCodes() {
    const codes: string[] = []
    for (let i = 0; i < 8; i++) {
      codes.push(`${await this.secureRandomString()}-${await this.secureRandomString()}`)
    }
    return codes
  }

  public async secureRandomString() {
    return cryptoRandomString.async({ length: 10, type: 'hex' })
  }

  public async generateQrCode(user: User) {
    const appName = encodeURIComponent(this.issuer)
    const userName = encodeURIComponent(user.email)
    const query = `?secret=${user.twoFactorSecret}&issuer=${appName}`
    const url = `otpauth://totp/${appName}${userName}${query}`
    const svg = await QRCode.toDataURL(url)
    return { svg, url }
  }

}

export default new TwoFactorAuthProvider()
