import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import GroupContext from '../../context/groupContext';
import Loader from '../common/loader';
import Form from '../common/form';
import { deleteGroup } from '../../services/apiService';

const DeleteGroup = () => {
  const history = useHistory();
  const { group } = useContext(GroupContext);
  const [loader, setLoader] = useState(false);

  const doSubmit = async () => {
    try {
      setLoader(true);
      const success = await deleteGroup(group.link);
      if (success) {
        toast.success('Your group has been successfully deleted');
        history.replace('/groups');
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <Form title="Delete group" doSubmit={doSubmit}>
      {() => (
        <div className="settings__delete">
          <span>Are you sure?</span>
          <button type="submit" className="btn btn-danger">
            {loader ? <Loader size={2} /> : 'Delete'}
          </button>
        </div>
      )}
    </Form>
  );
};

export default DeleteGroup;
