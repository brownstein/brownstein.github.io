import React, { FC, useMemo } from 'react';
import './Birdify.css';

export interface IBirdProps {
  active: boolean;
}

export const Bird: FC<IBirdProps> = ({
  active
}) => {
  const flightPath = useMemo(() => `flightpath-${Math.floor(Math.random() * 6) + 1}`, []);

  const wrapperStyle: React.CSSProperties = {
    zIndex: 50,
    float: 'right'
  };

  return (
    <span style={wrapperStyle} className={`${active ? 'birdified' : 'bird-candidate'} with-paren ${flightPath}`}>
      <span className='left wing'>(</span>
      <span className='right wing'>)</span>
    </span>
  );
};
