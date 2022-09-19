import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GuestRoute {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { auth, response } = ctx
    if (await auth.check()) {
      return response.redirect().toRoute('/')
    }
    return await next()
  }
}
