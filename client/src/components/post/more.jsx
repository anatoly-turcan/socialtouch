import React from 'react';

const PostMore = ({ children, goBack }) => {
  return (
    <div className="post__box post__box-more">
      <button className="btn btn-light post__box-more-btn" onClick={goBack}>
        Go back
      </button>
      {children}
    </div>
  );
};

export default PostMore;
