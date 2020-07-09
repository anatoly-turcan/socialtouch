import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/userContext';
import api from '../services/apiService';
import ProfileBox from '../components/profileBox';
import Posts from '../components/common/posts';
import { useParams } from 'react-router-dom';

const User = ({ history }) => {
  const params = useParams();
  const { user } = useContext(UserContext);
  const [link, setLink] = useState(params.link);
  const [linkedUser, setLinkedUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (params.link !== link) {
      setLoader(true);
      setLink(params.link);
    }
  }, [params]);

  useEffect(() => {
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
        setLoader(false);
      };
      fetchFriendsPosts();
    }
  }, [linkedUser]);

  if (loader) return <div className="global-loader">Loading...</div>;

  return (
    <div className="content__personal-page">
      {linkedUser && (
        <Posts
          fetchMethod={async (page) =>
            await api.getPosts(linkedUser.link, page)
          }
          isMe={user.link === linkedUser.link}
        />
      )}
      {linkedUser && <ProfileBox user={linkedUser} friends={friends} />}
    </div>
  );
};

export default User;
