import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ApolloProvider } from '@apollo/client/react'
import { Provider } from 'react-redux'
import { AuthProvider } from './contexts/AuthContext'
import { apolloClient } from './graphql/apolloClient'
import { store } from './store'
import { Toaster } from 'sonner'
import { setupFetchInterceptor } from './utils/fetchInterceptor'
import './index.css'
import App from './App.tsx'

// Setup global fetch error handling via Sonner
setupFetchInterceptor();

// Mount the app with global providers (Redux, Apollo, auth, routing).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster richColors position='top-right' />
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ApolloProvider>
    </Provider>
  </StrictMode>,
)
