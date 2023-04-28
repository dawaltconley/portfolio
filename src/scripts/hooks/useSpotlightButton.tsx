import type { RefObject } from 'preact';
import { useEffect } from 'preact/hooks';

import { SpotlightButton } from '@browser/spotlight-button';

export default (button: RefObject<HTMLElement>): void => {
  useEffect(() => {
    const e = button.current;
    if (!e) return;
    if (!SpotlightButton.isActive(e)) new SpotlightButton(e);
    return () => {
      SpotlightButton.instances.get(e)?.disconnect();
    };
  }, [button]);
};
