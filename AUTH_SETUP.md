# Authentication Setup - Cognito + Google SSO

## ✅ Configuration Complete

### Cognito Details
- **User Pool ID:** us-west-2_GK1222B0A
- **Client ID:** 378ehvma5q0935irn57g183o5v
- **Auth Domain:** hackathon-sezzle.auth.us-west-2.amazoncognito.com
- **Identity Provider:** Google (Internal - @sezzle.com only)

### OAuth Configuration
- **Flow:** Authorization Code
- **Scopes:** openid, email, profile
- **Redirect URIs:**
  - http://localhost:5173/ (development)
  - https://main.d1z1d2hxf7e8ss.amplifyapp.com/ (production)

## 🚀 Testing Authentication

### Production (Already Deployed)
1. Go to: https://main.d1z1d2hxf7e8ss.amplifyapp.com/
2. Click "Sign in with Google"
3. Login with your @sezzle.com Google account
4. You'll be redirected back to the app, authenticated!

### Local Development
```bash
cd ~/hackathon/hackathon-app
npm run dev
```

1. Open: http://localhost:5173/
2. Click "Sign in with Google"
3. Login with your @sezzle.com account
4. Get redirected back to localhost

## 🔐 How It Works

1. User clicks "Sign in"
2. Redirects to Cognito Hosted UI
3. User clicks "Continue with Google"
4. Google OAuth (restricted to @sezzle.com)
5. Cognito issues JWT tokens
6. User redirected back to your app with tokens
7. Amplify Auth manages token refresh automatically

## 📝 User Information

The authenticated user object contains:
- `user.username` - Cognito username
- `user.signInDetails.loginId` - Email address
- `user.userId` - User ID
- JWT tokens (handled automatically by Amplify)

## 🛠️ Customizing the UI

### Using the Default Authenticator
The app uses `@aws-amplify/ui-react` Authenticator component with default styling.

### Custom UI
If you want a custom login UI instead:

```jsx
import { signInWithRedirect } from 'aws-amplify/auth';

function CustomLoginButton() {
  return (
    <button onClick={() => signInWithRedirect({ provider: 'Google' })}>
      Sign in with Google
    </button>
  );
}
```

## 🔄 Sign Out

```jsx
import { signOut } from 'aws-amplify/auth';

<button onClick={() => signOut()}>Sign Out</button>
```

## 🔗 Protecting Backend Routes

### Getting the JWT Token
```javascript
import { fetchAuthSession } from 'aws-amplify/auth';

async function callProtectedAPI() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  const response = await fetch('https://992mv9ipta.us-west-2.awsapprunner.com/api/protected', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
}
```

### Validating Tokens in Backend (Node.js)
```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_GK1222B0A/.well-known/jwks.json'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      algorithms: ['RS256'],
      issuer: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_GK1222B0A'
    }, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

// In your Express middleware:
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

## 📚 Resources

- [AWS Amplify Auth Docs](https://docs.amplify.aws/react/build-a-backend/auth/)
- [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [JWT Token Validation](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html)

## 🐛 Troubleshooting

### "Redirect URI mismatch"
Make sure your URL exactly matches one of the configured redirect URIs (including trailing slash).

### "User is not authorized"
Only @sezzle.com Google Workspace accounts can sign in (configured in Cognito).

### "Token expired"
Amplify automatically refreshes tokens. If you see this error, call `fetchAuthSession()` to get fresh tokens.

### Testing locally with HTTPS
If you need HTTPS locally (e.g., for testing secure cookies):
```bash
npm install -D @vitejs/plugin-basic-ssl
```

Add to `vite.config.js`:
```js
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [react(), basicSsl()]
}
```

---

Built for Sezzle Hackathon 2026 🔐
