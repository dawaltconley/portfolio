import type { FunctionComponent, ComponentChild } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

import { SpotlightButton } from '@browser/spotlight-button';

import IconTheme from '~icons/fap-solid/brush';
import IconLight from '~icons/fap-solid/sun';
import IconDark from '~icons/fap-solid/moon';

const icons = {
  theme: IconTheme,
  light: IconLight,
  dark: IconDark,
};

const Button: FunctionComponent<{
  icon: keyof typeof icons;
  onClick?: () => void;
}> = ({ icon: iconDef, onClick }) => {
  const button = useRef<HTMLButtonElement>(null);
  const Icon = icons[iconDef];

  useEffect(() => {
    const btn = button.current;
    if (!btn) return;
    if (!SpotlightButton.isActive(btn)) new SpotlightButton(btn);
    return () => {
      SpotlightButton.instances.get(btn)?.disconnect();
    };
  }, []);

  return (
    <button
      ref={button}
      class="spotlight-button -my-2 aspect-square p-2"
      onClick={onClick}
    >
      <Icon
        class="aspect-square"
        width="1em"
        height="1em"
        style={{ '--fa-display': 'block' }}
      />
    </button>
  );
};

type ColorScheme = 'light' | 'dark';
const isColorScheme = (s: string | null | undefined): s is ColorScheme =>
  s === 'light' || s === 'dark';

const loadTheme = (): number | null => {
  const saved = window.localStorage.getItem('theme');
  return (saved && parseInt(saved)) || null;
};
const saveTheme = (n: number): void => {
  window.localStorage.setItem('theme', n.toString());
};

const loadColorScheme = (): ColorScheme | null => {
  const saved = window.localStorage.getItem('colorScheme');
  return isColorScheme(saved) ? saved : null;
};
const saveColorScheme = (scheme: ColorScheme): void => {
  window.localStorage.setItem('colorScheme', scheme);
};

interface ThemeControlsProps {
  themes?: number;
  class?: string;
  iconTheme?: ComponentChild;
  iconLight?: ComponentChild;
  iconDark?: ComponentChild;
}

const ThemeControls: FunctionComponent<ThemeControlsProps> = ({
  themes: maxThemes = 1,
  class: className,
}) => {
  const [theme, setTheme] = useState(0);
  const [colorScheme, setColorScheme] = useState<ColorScheme | null>(null);
  const [isManualColorScheme, setIsManualColorScheme] = useState(false);

  const nextTheme = (): void =>
    setTheme((current) => {
      let next = current + 1;
      return next < maxThemes ? next : 0;
    });

  const toggleColorScheme = (current: ColorScheme): void => {
    setIsManualColorScheme(true);
    setColorScheme(current === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = loadTheme();
    if (savedTheme) setTheme(savedTheme);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const useDefaultColorScheme = (): void => {
      const saved = loadColorScheme();
      if (saved) {
        setIsManualColorScheme(true);
        setColorScheme(saved);
        mq.removeEventListener('change', useDefaultColorScheme);
      } else {
        setColorScheme(mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', useDefaultColorScheme);
    useDefaultColorScheme();

    return () => {
      mq.removeEventListener('change', useDefaultColorScheme);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme.toString();
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!colorScheme) return;
    document.documentElement.dataset.colorScheme = colorScheme;
    if (isManualColorScheme) saveColorScheme(colorScheme);
  }, [colorScheme]);

  return (
    <div class={`flex ${className ?? ''}`}>
      {maxThemes > 1 && <Button icon="theme" onClick={nextTheme} />}
      {colorScheme && (
        <Button
          icon={colorScheme}
          onClick={() => toggleColorScheme(colorScheme)}
        />
      )}
    </div>
  );
};

export default ThemeControls;
export { Button };
