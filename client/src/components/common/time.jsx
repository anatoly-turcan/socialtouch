import { useEffect, useState } from 'react';
import friendlyTime from '../../utils/friendlyTime';

const Time = ({ data }) => {
  const [state, setState] = useState(friendlyTime(data));

  const tick = () => {
    setState(friendlyTime(data));
  };

  useEffect(() => {
    const timeId = setInterval(() => tick(), 10000);
    return () => {
      clearInterval(timeId);
    };
  }, [state]);

  return state;
};

export default Time;
