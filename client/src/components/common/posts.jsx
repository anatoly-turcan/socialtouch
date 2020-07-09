import React, { useState, useEffect } from 'react';
import PostBox from './postBox';

const Posts = ({ fetchMethod }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [isAll, setIsAll] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoader(true);
      const newPosts = await fetchMethod(page);
      if (!newPosts.length) setIsAll(true);
      else setPosts([...posts, ...newPosts]);
      setLoader(false);
    };
    fetchPosts();
  }, [page]);

  const handleLoadMore = (event) => {
    event.preventDefault();
    setPage(page + 1);
  };

  return (
    <div className="posts">
      {posts.length ? (
        posts.map((post) => <PostBox post={post} key={Math.random()} />)
      ) : (
        <div className="centered-info">No posts</div>
      )}

      {loader && (
        <div className="post__box">
          <div className="post__box--load-more centered">Loading...</div>
        </div>
      )}

      {!loader && !isAll && posts.length > 0 && posts.length % 10 === 0 && (
        <div className="post__box">
          <button className="post__box--load-more" onClick={handleLoadMore}>
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;
