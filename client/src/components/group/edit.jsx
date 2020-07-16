import React from 'react';
import LinearNav from '../common/linearNav';
import ImageForm from './imageForm';
import InfoForm from './infoForm';
import DeleteGroup from './deleteForm';

const EditGroup = ({ goBack }) => {
  return (
    <div className="group__edit__box">
      <button className="btn btn-light btn-go-back" onClick={goBack}>
        Go back
      </button>
      <LinearNav
        data={[
          {
            name: 'image',
            label: 'Image',
            Component: ImageForm,
          },
          {
            name: 'info',
            label: 'Info',
            Component: InfoForm,
          },
          {
            name: 'del',
            label: 'Delete',
            Component: DeleteGroup,
          },
        ]}
      />
    </div>
  );
};

export default EditGroup;
