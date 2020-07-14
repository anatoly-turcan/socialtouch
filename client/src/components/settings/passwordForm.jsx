import React, { useState, Fragment } from 'react';
import { toast } from 'react-toastify';
import SettingsForm from './form';
import Input from '../common/input';
import Loader from '../common/loader';
import userConstraints from '../../validators/userConstraints';
import { updatePassword } from './../../services/apiService';

const PasswordForm = () => {
  const [loader, setLoader] = useState(false);

  const doSubmit = async (data, clearFields) => {
    try {
      setLoader(true);
      const success = await updatePassword(data);
      if (success) {
        toast.success('Password changed successfully');
        clearFields();
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    } finally {
      setLoader(false);
    }
  };

  const init = {
    password: '',
    newPassword: '',
    passwordConfirm: '',
  };

  userConstraints.passwordConfirm.equality.attribute = 'newPassword';

  return (
    <SettingsForm
      title="New password"
      doSubmit={doSubmit}
      init={init}
      constraints={userConstraints}
    >
      {(handleChange, data) => (
        <Fragment>
          <label htmlFor="password">Current password</label>
          <Input
            name="password"
            type="password"
            placeholder="Current password"
            value={data.password}
            onChange={handleChange}
          />
          <label htmlFor="newPassword">New password</label>
          <Input
            name="newPassword"
            type="password"
            placeholder="New password"
            value={data.newPassword}
            onChange={handleChange}
          />
          <label htmlFor="passwordConfirm">Confirm new password</label>
          <Input
            name="passwordConfirm"
            type="password"
            placeholder="Confirm new password"
            value={data.passwordConfirm}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-dark">
            {loader ? <Loader size={2} /> : 'Save'}
          </button>
        </Fragment>
      )}
    </SettingsForm>
  );
};

export default PasswordForm;
