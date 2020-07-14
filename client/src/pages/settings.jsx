import React from 'react';
import PasswordForm from '../components/settings/passwordForm';
import MeForm from '../components/settings/meForm';
import InfoForm from '../components/settings/infoForm';

const Settings = () => {
  return (
    <div className="content__settings">
      <div className="content__title">Settings</div>
      <div className="settings-container">
        <MeForm />
        <InfoForm />
        <PasswordForm />
      </div>
    </div>
  );
};

export default Settings;
