import React, { useEffect, useState } from 'react';
import { getSettings } from '../services/apiService';
import Loader from './common/loader';

const ProfileInfo = ({ link }) => {
  const [settings, setSettings] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setSettings(await getSettings(link));
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
