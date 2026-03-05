import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import './index.css'
import App from './App.jsx'

// Configure Amplify Auth with Cognito
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_GK1222B0A',
      userPoolClientId: '378ehvma5q0935irn57g183o5v',
      loginWith: {
        oauth: {
          domain: 'hackathon-sezzle.auth.us-west-2.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [
            'http://localhost:5173/',
            'https://main.d1z1d2hxf7e8ss.amplifyapp.com/'
          ],
          redirectSignOut: [
            'http://localhost:5173/',
            'https://main.d1z1d2hxf7e8ss.amplifyapp.com/'
          ],
          responseType: 'code',
        }
      }
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
