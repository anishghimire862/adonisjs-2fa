import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, BaseModel, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Encryption from '@ioc:Adonis/Core/Encryption'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({
    serializeAs: null,
    prepare: (value: string) => Buffer.from(value).toString('base64'),
    consume: (value: string) => Buffer.from(value, 'base64').toString('utf8'),
  })
  public password: string

  @column()
  public email: string

  @column()
  public name: string

  @column({
    serializeAs: null,
    consume: (value: string) => (value ? JSON.parse(Encryption.decrypt(value) ?? '{}') : null),
    prepare: (value: string) => Encryption.encrypt(JSON.stringify(value)),
  })
  public twoFactorSecret?: string

  @column({
    serializeAs: null,
    consume: (value: string) => (value ? JSON.parse(Encryption.decrypt(value) ?? '[]') : []),
    prepare: (value: string[]) => Encryption.encrypt(JSON.stringify(value)),
  })
  public twoFactorRecoveryCodes?: string[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public get isTwoFactorEnabled() {
    return Boolean(this?.twoFactorSecret)
  }
}
