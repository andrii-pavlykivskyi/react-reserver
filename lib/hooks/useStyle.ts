import { useEffect, useRef, useCallback } from 'react';

function useStyle() {
  const el = useRef(document.createElement('style'));

  useEffect(() => {
    el.current.type = 'text/css';

    // Add it to the head of the document

    const head = document.querySelector('head')!;
    head.appendChild(el.current);

    // At some future point we can totally redefine the entire content of the style element
  }, []);

  const setStyle = useCallback((newStyles: string) => {
    el.current.innerHTML = newStyles;
  }, []);

  return setStyle;
}

export default useStyle;
