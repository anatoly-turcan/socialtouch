import React from 'react';
import PasswordForm from '../components/settings/passwordForm';
import MeForm from '../components/settings/meForm';
import InfoForm from '../components/settings/infoForm';
import ImageForm from '../components/settings/imageForm';
import DeleteForm from '../components/settings/deleteForm';
import LinearNav from '../components/common/linearNav';

const Settings = () => {
  return (
    <LinearNav
      title="Settings"
      data={[
        {
          name: 'image',
          label: 'Image',
          Component: ImageForm,
        },
        {
          name: 'me',
          label: 'Me',
          Component: MeForm,
        },
        {
          name: 'info',
          label: 'Info',
          Component: InfoForm,
        },
        {
          name: 'pass',
          label: 'Password',
          Component: PasswordForm,
        },
        {
          name: 'del',
          label: 'Delete account',
          Component: DeleteForm,
        },
      ]}
    />
  );
};

export default Settings;
