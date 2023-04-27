import type { FunctionComponent, ComponentChild } from 'preact';
import type { IconDefinition } from './Icon';

import { useState, useEffect, useRef } from 'preact/hooks';
import { faBrush } from '@fortawesome/pro-solid-svg-icons/faBrush';
import { faSun } from '@fortawesome/pro-solid-svg-icons/faSun';
import { faMoon } from '@fortawesome/pro-solid-svg-icons/faMoon';

import Icon from './Icon';
import { SpotlightButton } from '@browser/spotlight-button';

const Button: FunctionComponent<{
  icon: IconDefinition;
  onClick?: () => void;
}> = ({ icon, onClick }) => {
  const button = useRef<HTMLButtonElement>(null);

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
      <Icon icon={icon} class="block" width="1em" height="1em" />
    </button>
  );
};

export type ColorScheme = 'light' | 'dark';
const isColorScheme = (s: string | null | undefined): s is ColorScheme =>
  s === 'light' || s === 'dark';

const loadTheme = (): number | null => {
  const saved = window.localStorage.getItem('theme');
  return (saved && parseInt(saved, 10)) || null;
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
      const next = current + 1;
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
    const applyDefaultColorScheme = (): void => {
      const saved = loadColorScheme();
      if (saved) {
        setIsManualColorScheme(true);
        setColorScheme(saved);
        mq.removeEventListener('change', applyDefaultColorScheme);
      } else {
        setColorScheme(mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', applyDefaultColorScheme);
    applyDefaultColorScheme();

    return () => {
      mq.removeEventListener('change', applyDefaultColorScheme);
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
  }, [colorScheme, isManualColorScheme]);

  return (
    <div class={`flex ${className ?? ''}`}>
      {maxThemes > 1 && <Button icon={faBrush} onClick={nextTheme} />}
      {colorScheme && (
        <Button
          icon={colorScheme === 'light' ? faSun : faMoon}
          onClick={() => toggleColorScheme(colorScheme)}
        />
      )}
    </div>
  );
};

export default ThemeControls;
export { Button };
