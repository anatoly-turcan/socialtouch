import React, { Fragment, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import GroupContext from '../../context/groupContext';
import Form from '../common/form';
import Input from '../common/input';
import Loader from '../common/loader';
import groupConstraints from '../../validators/groupConstraints';
import { updateGroup } from '../../services/apiService';

const InfoForm = () => {
  const { group, setGroup } = useContext(GroupContext);
  const [loader, setLoader] = useState(false);

  const doSubmit = async (data) => {
    try {
      setLoader(true);
      const success = await updateGroup(group.link, data);
      if (success) {
        toast.success('Data changed successfully');
        const updatedGroup = { ...group };
        if (data.name) updatedGroup.name = data.name;
        if (data.description) updatedGroup.description = data.description;
        setTimeout(() => (window.location = `/group/${group.link}`), 500);
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    } finally {
      setLoader(false);
    }
  };

  const init = {
    name: group.name,
    description: group.description,
  };

  return (
    <Form
      title="Edit info"
      doSubmit={doSubmit}
      init={init}
      constraints={groupConstraints}
    >
      {(handleChange, data) => (
        <Fragment>
          <Input
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Group name"
            autoComplete="off"
          />
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Group description"
          />
          <button type="submit" className="btn btn-dark">
            {loader ? <Loader size={2} /> : 'Save'}
          </button>
        </Fragment>
      )}
    </Form>
  );
};

export default InfoForm;
