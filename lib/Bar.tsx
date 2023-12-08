import { ReactNode, ComponentProps } from 'react';
import { Dimension } from './types';

export type BarProps = Omit<ComponentProps<'div'>, 'content'> & {
  length: number;
  dimension: Dimension;
  firstContent: ReactNode;
  lastContent: ReactNode;
};

export default function Bar({
  length = 1,
  dimension,
  firstContent = null,
  lastContent = null,
  ...props
}: BarProps) {
  return (
    <div
      {...props}
      id={props.id}
      role="listitem"
      draggable={props.draggable}
      style={{
        ...props.style,
        pointerEvents: props.style?.pointerEvents || 'none',
        background: props.style?.background || '#0E6BA8',

        position: props.style?.position || 'absolute',
        zIndex: props.style?.zIndex || '100'
      }}
      className={props.className}
    >
      <div
        style={{
          display: props.style?.display || 'flex',
          position: 'relative'
        }}
      >
        {firstContent}
        {lastContent}
        {[...Array(length)].map((_, i) => {
          const style = {
            width: dimension.width,
            height: dimension.height,
            pointerEvents: props.style?.pointerEvents || 'none'
          };
          return <div key={i} style={style} />;
        })}
        {props.children}
      </div>
    </div>
  );
}
