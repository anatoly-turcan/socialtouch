import React, { useState, useContext } from 'react';
import Form from './form';
import AuthPage from '../../pages/auth';
import Input from './input';
import api from '../../services/apiService';
import UserContext from '../../context/userContext';
import constraints from './constraints';
import validate from '../../utils/validate';
import { Redirect } from 'react-router-dom';

const Signup = ({ history }) => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);

  if (user) return <Redirect to="/" />;

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validate(data, constraints);
    if (validation) return setError(validation);

    try {
      setLoader(true);
      setError(false);
      const user = await api.signup(data);
      localStorage.setItem('user', 'true');
      window.location = `/${user.link}`;
    } catch ({ response }) {
      setError(response && response.data.message);
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
        loader={loader}
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
