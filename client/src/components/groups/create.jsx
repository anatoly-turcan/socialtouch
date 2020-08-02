import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Form from '../common/form';
import Input from '../common/input';
import Loader from '../common/loader';
import groupConstraints from '../../validators/groupConstraints';
import { createGroup } from '../../services/groupService';

const CreateGroup = () => {
  const history = useHistory();
  const [loader, setLoader] = useState(false);

  const init = {
    name: '',
    description: '',
  };

  const doSubmit = async (data) => {
    try {
      setLoader(true);
      const link = await createGroup(data);
      setLoader(false);
      if (link) {
        toast.success('Group has beed created');
        history.push(`/group/${link}`);
      }
    } catch ({ response }) {
      setLoader(false);
      if (response) toast.error(response.data.message);
    }
  };

  return (
    <Form
      title="Create a group"
      init={init}
      doSubmit={doSubmit}
      constraints={groupConstraints}
    >
      {(handleChange, data) => (
        <>
          <label htmlFor="name">Group name</label>
          <Input name="name" value={data.name} onChange={handleChange} />
          <label htmlFor="description">Group description</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-dark">
            {loader ? <Loader size={2} /> : 'Create'}
          </button>
        </>
      )}
    </Form>
  );
};

export default CreateGroup;
