import React, { useState, useContext } from 'react';
import Form from './form';
import AuthPage from './authPage';
import Input from './input';
import auth from '../../services/authService';
import UserContext from '../../context/userContext';
import constraints from './constraints';
import validate from '../../utils/validate';

const Signup = ({ history }) => {
  const { setUser } = useContext(UserContext);
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validate(data, constraints);
    if (validation) return setError(validation);

    try {
      const result = await auth.signup(data);
      const { user } = result.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      history.replace(`/${user.link}`);
    } catch ({ response }) {
      setError(response.data.message);
    }
  };

  return (
    <AuthPage>
      <Form
        title="Sign up"
        reverse="Sign in"
        reverseLink="/signin"
        onSubmit={handleSubmit}
        error={error}
      >
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
      </Form>
    </AuthPage>
  );
};

export default Signup;
