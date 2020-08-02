import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../../context/userContext';
import Form from './form';
import AuthPage from '../../pages/auth';
import Input from '../common/input';
import { signup } from '../../services/authService';

const Signup = ({ history }) => {
  const { user: currentUser, setUser } = useContext(UserContext);

  if (currentUser) return <Redirect to="/" />;

  const handleSubmit = async (data) => {
    const user = await signup(data);
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
          <>
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
          </>
        )}
      </Form>
    </AuthPage>
  );
};

export default Signup;
