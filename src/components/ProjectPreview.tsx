import '@styles/project-preview.scss';
import type { DataIcon } from '@data/icons';
import type { FunctionComponent } from 'preact';
import IconLink from '@components/IconLink';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons/faArrowUpRightFromSquare';
import { useEffect, useRef } from 'preact/hooks';

import { SpotlightButton } from '@browser/spotlight-button';

interface ProjectPreviewProps {
  title: string;
  url: string;
  image: string;
  icons: DataIcon[];
}

const ProjectPreviewHoverLayer: FunctionComponent<{ url: string }> = ({
  url,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current?.querySelector<HTMLElement>('.spotlight-button');
    if (!layer) return;
    if (!SpotlightButton.isActive(layer)) {
      new SpotlightButton(layer);
    }
    return () => {
      SpotlightButton.instances.get(layer)?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      class="project__hover-layer theme-brand absolute inset-0 flex overflow-hidden text-xl font-semibold text-white"
    >
      <IconLink
        icon={faArrowUpRightFromSquare}
        url={url}
        class="spotlight-button pointer-events-auto z-30 m-auto flex aspect-square items-center justify-center p-4 font-bold"
      >
        <span class="ml-[0.4em]">Visit</span>
      </IconLink>
    </div>
  );
};

const ProjectPreviewImage: FunctionComponent<{
  image: string;
  url: string;
}> = ({ image, url }) => (
  <div class="pointer-events-none relative z-20 aspect-video w-full border-2 border-theme-tx">
    <img class="absolute inset-0 h-full w-full object-cover" src={image} />
    <ProjectPreviewHoverLayer url={url} />
  </div>
);

const ProjectPreview: FunctionComponent<ProjectPreviewProps> = ({
  title,
  url,
  image,
  icons,
  children,
}) => (
  <li class="project relative flex list-none flex-col">
    <ProjectPreviewImage image={image} url={url} />
    <div class="z-10 h-full border-x-2 border-b-2 border-theme-tx bg-theme-bg p-2 font-serif">
      <header>
        <ul class="float-right ml-4 flex space-x-2">
          {icons.map(
            (icon) =>
              icon.style.simple && (
                <IconLink icon={icon.style.simple} title={icon.name} tag="li" />
              )
          )}
        </ul>
        <h2 class="mr-auto text-2xl font-semibold leading-none underline decoration-theme-br decoration-2 underline-offset-2">
          <a class="pseudo-fill-parent" href={url}>
            {title}
          </a>
        </h2>
      </header>
      {children && <div class="clear-both mt-2 leading-5">{children}</div>}
    </div>
  </li>
);

export default ProjectPreview;
export type { ProjectPreviewProps };
export { ProjectPreview, ProjectPreviewImage, ProjectPreviewHoverLayer };
