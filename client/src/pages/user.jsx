import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import UserContext from '../context/userContext';
import ProfileBox from '../components/profile/box';
import Posts from '../components/posts';
import Loader from '../components/common/loader';
import { getUser, getPosts } from '../services/userService';

const User = () => {
  const history = useHistory();
  const params = useParams();
  const { user } = useContext(UserContext);
  const [link, setLink] = useState(params.link);
  const [linkedUser, setLinkedUser] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (params.link !== link) {
      setLink(params.link);
      setLoader(true);
    }
  }, [params]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLinkedUser(await getUser(link));
      } catch ({ response }) {
        if (response.status === 404) history.push('/not-found');
      }
    };

    if (user.link === link) setLinkedUser(user);
    else fetchUser();
  }, [link]);

  useEffect(() => {
    setLoader(false);
  }, [linkedUser]);

  const isMe = () => user.link === linkedUser.link;

  const fetchPosts = (page, limit = 10) =>
    getPosts(linkedUser.link, page, limit);

  if (loader) return <Loader h100 size={6} />;

  return (
    <div className="content__personal-page">
      {linkedUser && <Posts fetchMethod={fetchPosts} isMe={isMe()} />}
      {linkedUser && <ProfileBox user={linkedUser} isMe={isMe()} />}
    </div>
  );
};

export default User;
