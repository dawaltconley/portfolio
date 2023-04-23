import type { DataIcon, IconDefinition } from '@data/icons';
import type { FunctionComponent } from 'preact';
import IconLink from '@components/IconLink';
import classNames from 'classnames';
import { getIconFromUrl, getDefaultIconDefinition } from '@data/icons';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons/faArrowUpRightFromSquare';
import { useState, useEffect, useMemo, useRef } from 'preact/hooks';

import { SpotlightButton } from '@browser/spotlight-button';

interface ProjectLink {
  url: string;
  icon?: IconDefinition;
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
  }, [ref.current]);

  return (
    <a
      ref={ref}
      href={url}
      class="spotlight-button pointer-events-auto z-0 flex aspect-square items-center justify-center p-4 font-bold"
    >
      <IconLink icon={icon ?? faArrowUpRightFromSquare} inline={Boolean(text)}>
        {text && <span class="ml-[0.4em]">{text}</span>}
      </IconLink>
    </a>
  );
};

const ProjectPreviewLinks: FunctionComponent<{
  links: ProjectLink[];
  class?: string;
  image?: string;
  active?: boolean;
}> = ({ links, image, class: propClass, active }) => {
  const [noTransition, setNoTransition] = useState(true);

  const alwaysVisible = !image;
  useEffect(() => {
    setNoTransition(alwaysVisible);
  }, [image]);

  return (
    <div
      class={classNames(
        propClass,
        'theme-brand pointer-events-none relative z-20 flex w-full items-center justify-center overflow-hidden border-2 border-theme-tx text-xl font-semibold',
        {
          'aspect-video': Boolean(image),
          'min-aspect-[42%]': Boolean(!image),
        }
      )}
    >
      {links.map((link) => (
        <SpotlightIconLink {...link} />
      ))}
      {image && (
        <img
          src={image}
          class={classNames(
            'clip-hide group-hover:clip-hide--active pointer-events-auto absolute inset-0 z-10 -mb-px h-[calc(100%+1px)] w-full cursor-pointer object-cover',
            {
              'clip-hide--active': alwaysVisible || active,
              'delay-[0s] duration-[0s]': alwaysVisible || noTransition,
            }
          )}
          style={{
            '--initial-delay': '120ms',
          }}
        />
      )}
    </div>
  );
};

interface ProjectPreviewProps {
  title: string;
  links: string[];
  icons: DataIcon[];
  image?: string;
}

const ProjectPreview: FunctionComponent<ProjectPreviewProps> = ({
  title,
  links,
  image,
  icons,
  children,
}) => {
  const defaultLink = useRef<HTMLAnchorElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [cancelTap, setCancelTap] = useState(false);

  const projectLinks: ProjectLink[] = useMemo(
    () =>
      links.map((link) => {
        const icon = getIconFromUrl(link);
        return {
          url: link,
          icon: icon
            ? getDefaultIconDefinition(icon)
            : faArrowUpRightFromSquare,
          text: icon ? icon.name : 'Visit',
        };
      }),
    [links]
  );

  useEffect(() => {
    const handleOutsideClick = (e: TouchEvent): void => {
      if (e.target && e.target !== defaultLink.current) {
        setIsActive(false);
      }
    };
    window.addEventListener('touchend', handleOutsideClick, {
      passive: true,
    });
    return () => {
      window.removeEventListener('touchend', handleOutsideClick);
    };
  }, []);

  return (
    <li
      class={classNames(
        'box-shadow-button group relative flex list-none flex-col-reverse duration-300',
        {
          'box-shadow-button--active': isActive,
        }
      )}
      onFocusCapture={() => setIsActive(true)}
      onBlurCapture={() => setIsActive(false)}
    >
      <div class="z-10 flex-grow border-x-2 border-b-2 border-theme-tx bg-theme-bg p-2 font-serif">
        <header>
          <ul class="float-right ml-4 flex space-x-2">
            {icons.map(
              (icon) =>
                icon.style.simple && (
                  <IconLink
                    icon={icon.style.simple}
                    title={icon.name}
                    tag="li"
                  />
                )
            )}
          </ul>
          <h2 class="mr-auto text-2xl font-semibold leading-none underline decoration-theme-br decoration-2 underline-offset-2">
            <a
              ref={defaultLink}
              class="pseudo-fill-parent"
              href={links[0]}
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
        </header>
        {children && <div class="clear-both mt-2 leading-5">{children}</div>}
      </div>
      <ProjectPreviewLinks
        class={image ? '' : 'flex-grow basis-full'}
        image={image}
        links={projectLinks}
        active={isActive}
      />
    </li>
  );
};

export default ProjectPreview;
export type { ProjectPreviewProps };
export { ProjectPreview, ProjectPreviewLinks };
