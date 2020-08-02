import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserContext from '../../context/userContext';
import Loader from './loader';
import { getUserGroups } from '../../services/userService';
import noGroup from '../../img/no-group.png';

const AllGroups = ({ link }) => {
  const { user } = useContext(UserContext);
  const [groups, setGroups] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setGroups(await getUserGroups(link || user.link, 0));
      } catch ({ response }) {
        if (response) toast.error(response.data.message);
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, []);

  const renderGroups = () =>
    groups.map((group) => (
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
    ));

  if (loader)
    return (
      <div className="person-info">
        <Loader h100 size={6} />
      </div>
    );

  if (groups)
    return (
      <div className="person-info-multiple">
        {groups.length ? renderGroups() : 'No groups'}
      </div>
    );

  return null;
};

export default AllGroups;
