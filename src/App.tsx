import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Editor from './pages/Editor';
import PostView from './pages/PostView';

const AUTH0_DOMAIN =  ;
const AUTH0_CLIENT_ID =  ;

function App() {
  return (
    <Auth0Provider
    domain="dev-cxl02yjhp2qzyvtl.us.auth0.com"
    clientId="ouRpw1osvoPmWBg6S3rAL9EUZqiKKver"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/new" element={<Editor />} />
            <Route path="/edit/:id" element={<Editor />} />
            <Route path="/post/:id" element={<PostView />} />
          </Route>
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;