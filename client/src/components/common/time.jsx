import { useEffect, useState } from 'react';
import friendlyTime from '../../utils/friendlyTime';

const Time = ({ data }) => {
  const [state, setState] = useState(friendlyTime(data));

  useEffect(() => {
    const timeId = setInterval(() => tick(), 10000);
    return () => {
      clearInterval(timeId);
    };
  }, [state]);

  const tick = () => {
    setState(friendlyTime(data));
  };

  return state;
};

export default Time;
