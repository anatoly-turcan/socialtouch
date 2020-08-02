import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import GroupContext from '../../context/groupContext';
import Form from '../common/form';
import Loader from '../common/loader';
import Input from '../common/input';
import { updateGroupImage } from '../../services/groupService';

const ImageForm = () => {
  const { group } = useContext(GroupContext);
  const [loader, setLoader] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleChangeImage = ({ target }) => {
    setPhoto(target.files[0]);
  };

  const doSubmit = async () => {
    const formData = new FormData();
    formData.append('photo', photo);

    try {
      setLoader(true);
      const success = await updateGroupImage(group.link, formData);
      if (success) {
        toast.info('Image successfully updated');
        setTimeout(() => {
          window.location = `/group/${group.link}`;
        }, 500);
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <Form title="Update image" doSubmit={doSubmit} init={{}}>
      {() => (
        <div className="settings__image">
          <label htmlFor="image" className="btn btn-light clickable">
            Select image
          </label>
          <Input name="image" type="file" onChange={handleChangeImage} />
          <button type="submit" className="btn btn-dark">
            {loader ? <Loader size={2} /> : 'Save'}
          </button>
        </div>
      )}
    </Form>
  );
};

export default ImageForm;
