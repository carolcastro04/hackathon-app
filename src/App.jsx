import { useState } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <AuthenticatedApp user={user} signOut={signOut} />
      )}
    </Authenticator>
  )
}

function AuthenticatedApp({ user, signOut }) {
  const [count, setCount] = useState(0)

  return (
    <>
      <div style={{ position: 'absolute', top: 10, right: 10, textAlign: 'right' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
          Welcome, <strong>{user.signInDetails?.loginId || user.username}</strong>
        </p>
        <button onClick={signOut} style={{ fontSize: '12px', padding: '6px 12px' }}>
          Sign Out
        </button>
      </div>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Sezzle Hackathon</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        🔐 Authenticated with Cognito + Google SSO
      </p>
      <p style={{ fontSize: '12px', opacity: 0.7 }}>
        Backend API: https://992mv9ipta.us-west-2.awsapprunner.com
      </p>
    </>
  )
}

export default App
