import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserContext from './../../context/userContext';

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
  const { user } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user)
          return (
            <Redirect
              to={{
                pathname: '/signin',
                state: { from: props.location },
              }}
            />
          );

        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
