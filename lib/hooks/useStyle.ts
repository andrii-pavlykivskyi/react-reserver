import { useEffect, useRef, useCallback } from 'react';

function useStyle(initialStyles?: string) {
  const el = useRef(document.createElement('style'));

  useEffect(() => {
    if (initialStyles) {
      el.current.innerHTML = initialStyles;
    }
    const head = document.querySelector('head')!;
    const childElement = el.current;
    head.appendChild(childElement);

    return () => {
      head.removeChild(childElement);
    };
  }, [initialStyles]);

  const setStyle = useCallback((newStyles: string) => {
    el.current.innerHTML += `\n${newStyles}`;
  }, []);

  return setStyle;
}

export default useStyle;
