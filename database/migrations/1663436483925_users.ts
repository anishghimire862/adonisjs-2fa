import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('password', 180).notNullable()
      table.string('email', 255).unique().notNullable()
      table.string('name', 255).notNullable()
      table.text('two_factor_secret').nullable();
      table.text('two_factor_recovery_codes').nullable();

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
