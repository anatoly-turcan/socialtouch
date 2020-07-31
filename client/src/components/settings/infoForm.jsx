import React, { useState, Fragment, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../../context/userContext';
import Form from '../common/form';
import Input from '../common/input';
import Loader from '../common/loader';
import userSettingsConstraints from '../../validators/userSettingsConstraints';
import { getSettings, updateMySettings } from '../../services/apiService';

const InfoForm = () => {
  const { user } = useContext(UserContext);
  const [loader, setLoader] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const catchSettings = async () => setSettings(await getSettings(user.link));
    catchSettings();
  }, []);

  const doSubmit = async (data) => {
    const parsedData = Object.keys(data).reduce((acc, el) => {
      const obj = { [el]: data[el] || null };
      return { ...acc, ...obj };
    }, {});

    parsedData.age = Number(parsedData.age);

    try {
      setLoader(true);
      const success = await updateMySettings(parsedData);
      if (success) {
        toast.success('Data changed successfully');
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    } finally {
      setLoader(false);
    }
  };

  if (settings)
    return (
      <Form
        title="Info"
        doSubmit={doSubmit}
        init={settings}
        constraints={userSettingsConstraints}
      >
        {(handleChange, data) => (
          <Fragment>
            {Object.keys(settings).map((name) => {
              if (!data[name]) data[name] = '';
              return (
                <Fragment key={name}>
                  <label htmlFor={name}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </label>
                  <Input
                    name={name}
                    value={data[name]}
                    onChange={handleChange}
                  />
                </Fragment>
              );
            })}
            <button type="submit" className="btn btn-dark">
              {loader ? <Loader size={2} /> : 'Save'}
            </button>
          </Fragment>
        )}
      </Form>
    );

  return null;
};

export default InfoForm;
