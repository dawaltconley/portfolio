import type { FunctionComponent } from 'preact';
import ProjectPreview, { ProjectPreviewProps } from './ProjectPreview';
import { useState, useEffect } from 'preact/hooks';

const ProjectFilter: FunctionComponent<{
  handleFilter: (tag: string) => void;
  tag: string;
  active?: string[];
}> = ({ tag, active = [], handleFilter, children }) => {
  const isActive = active.includes(tag);
  return (
    <button
      class={`spotlight-button spotlight-button--no-js block overflow-hidden border-l-2 border-theme-tx bg-theme-bg p-4 font-medium uppercase leading-none transition-all duration-300 last:border-r-2 ${
        isActive ? 'bg-theme-br text-white' : ''
      }`}
      style={{
        '--scale': 1.5,
        ...(isActive ? { '--opacity': 0.3, '--color': 'var(--theme-bg)' } : {}),
      }}
      onClick={() => handleFilter(tag)}
    >
      {children}
    </button>
  );
};

interface ProjectPreviewData extends ProjectPreviewProps {
  tags: string[];
  excerpt?: string;
}

const ProjectGrid: FunctionComponent<{
  projects: ProjectPreviewData[];
  filter?: string | string[];
}> = ({ projects, filter: initFilter }) => {
  const [filter, setFilter] = useState(
    ([] as string[]).concat(initFilter ?? [])
  );

  const updateSearchParams = (newFilter: typeof filter): void => {
    const url = new URL(window.location.href);
    url.searchParams.set('filter', newFilter.join(','));
    history.pushState({ filter: newFilter }, '', url);
  };

  const updateFilterFromSearchParams = (): void => {
    const savedFilters = new URLSearchParams(location.search).get('filter');
    if (savedFilters) setFilter(savedFilters.split(','));
  };

  const handleFilter = (tag: string): void => {
    const filter = [tag];
    setFilter(filter);
    updateSearchParams(filter);
  };

  useEffect(() => {
    updateFilterFromSearchParams();
    window.addEventListener('popstate', updateFilterFromSearchParams);
  }, []);

  return (
    <>
      <div class="flex justify-center border-t-2 border-theme-tx">
        {/* <p class="block p-4 font-medium uppercase leading-none">Portfolio:</p> */}
        <ProjectFilter
          tag="website"
          active={filter}
          handleFilter={handleFilter}
        >
          Websites
        </ProjectFilter>
        <ProjectFilter tag="app" active={filter} handleFilter={handleFilter}>
          Apps
        </ProjectFilter>
        <ProjectFilter tag="npm" active={filter} handleFilter={handleFilter}>
          Packages
        </ProjectFilter>
      </div>
      <ul class="grid gap-4 py-8 sm:grid-cols-2 xl:grid-cols-3">
        {projects
          .filter(({ tags }) =>
            filter.length ? filter.some((f) => tags.includes(f)) : true
          )
          .map(({ tags, excerpt, ...project }) => (
            <ProjectPreview {...project}>
              <p>{excerpt}</p>
            </ProjectPreview>
          ))}
      </ul>
    </>
  );
};

export default ProjectGrid;
export type { ProjectPreviewData };
