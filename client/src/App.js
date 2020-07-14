import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from './context/userContext';
import Signin from './components/auth/signin';
import Signup from './components/auth/signup';
import Forgot from './components/auth/forgot';
import Restore from './components/auth/restore';
import Signout from './components/auth/signout';
import Navbar from './components/navbar';
import ProtectedRoute from './components/common/protectedRoute';
import NotFound from './pages/notFound';
import UserPage from './pages/user';
import News from './pages/news';
import { getMe } from './services/apiService';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        setUser(await getMe());
      } catch ({ response }) {
        if (response) toast.info('Please login to view page content');
      } finally {
        setLoader(false);
      }
    };

    !user && fetchData();
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
            <ProtectedRoute path="/signout" component={Signout} />
            <ProtectedRoute path="/news" component={News} />
            <ProtectedRoute path="/chat" component={NotFound} />
            <ProtectedRoute path="/friends" component={NotFound} />
            <ProtectedRoute path="/group/:link" component={NotFound} />
            <ProtectedRoute path="/not-found" component={NotFound} />
            {user && <Redirect from="/" exact to={`/${user.link}`} />}
            <ProtectedRoute path="/:link" component={UserPage} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
      <ToastContainer autoClose={2500} />
    </UserContext.Provider>
  );
};

export default App;
