import '@styles/project-preview.scss';
import type { DataIcon, IconDefinition } from '@data/icons';
import type { FunctionComponent } from 'preact';
import IconLink from '@components/IconLink';
import { getIconFromUrl, getDefaultIconDefinition } from '@data/icons';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons/faArrowUpRightFromSquare';
import { useEffect, useMemo, useRef } from 'preact/hooks';

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

const ProjectPreviewHoverLayer: FunctionComponent<{ links: ProjectLink[] }> = ({
  links,
}) => {
  return (
    <div class="project__hover-layer theme-brand absolute inset-0 flex items-center justify-center overflow-hidden text-xl font-semibold text-white">
      {links.map((link) => (
        <SpotlightIconLink {...link} />
      ))}
    </div>
  );
};

const ProjectPreviewImage: FunctionComponent<{
  image: string;
  links: ProjectLink[];
}> = ({ image, links }) => (
  <div class="pointer-events-none relative z-20 aspect-video w-full border-2 border-theme-tx">
    <img class="absolute inset-0 h-full w-full object-cover" src={image} />
    <ProjectPreviewHoverLayer links={links} />
  </div>
);

interface ProjectPreviewProps {
  title: string;
  links: string[];
  image: string;
  icons: DataIcon[];
}

const ProjectPreview: FunctionComponent<ProjectPreviewProps> = ({
  title,
  links,
  image,
  icons,
  children,
}) => {
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
    <li class="project relative flex list-none flex-col">
      <ProjectPreviewImage image={image} links={projectLinks} />
      <div class="z-10 h-full border-x-2 border-b-2 border-theme-tx bg-theme-bg p-2 font-serif">
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
            <a class="pseudo-fill-parent" href={links[0]}>
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
