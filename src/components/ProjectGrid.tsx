import type { FunctionComponent } from 'preact';
import type { ImageProps } from './Image';
import { ProjectTag, labels as tagLabels, isProjectTag } from '@data/tags';
import ProjectPreview, { ProjectPreviewProps } from './ProjectPreview';
import { makeFilter } from './Filter';
import { useState, useEffect, useMemo } from 'preact/hooks';
import classNames from 'classnames';
import { coerceToArray, shuffle } from '@browser/utils';
import twColors from 'tailwindcss/colors';

const ProjectFilterTab = makeFilter(({ isActive, onClick, children }) => (
  <button
    class={classNames(
      'spotlight-button spotlight-button--no-js block overflow-hidden rounded-full px-5 py-4 uppercase leading-none text-indigo-50 transition-all',
      {
        'spotlight-button--active bg-indigo-700 text-white hover:bg-indigo-500':
          isActive,
      }
    )}
    style={{
      '--scale': 1.5,
      '--opacity': 0.3,
      '--color': twColors.indigo['700'],
    }}
    onClick={onClick}
  >
    {children}
  </button>
));

const ProjectFilterLink = makeFilter(({ isActive, onClick, children }) => (
  <button
    class={classNames('text-xs', {
      'font-semibold text-rose-100': isActive,
      'text-indigo-300': !isActive,
    })}
    onClick={onClick}
  >
    {isActive ? '[-] ' : '[+] '}
    {children}
  </button>
));

type TagData = Map<ProjectTag, { label: string; count: number }>;

export interface ProjectPreviewData extends Omit<ProjectPreviewProps, 'image'> {
  id: string;
  tags: ProjectTag[];
  images?: ImageProps[];
  excerpt?: string;
}

export interface ProjectGridProps {
  projects: ProjectPreviewData[];
  filter?: ProjectTag | ProjectTag[];
  slideshowInterval?: number;
}

const ProjectGrid: FunctionComponent<ProjectGridProps> = ({
  projects,
  filter: initFilter = [],
  slideshowInterval = 10000,
}) => {
  const [filter, setFilter] = useState(coerceToArray(initFilter));

  const tags: TagData = useMemo(() => {
    const tagData: TagData = new Map(
      ProjectTag.map((tag) => [tag, { label: tagLabels[tag], count: 0 }])
    );
    projects.forEach(({ tags }) =>
      tags.forEach((t) => {
        const data = tagData.get(t);
        if (data) {
          data.count++;
        } else {
          tagData.set(t, { count: 1, label: t });
        }
      })
    );
    tagData.forEach(({ count }, tag, map) => {
      if (count === 0) {
        map.delete(tag);
      }
    });
    return tagData;
  }, [projects]);

  const updateSearchParams = (newFilter: typeof filter): void => {
    const url = new URL(window.location.href);
    url.searchParams.set('filter', newFilter.join(','));
    history.pushState({ filter: newFilter }, '', url);
  };

  const updateFilterFromSearchParams = (): void => {
    const paramData = new URLSearchParams(location.search).get('filter');
    const savedFilters = paramData?.split(',').filter(isProjectTag);
    if (savedFilters) setFilter(savedFilters);
  };

  const handleFilter = (filters: string[]): void => {
    const tags = filters.filter(isProjectTag);
    setFilter(tags);
    updateSearchParams(tags);
  };

  useEffect(() => {
    updateFilterFromSearchParams();
    window.addEventListener('popstate', updateFilterFromSearchParams);
  }, []);

  const filteredProjects = useMemo(
    () =>
      projects.filter(({ tags }) =>
        filter.length ? filter.some((f) => tags.includes(f)) : true
      ),
    [projects, filter]
  );

  const [imageMap, setImageMap] = useState<Map<string, number>>(new Map());
  useEffect(() => {
    const projectsWithImages = shuffle(
      filteredProjects.filter((p) => p.images)
    );
    if (projectsWithImages.length === 0) return;

    setImageMap(
      (m) => new Map(projectsWithImages.map(({ id }) => [id, m.get(id) || 0]))
    );

    let i = 0;
    const interval = window.setInterval(() => {
      const { id } = projectsWithImages[i++ % projectsWithImages.length];
      setImageMap((m) => new Map(m.set(id, (m.get(id) ?? 0) + 1)));
    }, slideshowInterval);

    return () => window.clearInterval(interval);
  }, [filteredProjects, slideshowInterval]);

  return (
    <>
      <nav class="flex justify-center space-x-4">
        <ProjectFilterTab
          tags="website"
          active={filter}
          handleFilter={handleFilter}
        >
          Websites
        </ProjectFilterTab>
        <ProjectFilterTab
          tags="app"
          active={filter}
          handleFilter={handleFilter}
        >
          Apps
        </ProjectFilterTab>
        <ProjectFilterTab
          tags={'package'}
          active={filter}
          handleFilter={handleFilter}
        >
          Packages
        </ProjectFilterTab>
      </nav>
      <ul class="my-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map(({ tags, excerpt, images, ...project }) => {
          const imageIndex = imageMap.get(project.id) ?? 0;
          const image = images && images[imageIndex % images.length];
          return (
            <ProjectPreview key={project.id} {...project} image={image}>
              {
                // eslint-disable-next-line react/no-danger
                excerpt && <p dangerouslySetInnerHTML={{ __html: excerpt }} />
              }
            </ProjectPreview>
          );
        })}
      </ul>
      <nav class="space-x-3 text-center leading-tight">
        {Array.from(tags.entries()).map(([tag, { label, count }]) => (
          <ProjectFilterLink
            key={tag}
            tags={tag}
            active={filter}
            handleFilter={handleFilter}
          >
            {`${label} (${count})`}
          </ProjectFilterLink>
        ))}
      </nav>
    </>
  );
};

export default ProjectGrid;
