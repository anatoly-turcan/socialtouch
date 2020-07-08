import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/userContext';
import api from '../services/apiService';
import PostBox from '../components/common/postBox';
import ProfileBox from '../components/common/profileBox';

const User = ({ history, match }) => {
  const { user } = useContext(UserContext);
  const [linkedUser, setLinkedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const { link } = match.params;

    const fetchData = async () => {
      // Get user
      if (link === user.link) setLinkedUser(user);
      else
        try {
          setLinkedUser(await api.getUser(link));
        } catch (error) {
          if (error.response && error.response.status === 404)
            history.replace('/not-found');
        }

      // Get posts, friends
      try {
        setFriends(await api.getFriends(link));
        setPosts(await api.getPosts(link));
      } catch (error) {
        setFriends([]);
        setPosts([]);
      }

      setLoader(false);
    };

    fetchData();
  }, [user, history, match.params]);

  if (loader) return <div className="global-loader">Loading...</div>;

  return (
    <div className="content__personal-page">
      <div className="posts">
        {posts.length ? (
          posts.map((post) => <PostBox post={post} key={post.link} />)
        ) : (
          <div className="centered-info">No posts</div>
        )}
      </div>
      <ProfileBox user={linkedUser} friends={friends} />
    </div>
  );
};

export default User;
