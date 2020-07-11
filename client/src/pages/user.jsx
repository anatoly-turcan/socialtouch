import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/userContext';
import api from '../services/apiService';
import ProfileBox from '../components/profileBox';
import Posts from '../components/common/posts';
import { useParams } from 'react-router-dom';
import Loader from '../components/common/loader';

const User = ({ history }) => {
  const params = useParams();
  const { user } = useContext(UserContext);
  const [link, setLink] = useState(params.link);
  const [linkedUser, setLinkedUser] = useState(null);
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
    setLoader(false);
  }, [linkedUser]);

  if (loader) return <Loader h100 size={6} />;

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
      {linkedUser && <ProfileBox user={linkedUser} />}
    </div>
  );
};

export default User;
