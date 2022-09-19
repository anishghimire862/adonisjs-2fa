import Route from '@ioc:Adonis/Core/Route'

Route.get('/login', async ({ view }) => {
  return view.render('pages/login')
}).middleware('guestRoute')

Route.get('/', async ({ view }) => {
  return view.render('pages/home') 
}).middleware('auth')

Route.get('/settings', async ({ view, auth }) => {
  return view.render('pages/settings', {
    twoFactorEnabled: auth.user?.isTwoFactorEnabled
  })
}).middleware('auth')

Route.get('/confirm-password', async ({ view }) => {
  return view.render('pages/confirm-password')
}).middleware('auth')

Route.post('/confirm-password', 'AuthController.confirmPassword').middleware('auth')

Route.group(() => {
  Route.post('/enable-two-factor-authentication', 'UserController.enableTwoFactorAuthentication')
})
  .middleware(['auth', 'passwordConfirm'])

Route.group(() => {
  Route.post('/disable-two-factor-authentication', 'UserController.disableTwoFactorAuthentication')
})
  .middleware(['auth', 'passwordConfirm'])
Route.group(() => {
  Route.get('/fetch-recovery-codes', 'UserController.fetchRecoveryCodes')
})
  .middleware(['auth', 'passwordConfirm'])
Route.get('/two-factor-challenge', async ({ view }) => {
  return view.render('pages/two-factor-challenge')
})
Route.post('/two-factor-challenge', 'AuthController.twoFactorChallenge')

Route.post('/login', 'AuthController.login')
Route.post('/logout', 'AuthController.logout')