import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserContext from '../context/userContext';
import GroupContext from '../context/groupContext';
import Posts from '../components/posts';
import Loader from '../components/common/loader';
import GroupBox from '../components/group/box';
import {
  createGroupPost,
  getGroup,
  getGroupPosts,
} from '../services/apiService';

const Group = () => {
  const params = useParams();
  const history = useHistory();
  const { user } = useContext(UserContext);
  const [loader, setLoader] = useState(false);
  const [group, setGroup] = useState(null);
  const [link, setLink] = useState(params.link);

  useEffect(() => {
    if (params.link !== link) {
      setLink(params.link);
      setLoader(true);
    }
  }, [params]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setGroup(await getGroup(link));
      } catch ({ response }) {
        if ((response.status = 404)) history.push('/not-found');
        else toast.error(response.data.message);
      }
    };
    fetchGroup();
  }, [link]);

  useEffect(() => {
    setLoader(false);
  }, [group]);

  const createMethod = (formData) => createGroupPost(group.link, formData);
  const fetchGroupPosts = (page, limit = 10) =>
    getGroupPosts(link, page, limit);

  if (loader) return <Loader h100 size={6} />;

  return (
    group && (
      <GroupContext.Provider value={{ group, setGroup }}>
        <div className="content__group-page">
          <Posts
            fetchMethod={fetchGroupPosts}
            createMethod={createMethod}
            isMe={group.creator.link === user.link}
          />
          <GroupBox />
        </div>
      </GroupContext.Provider>
    )
  );
};

export default Group;
