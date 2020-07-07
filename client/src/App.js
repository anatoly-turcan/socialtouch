import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NotFound from './pages/notFound';
import Signin from './components/auth/signin';
import Signup from './components/auth/signup';
import Forgot from './components/auth/forgot';
import Restore from './components/auth/restore';
import Signout from './components/auth/signout';
import Navbar from './components/navbar';
import UserContext from './context/userContext';
import UserPage from './pages/user';
import './App.css';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="container">
        <Navbar />
        <div className="content">
          <Switch>
            {!user && <Route path="/signin" component={Signin} />}
            {!user && <Route path="/signup" component={Signup} />}
            {!user && <Route path="/forgot" component={Forgot} />}
            {!user && <Route path="/restore" component={Restore} />}
            {!user && <Redirect to="/signin" />}

            <Route path="/signout" component={Signout} />
            <Route path="/not-found" component={NotFound} />
            <Route path="/:link" component={UserPage} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;
