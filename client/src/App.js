import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import api from './services/apiService';
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
import ProtectedRoute from './components/common/protectedRoute';

const App = () => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        localStorage.getItem('user') && setUser(await api.getMe());
      } catch (error) {
        setUser(null);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, []);

  if (loader) return <div className="global-loader">Loading...</div>;

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
            {!user && <Redirect to={`/signin`} />}
            <ProtectedRoute path="/signout" component={Signout} />
            <ProtectedRoute path="/not-found" component={NotFound} />
            {user && <Redirect from="/" exact to={`/${user.link}`} />}
            <ProtectedRoute path="/:link" component={UserPage} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;
