import type { DataIcon, IconDefinition } from '@data/icons';
import type { FunctionComponent } from 'preact';
import type { ImageProps } from '@components/Image';
import IconLink from '@components/IconLink';
import ProjectSlideshow from '@components/ProjectSlideshow';
import classNames from 'classnames';
import twColors from 'tailwindcss/colors';
import { useState, useEffect, useRef } from 'preact/hooks';

import useSpotlightButton from '@hooks/useSpotlightButton';
import useMatchMedia from '@hooks/useMatchMedia';

export interface ProjectLink {
  url: string;
  icon: IconDefinition;
  text?: string;
}

interface SpotlightIconLinkProps extends ProjectLink {
  isActive: boolean;
}

const SpotlightIconLink: FunctionComponent<SpotlightIconLinkProps> = ({
  url,
  icon,
  text,
  isActive,
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  useSpotlightButton(ref);

  return (
    <a
      ref={ref}
      href={url}
      class={classNames(
        'spotlight-button z-0 flex items-center justify-center p-2 font-medium group-hover:pointer-events-auto',
        {
          'pointer-events-auto': isActive,
        }
      )}
      style={{
        '--color': twColors.pink['800'],
        '--opacity': 0.3,
      }}
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
      <div
        class="text-overflow-fade absolute inset-0 z-10 flex flex-col p-4 sm:p-8 md:p-4 2xl:p-8"
        style={{ '--fade-color': twColors.gray['900'] }}
      >
        <div class="order-2 mt-auto">
          <h2 class="inline text-left font-serif text-4xl font-semibold leading-[0.8]">
            <a
              ref={defaultLink}
              class="pseudo-fill-parent"
              href={links[0].url}
              tabIndex={-1}
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
        <div class="order-3 mt-2 leading-snug">{children}</div>
        <div class="pointer-events-none relative z-20 order-1 flex justify-end space-x-2">
          {links.map((link) => (
            <SpotlightIconLink
              key={link.url}
              url={link.url}
              icon={link.icon}
              text={link.text}
              isActive={isActive}
            />
          ))}
        </div>
      </div>
      {image && (
        <ProjectSlideshow
          image={image}
          class={classNames(
            'clip-hide group-hover:clip-hide--active pointer-events-none absolute -inset-px z-10 -mb-px cursor-pointer',
            {
              'clip-hide--active delay-0': isActive,
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
