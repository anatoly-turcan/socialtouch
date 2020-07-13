import React from 'react';

const PostFull = ({ post }) => {
  return (
    <div>
      <div className="post__full--content">{post.content}</div>
    </div>
  );
};

export default PostFull;
