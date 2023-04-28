import type { DataIcon, IconDefinition } from '@data/icons';
import type { FunctionComponent } from 'preact';
import type { ImageProps } from '@components/Image';
import IconLink from '@components/IconLink';
import ProjectSlideshow from '@components/ProjectSlideshow';
import classNames from 'classnames';
import { useState, useEffect, useRef } from 'preact/hooks';

import { SpotlightButton } from '@browser/spotlight-button';
import useMatchMedia from '@hooks/useMatchMedia';

export interface ProjectLink {
  url: string;
  icon: IconDefinition;
  text?: string;
}

const SpotlightIconLink: FunctionComponent<ProjectLink> = ({
  url,
  icon,
  text,
}) => {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;
    if (!SpotlightButton.isActive(button)) {
      new SpotlightButton(button);
    }
    return () => {
      SpotlightButton.instances.get(button)?.disconnect();
    };
  }, []);

  return (
    <a
      ref={ref}
      href={url}
      class="spotlight-button pointer-events-auto z-0 flex items-center justify-center p-2 font-semibold"
      target="_blank"
      rel="noreferrer"
    >
      <IconLink class="pointer-events-none" icon={icon} inline={Boolean(text)}>
        {text && <span class="ml-[0.4em]">{text}</span>}
      </IconLink>
    </a>
  );
};

export interface ProjectPreviewProps {
  title: string;
  links: ProjectLink[];
  icons: DataIcon[];
  image?: ImageProps;
}

export const ProjectPreview: FunctionComponent<ProjectPreviewProps> = ({
  title,
  links,
  image,
  icons,
  children,
}) => {
  const defaultLink = useRef<HTMLAnchorElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [cancelTap, setCancelTap] = useState(false);
  const noScroll = useMatchMedia('(prefers-reduced-motion)');

  const handleOutsideClick = (e: TouchEvent): void => {
    if (e.target && e.target !== defaultLink.current) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    window.addEventListener('touchend', handleOutsideClick, {
      passive: true,
    });
    return () => {
      window.removeEventListener('touchend', handleOutsideClick);
    };
  }, []);

  return (
    <li
      class="group relative z-10 list-none overflow-hidden rounded bg-gray-900 text-indigo-300 duration-300 min-aspect-video"
      onFocusCapture={() => setIsActive(true)}
      onBlurCapture={() => setIsActive(false)}
    >
      <div
        class="absolute inset-0 font-serif text-[12vmax] font-semibold leading-[0.82] text-gray-800/20"
        aria-hidden="true"
      >
        <span class="relative -left-4 -top-12">{title}</span>
      </div>
      <div class="absolute inset-0 z-10 flex flex-col p-4 sm:p-8 md:p-4 2xl:p-8">
        <div class="relative z-20 flex justify-end space-x-2">
          {links.map((link) => (
            <SpotlightIconLink
              key={link.url}
              url={link.url}
              icon={link.icon}
              text={link.text}
            />
          ))}
        </div>
        <div class="mt-auto">
          <h2 class="inline text-left font-serif text-4xl font-semibold leading-none">
            <a
              ref={defaultLink}
              class="pseudo-fill-parent"
              href={links[0].url}
              onTouchMove={() => setCancelTap(true)}
              onTouchEnd={(e) => {
                if (!cancelTap && image) {
                  e.preventDefault();
                  setIsActive((a) => !a);
                }
                setCancelTap(false);
              }}
            >
              {title}
            </a>
          </h2>
          <ul class="ml-4 mt-2 inline-flex items-center space-x-2 text-right text-sm opacity-80">
            {icons.map(
              (icon) =>
                icon.style.simple && (
                  <IconLink
                    key={icon.url}
                    icon={icon.style.simple}
                    title={icon.name}
                    tag="li"
                  />
                )
            )}
          </ul>
        </div>
        <div class="mt-2 leading-5">{children}</div>
      </div>
      {image && (
        <ProjectSlideshow
          image={image}
          class={classNames(
            'clip-hide group-hover:clip-hide--active pointer-events-auto absolute -inset-px z-10 -mb-px cursor-pointer',
            {
              'clip-hide--active': isActive,
            }
          )}
          style={{ '--initial-delay': '120ms' }}
          crossfade={3000}
          scrollRate={noScroll ? 0 : 2}
          scrollDelay={1000}
        />
      )}
    </li>
  );
};

export default ProjectPreview;
