import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MathJax3Config, MathJaxContext } from 'better-react-mathjax';
// import { UserProvider } from './contexts/UserContext';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      retry: 3
    }
  }
});

const config: MathJax3Config = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)']
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]']
    ]
  }
};
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MathJaxContext config={config}>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
        authorizationParams={{
          redirect_uri: import.meta.env.VITE_CALLBACK_URL as string,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE as string
        }}
      >
        <QueryClientProvider client={client}>
          {/* <UserProvider> */}
          <App />
          {/* </UserProvider> */}
        </QueryClientProvider>
      </Auth0Provider>
    </MathJaxContext>
  </React.StrictMode>
);
