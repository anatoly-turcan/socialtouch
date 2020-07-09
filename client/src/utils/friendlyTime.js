import moment from 'moment';

const friendlyTime = (time) => {
  const uTime = new Date(time).getTime() / 1000;
  const currentTime = Date.now() / 1000;
  const result =
    currentTime - uTime > 86400
      ? moment(time).calendar()
      : moment(time).fromNow();
  return result.toLowerCase();
};

export default friendlyTime;
