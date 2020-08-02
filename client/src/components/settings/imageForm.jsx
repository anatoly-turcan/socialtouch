import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Form from '../common/form';
import Input from '../common/input';
import { updateMyImage } from '../../services/meService';
import Loader from '../common/loader';

const ImageForm = () => {
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
      const success = await updateMyImage(formData);
      if (success) {
        toast.info('Image successfully updated');
        setTimeout(() => {
          window.location = '/settings';
        }, 500);
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    } finally {
      setLoader(false);
    }
  };

  const init = {};

  return (
    <Form title="Update profile image" doSubmit={doSubmit} init={init}>
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
