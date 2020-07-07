import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NotFound from './components/notFound';
import Signin from './components/auth/signin';
import Signup from './components/auth/signup';
import Forgot from './components/auth/forgot';
import Restore from './components/auth/restore';
import Navbar from './components/navbar';
import UserContext from './context/userContext';

import './App.css';
import ProtectedRoute from './components/common/protectedRoute';
import UserPage from './components/userPage';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="container">
        <Navbar />
        <div className="content">
          <Switch>
            <Route path="/signin" component={Signin} />
            <Route path="/signup" component={Signup} />
            <Route path="/forgot" component={Forgot} />
            <Route path="/restore" component={Restore} />
            <Route path="/not-found" component={NotFound} />
            <ProtectedRoute path="/:link" component={UserPage} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;
