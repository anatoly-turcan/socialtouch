import React, { useState } from 'react';
import { updatePost } from '../../services/apiService';

const EditPost = ({ post, refresh }) => {
  const [content, setContent] = useState(post.content);

  const handleChange = ({ currentTarget: textarea }) => {
    setContent(textarea.value);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const success = await updatePost(post.link, content);
    if (success) refresh();
  };

  return (
    <div className="post__box__edit w-100">
      <form onSubmit={handleSave}>
        <textarea
          name="content"
          id="content"
          className="pb-edit-area w-100"
          value={content}
          onChange={handleChange}
          autoFocus
        ></textarea>
        <div className="right">
          <button type="submit" className="btn-dark centered pb-edit-save-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
