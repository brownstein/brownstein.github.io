import React, { FC, useMemo } from 'react';
import './Birdify.css';

export interface IBirdProps {
  active: boolean;
  children?: string;
}

export const Bird: FC<IBirdProps> = ({
  active,
  children
}) => {
  const flightPath = useMemo(() => `flightpath-${Math.floor(Math.random() * 6) + 1}`, []);

  let leftChar = '(';
  let rightChar = ')';

  if (children) {
    [leftChar, rightChar] = children.split('');
  }

  return (
    <span className={`bird ${active ? 'birdified' : 'bird-candidate'} with-paren ${flightPath}`}>
      <span className='left wing'>{leftChar}</span>
      <span className='right wing'>{rightChar}</span>
    </span>
  );
};
