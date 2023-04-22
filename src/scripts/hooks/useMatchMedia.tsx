import { useState, useEffect } from 'preact/hooks';

const instances: Record<string, MediaQueryList> = {};
const listeners: Record<string, number> = {};
export default (query: string, initial = false) => {
  const [match, setMatch] = useState(initial);

  useEffect(() => {
    const mq = instances[query] || window.matchMedia(query);
    if (!instances[query]) instances[query] = mq;
    listeners[query] = (listeners[query] ?? 0) + 1;
    const onChange = () => setMatch(mq.matches);
    mq.addEventListener('change', onChange);
    onChange();
    return () => {
      mq.removeEventListener('change', onChange);
      listeners[query]--;
      if (!listeners[query]) {
        delete instances[query];
      }
    };
  }, [query]);

  return match;
};
