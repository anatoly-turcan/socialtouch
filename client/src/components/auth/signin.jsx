import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../../context/userContext';
import Form from './form';
import AuthPage from '../../pages/auth';
import Input from '../common/input';
import { signin } from '../../services/authService';

const Signin = ({ history }) => {
  const { user: currentUse, setUser } = useContext(UserContext);

  if (currentUse) return <Redirect to="/" />;

  const handleSubmit = async (data) => {
    const user = await signin(data);
    setUser(user);
    history.replace(`/${user.link}`);
  };

  return (
    <AuthPage>
      <Form
        title="Sign in"
        btn="Sign in"
        reverse={{ title: 'Sign up', link: '/signup' }}
        init={{ email: '', password: '' }}
        handleSubmit={handleSubmit}
      >
        {(handleChange, data) => (
          <>
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
          </>
        )}
      </Form>
    </AuthPage>
  );
};

export default Signin;
