export const environment = {
  production: true,
  baseUrl: window.location.origin + `/api/`,
  b2clogin: false,
  signUpSignInPolicy: 'b2c_1_SignIn',

  authority: window.location.origin.includes('deploymentanalyzer.azurewebsites.net')
    ? 'https://deploymentanalyzerprodb2c.b2clogin.com/deploymentanalyzerprodb2c.onmicrosoft.com/b2c_1_SignIn'
    : 'https://deploymentanalyzerb2c.b2clogin.com/deploymentanalyzerb2c.onmicrosoft.com/b2c_1_SignIn',
  authorityDomain: window.location.origin.includes('deploymentanalyzer.azurewebsites.net')
    ? 'deploymentanalyzerprodb2c.b2clogin.com'
    : 'deploymentanalyzerb2c.b2clogin.com',
  clientId: window.location.origin.includes('deploymentanalyzer.azurewebsites.net')
    ? '33363eb6-f3e0-44ce-acde-1660a4bcf8df'
    : 'ae945a14-7001-4ff5-8ac8-2ac290d0f980',
  scope: window.location.origin.includes('deploymentanalyzer.azurewebsites.net')
    ? ''
    : 'https://deploymentanalyzerb2c.onmicrosoft.com/dev/deploymentanalyzer/api/Files.read',
  endpoint: window.location.origin + `/api`
};
