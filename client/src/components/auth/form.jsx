import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Form = ({
  title,
  reverse,
  reverseLink,
  children,
  btn,
  onSubmit,
  error,
}) => {
  return (
    <Fragment>
      <div className="block__header">
        <div className="block__header-el">{title}</div>
        {reverse && (
          <Link to={reverseLink} className="block__header-el reverse">
            {reverse}
          </Link>
        )}
      </div>
      {error && <div className="block__error">{error}</div>}
      <div className="block__content">
        <form className="form" onSubmit={onSubmit}>
          {children}
          <div className="form__actions">
            {title === 'Sign in' && <Link to="/forgot">Forgot password</Link>}
            <button type="submit">{!btn ? title : btn}</button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Form;
