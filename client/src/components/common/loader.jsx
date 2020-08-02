import React from 'react';

const Loader = ({ size, h100, w100 }) => {
  let classes = 'centered';
  if (size) classes = `${classes} f-${size}`;
  if (h100) classes = `${classes} h-100`;
  if (w100) classes = `${classes} w-100`;

  return (
    <div className={classes}>
      <i className="ri-loader-4-fill loading-animation" />
    </div>
  );
};

export default Loader;
