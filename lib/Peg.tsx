import React from 'react';

export default function Peg(props: React.ComponentProps<'div'>) {
  const style = {
    userSelect: 'none',
    pointerEvents: 'none',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    display: 'flex',
    fontSize: '10px',
    background: 'green'
  };

  return (
    <div className={props.className} style={Object.assign(style, props.style)}>
      {props.children}
    </div>
  );
}
