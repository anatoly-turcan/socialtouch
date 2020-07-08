import React, { useContext, Fragment } from 'react';
import Form from './form';
import AuthPage from '../../pages/auth';
import Input from './input';
import api from '../../services/apiService';
import UserContext from '../../context/userContext';
import { Redirect } from 'react-router-dom';

const Signin = ({ history }) => {
  const { user: currentUse, setUser } = useContext(UserContext);

  if (currentUse) return <Redirect to="/" />;

  const handleSubmit = async (data) => {
    const user = await api.signin(data);
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
          <Fragment>
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
          </Fragment>
        )}
      </Form>
    </AuthPage>
  );
};

export default Signin;
