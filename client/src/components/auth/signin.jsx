import React, { useState, useContext } from 'react';
import Form from './form';
import AuthPage from './authPage';
import Input from './input';
import auth from '../../services/authService';
import UserContext from '../../context/userContext';

const Signin = ({ history }) => {
  const { user, setUser } = useContext(UserContext);

  if (user) history.replace(`/${user.link}`);

  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await auth.signin(data.email, data.password);
      const { user: currentUser } = result.data.data;
      localStorage.setItem('user', JSON.stringify(currentUser));
      setUser(currentUser);
      history.replace(`/${currentUser.link}`);
    } catch ({ response }) {
      setError(response.data.message);
    }
  };

  return (
    <AuthPage>
      <Form
        title="Sign in"
        reverse="Sign up"
        reverseLink="/signup"
        onSubmit={handleSubmit}
        error={error}
      >
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={data.password}
        />
      </Form>
    </AuthPage>
  );
};

export default Signin;
