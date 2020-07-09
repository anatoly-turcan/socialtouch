import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/userContext';
import api from '../services/apiService';
import ProfileBox from '../components/profileBox';
import Posts from '../components/common/posts';
import { useParams, Link } from 'react-router-dom';

const User = ({ history }) => {
  const params = useParams();
  const { user } = useContext(UserContext);
  const [link, setLink] = useState(params.link);
  const [linkedUser, setLinkedUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (params.link !== link) {
      setLoader(true);
      setLink(params.link);
    }
  }, [params]);

  useEffect(() => {
    setPage(1);
    const fetchUser = async () => {
      try {
        setLinkedUser(await api.getUser(link));
      } catch (error) {
        console.log(error);
      }
    };

    if (user.link === link) setLinkedUser(user);
    else fetchUser();
  }, [link]);

  useEffect(() => {
    if (linkedUser) {
      const fetchFriendsPosts = async () => {
        setFriends(await api.getFriends(linkedUser.link));
        setPosts(await api.getPosts(linkedUser.link, page));
        setLoader(false);
      };
      fetchFriendsPosts();
    }
  }, [linkedUser]);

  useEffect(() => {
    if (linkedUser) {
      const fetchPosts = async () => {
        setPosts([...posts, ...(await api.getPosts(linkedUser.link, page))]);
      };
      fetchPosts();
    }
  }, [page]);

  const handleLoadMore = (event) => {
    event.preventDefault();
    setPage(page + 1);
  };

  if (loader) return <div className="global-loader">Loading...</div>;

  return (
    <div className="content__personal-page">
      <Posts posts={posts} handleLoadMore={handleLoadMore} />
      {linkedUser && <ProfileBox user={linkedUser} friends={friends} />}
    </div>
  );
};

export default User;
