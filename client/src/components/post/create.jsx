import React, { useState, Fragment } from 'react';
import { toast } from 'react-toastify';
import Input from '../common/input';
import Loader from '../common/loader';

const CreatePost = ({ refresh, createMethod }) => {
  const [content, setContent] = useState('');
  const [loader, setLoader] = useState(false);
  const [photo, setPhoto] = useState([]);

  const handleChangeImage = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleChange = ({ currentTarget: input }) => {
    setContent(input.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append('content', content);
    data.append('photo', photo);

    try {
      setLoader(true);

      const success = await createMethod(data);
      if (success) refresh();

      setContent('');
      setPhoto([]);
    } catch ({ response }) {
      toast.error(response.data.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="post__box">
      <form
        className="create-new-post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        {loader && <Loader size={5} w100 />}
        {!loader && (
          <Fragment>
            <div className="create-new-post__title centered">New post</div>

            <div className="create-new-post__add-photo ">
              <label htmlFor="photo" className="create-new-post__photo">
                <Input name="photo" type="file" onChange={handleChangeImage} />
                <i className="ri-image-add-fill"></i>
              </label>
            </div>

            <div className="create-new-post__content">
              <Input
                name="content"
                type="text"
                placeholder="What's new?"
                autoComplete="off"
                value={content}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="create-new-post__button centered">
              <i className="ri-send-plane-fill"></i>
            </button>
          </Fragment>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
