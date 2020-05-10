// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '9p463u8a8d'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
                            

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-srbdleo3.auth0.com',            // Auth0 domain
  clientId: 'cKgM5WSQ0ncFfe5GehOj1NqL7An7J95c',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
