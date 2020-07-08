import React, { useState, useContext } from 'react';
import AuthPage from '../../pages/auth';
import Form from './form';
import Input from './input';
import api from '../../services/apiService';
import constraints from './constraints';
import validate from '../../utils/validate';
import UserContext from './../../context/userContext';
import { Redirect } from 'react-router-dom';

const Forgot = (props) => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState({ email: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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
      const result = await api.forgotPassword(data);
      setMessage(result.data.message);
    } catch ({ response }) {
      setError(response && response.data.message);
    }
  };

  return (
    <AuthPage>
      {message ? (
        <p className="block__result-message">{message}</p>
      ) : (
        <Form
          title="Forgot password"
          btn="Reset"
          reverse="Sign in"
          reverseLink="/signin"
          onSubmit={handleSubmit}
          error={error}
          loader={loader}
        >
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
          />
        </Form>
      )}
    </AuthPage>
  );
};

export default Forgot;
