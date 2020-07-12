import React, { useEffect, useState } from 'react';
import { getUserGroups } from '../services/apiService';
import Loader from './common/loader';
import noGroup from '../img/no-group.png';
import { Link } from 'react-router-dom';

const ProfileGroups = ({ link, limit }) => {
  const [groups, setGroups] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setGroups(await getUserGroups(link, limit));
      setLoader(false);
    };
    fetchData();
  }, []);

  if (loader)
    return (
      <div className="person-info">
        <Loader h100 size={6} />
      </div>
    );

  if (groups)
    return (
      <div className="person-info-multiple">
        {groups.map((group) => (
          <div className="person-info-multiple-el" key={group.link}>
            <div className="round__box-b">
              <Link to={`/group/${group.link}`} className="">
                <img
                  src={group.image ? group.image.location : noGroup}
                  alt="Group box"
                />
              </Link>
            </div>
            {group.name.length > 10
              ? `${group.name.substring(0, 10)}...`
              : group.name}
          </div>
        ))}
      </div>
    );

  return null;
};

export default ProfileGroups;
