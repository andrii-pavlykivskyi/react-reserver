export default function Tag(props: React.ComponentProps<'div'>) {
  const style = {
    textAlign: 'center',
    position: 'absolute',
    whiteSpace: 'nowrap',
    top: '0px',
    overflow: 'hidden',
    userSelect: 'none',
    lineHeight: 1,
    height: '100%'
  }
  return (
    <div style={Object.assign(style, props.style)} className={props.className}>
      {props.children}
    </div>
  )
}
