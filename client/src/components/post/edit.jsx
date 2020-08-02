import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updatePost } from '../../services/postService';
import { updateGroupPost } from '../../services/groupService';

const EditPost = ({ post, refresh }) => {
  const [content, setContent] = useState(post.content);

  const handleChange = ({ currentTarget: textarea }) => {
    setContent(textarea.value);
  };

  const handleSave = async (event) => {
    try {
      event.preventDefault();
      const update = post.group
        ? () => updateGroupPost(post.group.link, post.link, content)
        : () => updatePost(post.link, content);

      const success = await update();
      if (success) refresh();
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    }
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
        />
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
