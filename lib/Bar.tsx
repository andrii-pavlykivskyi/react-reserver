import React, { ReactNode, ComponentProps, ReactElement } from 'react';
import { Dimension } from './types';

type Content = ReactNode & { props: { style: React.CSSProperties } };

function getContent(
  index: number,
  length: number,
  firstContent: ReactNode,
  lastContent: ReactNode
): Content {
  if (index === 0) {
    return (firstContent || <div />) as Content;
  } else if (length - 1 === index) {
    return (lastContent || <div />) as Content;
  }
  return <div />;
}

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
        display: props.style?.display || 'flex',
        position: props.style?.position || 'absolute',
        zIndex: props.style?.zIndex || '100',
        cursor: 'move'
      }}
      className={props.className}
    >
      {[...Array(length)].map((_, i) => {
        const processedContent = getContent(i, length, firstContent, lastContent);

        const style = Object.assign(
          {
            width: dimension.width,
            height: dimension.height,
            pointerEvents: props.style?.pointerEvents || 'none'
          },
          (processedContent?.props && processedContent?.props?.style) || {}
        );

        return (
          <React.Fragment key={i}>
            {React.cloneElement(
              processedContent as ReactElement,
              { ...processedContent.props, style },
              processedContent.props.children
            )}
          </React.Fragment>
        );
      })}
      {props.children}
    </div>
  );
}
