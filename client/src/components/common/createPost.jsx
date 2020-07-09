import React, { useState } from 'react';
import Input from './input';
import api from '../../services/apiService';

const CreatePost = ({ addPost }) => {
  const [content, setContent] = useState('');
  const [loader, setLoader] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setContent(input.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      const post = await api.createPost(content);
    } catch (error) {}
    setContent('');
    setLoader(false);
  };

  return (
    <div className="post__box">
      <form
        className="create-new-post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <div className="create-new-post__title centered">New post</div>

        <div className="create-new-post__add-photo ">
          <label htmlFor="photo" className="create-new-post__photo">
            <Input name="photo" type="file" />
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
          {!loader && <i className="ri-send-plane-fill"></i>}
          {loader && <i className="ri-loader-4-fill loading-animation"></i>}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
