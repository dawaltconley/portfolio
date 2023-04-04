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
      class="spotlight-button pointer-events-auto z-30 flex aspect-square items-center justify-center p-4 font-bold"
    >
      <IconLink icon={icon ?? faArrowUpRightFromSquare} inline={Boolean(text)}>
        {text && <span class="ml-[0.4em]">{text}</span>}
      </IconLink>
    </a>
  );
};

const ProjectPreviewHoverLayer: FunctionComponent<{
  links: ProjectLink[];
  class?: string;
  alwaysVisible?: boolean;
  active?: boolean;
}> = ({ links, class: propClass, alwaysVisible = false, active = false }) => {
  const [noTransition, setNoTransition] = useState(true);

  useEffect(() => {
    setNoTransition(alwaysVisible);
  }, [alwaysVisible]);

  return (
    <div
      class={classNames(
        propClass,
        'clip-reveal theme-brand flex h-full w-full items-center justify-center overflow-hidden text-xl font-semibold text-white',
        {
          'group-hover:clip-reveal--active': !alwaysVisible,
          'clip-reveal--active': alwaysVisible || active,
          'delay-[0s] duration-[0s]': alwaysVisible || noTransition,
        }
      )}
      style={{
        '--initial-delay': '120ms',
      }}
    >
      {links.map((link) => (
        <SpotlightIconLink {...link} />
      ))}
    </div>
  );
};

const ProjectPreviewImage: FunctionComponent<{
  links: ProjectLink[];
  class?: string;
  image?: string;
  active?: boolean;
}> = ({ image, links, class: propClass, active }) => (
  <div
    class={classNames(
      propClass,
      'pointer-events-none relative z-20 flex w-full border-2 border-theme-tx',
      {
        'aspect-video': Boolean(image),
      }
    )}
  >
    {image && (
      <img class="absolute inset-0 h-full w-full object-cover" src={image} />
    )}
    <ProjectPreviewHoverLayer
      class={image ? 'absolute inset-0' : ''}
      links={links}
      active={active}
      alwaysVisible={!image}
    />
  </div>
);

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

  return (
    <li
      class={classNames(
        'box-shadow-button group relative flex list-none flex-col duration-300',
        {
          'box-shadow-button--active': isActive,
        }
      )}
    >
      <ProjectPreviewImage
        class={image ? '' : 'flex-grow'}
        image={image}
        links={projectLinks}
        active={isActive}
      />
      <div
        class={classNames(
          'z-10 h-full border-x-2 border-b-2 border-theme-tx bg-theme-bg p-2 font-serif',
          {
            'flex-shrink-0 basis-0': !image,
          }
        )}
      >
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
              class="pseudo-fill-parent"
              href={links[0]}
              onTouchMove={() => setCancelTap(true)}
              onTouchEnd={(e) => {
                if (!cancelTap && image && links.length > 1) {
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
    </li>
  );
};

export default ProjectPreview;
export type { ProjectPreviewProps };
export { ProjectPreview, ProjectPreviewImage, ProjectPreviewHoverLayer };
