import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/input';
import avatar from '../../img/no-avatar.png';
import { findUsers } from '../../services/apiService';
import { toast } from 'react-toastify';
import Loader from '../common/loader';

const FindUsers = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoader(true);
        setUsers(await findUsers(query));
      } catch ({ response }) {
        if (response) toast.error(response.data.message);
      } finally {
        setLoader(false);
      }
    };

    if (query.length > 0) fetchUsers();
    else setUsers([]);
  }, [query]);

  const handleChange = ({ currentTarget: input }) => {
    setQuery(input.value);
  };

  const renderUsers = () =>
    users.map((user) => (
      <div className="person-info-multiple-el" key={user.link}>
        <div className="round__box-b">
          <Link to={`/${user.link}`} className="">
            <img src={user.image ? user.image.location : avatar} />
          </Link>
        </div>
        {user.username.length > 10
          ? `${user.username.substring(0, 10)}...`
          : user.username}
      </div>
    ));

  return (
    <Fragment>
      <Input
        name="search"
        className="search__input fg__find"
        placeholder="Write username here"
        value={query}
        onChange={handleChange}
        autoFocus
      />
      <div className="person-info-multiple">
        {loader ? (
          <Loader size={6} />
        ) : users.length ? (
          renderUsers()
        ) : (
          'No users'
        )}
      </div>
    </Fragment>
  );
};

export default FindUsers;
