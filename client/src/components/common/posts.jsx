import React from 'react';
import PostBox from './postBox';

const Posts = ({ posts, handleLoadMore }) => {
  return (
    <div className="posts">
      {posts.length ? (
        posts.map((post) => <PostBox post={post} key={Math.random()} />)
      ) : (
        <div className="centered-info">No posts</div>
      )}
      <div className="post__box">
        {posts.length > 0 && posts.length % 10 === 0 && (
          <button className="post__box--load-more" onClick={handleLoadMore}>
            Load more
          </button>
        )}
      </div>
    </div>
  );
};

export default Posts;
