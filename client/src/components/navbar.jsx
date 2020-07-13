import React, { useContext } from 'react';
import avatar from '../img/no-avatar.png';
import UserContext from './../context/userContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <header>
      <div className={user ? 'navbar' : 'navbar-disable'}>
        <div className="profile">
          <Link to={`/${user && user.link}`}>
            <img
              src={user && user.image ? user.image.location : avatar}
              alt="profile"
              className="navbar-profile-image"
            />
          </Link>
        </div>

        <nav>
          <ul>
            <li>
              <Link
                to="/news"
                className="btn-nav icon-lg ri-dashboard-fill"
              ></Link>
            </li>
            <li>
              <Link
                to="/chat"
                className="btn-nav icon-lg ri-chat-1-fill"
              ></Link>
            </li>
            <li>
              <Link
                to="/friends"
                className="btn-nav icon-lg ri-user-fill"
              ></Link>
            </li>
            <li>
              <Link
                to="/groups"
                className="btn-nav icon-lg ri-group-fill"
              ></Link>
            </li>
            <li>
              <Link
                to="/signout"
                className="btn-nav icon-lg ri-logout-box-r-fill"
                style={{ color: 'var(--red)' }}
              ></Link>
            </li>
          </ul>
        </nav>
        <div className="settings">
          <Link
            to="/settings"
            className="btn-nav icon-lg ri-settings-3-fill"
          ></Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
