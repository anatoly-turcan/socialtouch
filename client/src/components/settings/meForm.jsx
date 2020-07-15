import React, { useState, Fragment, useContext } from 'react';
import { toast } from 'react-toastify';
import Form from '../common/form';
import Input from '../common/input';
import Loader from '../common/loader';
import userConstraints from '../../validators/userConstraints';
import { updateMe } from './../../services/apiService';
import UserContext from '../../context/userContext';

const MeForm = () => {
  const { user } = useContext(UserContext);
  const [loader, setLoader] = useState(false);

  const doSubmit = async (data) => {
    try {
      setLoader(true);
      const success = await updateMe(data);
      if (success) {
        toast.success('Data changed successfully');
        setTimeout(() => (window.location = '/settings'), 500);
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    } finally {
      setLoader(false);
    }
  };

  const init = {
    username: user.username,
    email: user.email,
    link: user.link,
  };

  return (
    <Form
      title="Me"
      doSubmit={doSubmit}
      init={init}
      constraints={userConstraints}
    >
      {(handleChange, data) => (
        <Fragment>
          {Object.keys(init).map((name) => {
            if (!data[name]) data[name] = '';
            return (
              <Fragment key={name}>
                <label htmlFor={name}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </label>
                <Input name={name} value={data[name]} onChange={handleChange} />
              </Fragment>
            );
          })}
          <button type="submit" className="btn btn-dark">
            {loader ? <Loader size={2} /> : 'Save'}
          </button>
        </Fragment>
      )}
    </Form>
  );
};

export default MeForm;
