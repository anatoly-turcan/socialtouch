import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loader from './common/loader';
import PostBox from './post/box';
import CreatePost from './post/create';

const Posts = ({ fetchMethod, isMe }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [isAll, setIsAll] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoader(true);
        const newPosts = await fetchMethod(page);

        if (!newPosts.length) setIsAll(true);
        else setPosts([...posts, ...newPosts]);
      } catch ({ response }) {
        if (response) toast.error(response.data.message);
      } finally {
        setLoader(false);
      }
    };
    fetchPosts();
  }, [page]);

  const handleLoadMore = (event) => {
    event.preventDefault();
    setPage(page + 1);
  };

  const refresh = async () => {
    try {
      if (page !== 1) {
        setPosts([]);
        setPage(1);
      } else {
        setPosts(await fetchMethod(page));
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    }
  };

  return (
    <div className="posts">
      {isMe && <CreatePost refresh={refresh} />}

      {posts.length
        ? posts.map((post) => (
            <PostBox post={post} refresh={refresh} key={Math.random()} />
          ))
        : !loader && <div className="centered-info">No posts</div>}

      {loader && (
        <div className="post__box">
          <div className="post__box--load-more">
            <Loader h100 size={5} />
          </div>
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
