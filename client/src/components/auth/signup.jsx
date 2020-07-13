import React, { useContext, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../../context/userContext';
import Form from './form';
import AuthPage from '../../pages/auth';
import Input from '../common/input';
import api from '../../services/apiService';

const Signup = ({ history }) => {
  const { user: currentUser, setUser } = useContext(UserContext);

  if (currentUser) return <Redirect to="/" />;

  const handleSubmit = async (data) => {
    const user = await api.signup(data);
    setUser(user);
    history.replace(`/${user.link}`);
  };

  return (
    <AuthPage>
      <Form
        title="Sign up"
        btn="Sign up"
        reverse={{ title: 'Sign in', link: '/signin' }}
        init={{ username: '', email: '', password: '', passwordConfirm: '' }}
        handleSubmit={handleSubmit}
      >
        {(handleChange, data) => (
          <Fragment>
            <Input
              name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              value={data.username}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              value={data.email}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              value={data.password}
            />
            <Input
              name="passwordConfirm"
              type="password"
              placeholder="Confirm password"
              onChange={handleChange}
              value={data.passwordConfirm}
            />
          </Fragment>
        )}
      </Form>
    </AuthPage>
  );
};

export default Signup;
