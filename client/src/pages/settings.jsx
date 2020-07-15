import React from 'react';
import PasswordForm from '../components/settings/passwordForm';
import MeForm from '../components/settings/meForm';
import InfoForm from '../components/settings/infoForm';
import ImageForm from '../components/settings/imageForm';
import DeleteForm from '../components/settings/deleteForm';

const Settings = () => {
  return (
    <div className="content__settings">
      <div className="content__title">Settings</div>
      <div className="settings-container">
        <ImageForm />
        <MeForm />
        <InfoForm />
        <PasswordForm />
        <DeleteForm />
      </div>
    </div>
  );
};

export default Settings;
