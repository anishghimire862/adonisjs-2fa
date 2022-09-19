import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {

  public async run () {
    await User.createMany([
      {
        email: 'anish@cleavr.io',
        password: 'password',
        name: 'Anish Ghimire - Cleavr',
      },
      {
        email: 'anishghimire862@gmail.com',
        password: 'password',
        name: 'Anish Ghimire',
      }
    ])
  }

}
