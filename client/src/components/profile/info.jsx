import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getSettings } from '../../services/userService';
import Loader from '../common/loader';

const ProfileInfo = ({ link }) => {
  const [settings, setSettings] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSettings(await getSettings(link));
      } catch ({ response }) {
        if (response) toast.error(response.data.message);
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, []);

  if (loader)
    return (
      <div className="person-info">
        <Loader h100 size={6} />
      </div>
    );

  if (settings)
    return Object.keys(settings).map((title) => (
      <div className="person-info-el" key={title}>
        <strong>{title}:</strong>
        {settings[title] || 'unknown'}
      </div>
    ));

  return null;
};

export default ProfileInfo;
