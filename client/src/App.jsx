import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import WebFont from 'webfontloader';
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
import Friends from './pages/friends';
import Groups from './pages/groups';
import News from './pages/news';
import Settings from './pages/settings';
import Group from './pages/group';
import Chat from './pages/chat';
import { getMe } from './services/meService';
import 'react-toastify/dist/ReactToastify.css';
import 'remixicon/fonts/remixicon.css';
import './App.css';

WebFont.load({
  google: {
    families: ['Roboto:400,500,900', 'sans-serif'],
  },
});

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

    if (!user) fetchData();
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
            <Route path="/restore/:token" component={Restore} />
            <ProtectedRoute path="/signout" component={Signout} />
            <ProtectedRoute path="/settings" component={Settings} />
            <ProtectedRoute path="/news" component={News} />
            <ProtectedRoute path="/chat" component={Chat} />
            <ProtectedRoute path="/friends" component={Friends} />
            <ProtectedRoute path="/groups" component={Groups} />
            <ProtectedRoute path="/group/:link" component={Group} />
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
