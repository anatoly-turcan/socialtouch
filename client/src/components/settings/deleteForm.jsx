import React from 'react';
import SettingsForm from './form';
import Loader from '../common/loader';
import { useState } from 'react';
import { deleteMe } from '../../services/apiService';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const DeleteForm = () => {
  const history = useHistory();
  const [loader, setLoader] = useState(false);

  const doSubmit = async () => {
    try {
      setLoader(true);
      const success = await deleteMe();
      if (success) {
        toast.success('Your account has been successfully deleted');
        history.replace('/signout');
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <SettingsForm title="Delete account" doSubmit={doSubmit}>
      {() => (
        <div className="settings__delete">
          <span>Are you sure?</span>
          <button type="submit" className="btn btn-danger">
            {loader ? <Loader size={2} /> : 'Delete'}
          </button>
        </div>
      )}
    </SettingsForm>
  );
};

export default DeleteForm;
