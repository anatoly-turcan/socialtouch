import React, { useState } from 'react';
import { toast } from 'react-toastify';
import validate from '../../utils/validate';

const SettingsForm = ({ title, children, doSubmit, init, constraints }) => {
  const [data, setData] = useState(init);

  const handleSubmit = (event) => {
    event.preventDefault();

    const validation = validate(data, constraints);
    if (validation) return toast.error(validation);
    doSubmit(data, (fields) => setData(fields || init));
  };

  const handleChange = ({ currentTarget: input }) => {
    const newData = { ...data };
    newData[input.name] = input.value;
    setData(newData);
  };

  return (
    <div className="settings-el">
      <div className="settings-el-title">{title}</div>
      <form className="settings-el-body" onSubmit={handleSubmit}>
        {children(handleChange, data)}
      </form>
    </div>
  );
};

export default SettingsForm;
