import type { FunctionComponent, ComponentProps } from 'preact';
import ProjectPreview, { ProjectPreviewProps } from './ProjectPreview';
import { useState, useEffect, useMemo } from 'preact/hooks';

const ProjectFilter: FunctionComponent<{
  handleFilter: (tags: string[]) => void;
  tags: string | string[];
  active?: string[];
  style?: 'tab' | 'link' | 'list';
}> = ({
  tags: initTags,
  style = 'link',
  active = [],
  handleFilter,
  children,
}) => {
  const tags = useMemo(() => ([] as string[]).concat(initTags), [initTags]);
  const isActive = tags.every((tag) => active.includes(tag));
  if (style === 'tab')
    return (
      <button
        class={`spotlight-button spotlight-button--no-js block overflow-hidden border-l-2 border-theme-tx bg-theme-bg p-4 font-medium uppercase leading-none transition-all duration-300 last:border-r-2 ${
          isActive ? 'bg-theme-br text-white' : ''
        }`}
        style={{
          '--scale': 1.5,
          ...(isActive
            ? { '--opacity': 0.3, '--color': 'var(--theme-bg)' }
            : {}),
        }}
        onClick={() => handleFilter(tags)}
      >
        {children}
      </button>
    );
  if (style === 'link')
    return (
      <button
        class={`text-xs ${isActive ? 'font-semibold' : 'text-theme-tx/80'}`}
        onClick={() => handleFilter(tags)}
      >
        {isActive ? '[-] ' : '[+] '}
        {children}
      </button>
    );
  return (
    <button
      class={`inline-list-item list-inside text-xs marker:mr-2 lg:list-item ${
        isActive
          ? 'marker:content-minus font-semibold'
          : 'marker:content-plus text-theme-tx/80'
      }`}
      onClick={() => handleFilter(tags)}
    >
      {children}
    </button>
  );
};

// const ProjectFilterTag: FunctionComponent<{
//   handleFilter: (tags: string[]) => void;
//   tags: string | string[];
//   active?: string[];
//   style?: 'tab' | 'link';
// }> = ({
//   tags: initTags,
//   style = 'link',
//   active = [],
//   handleFilter,
//   children,
// }) => {
//
// }

const tagLabels = new Map([
  ['website', 'website'],
  ['app', 'app'],
  ['npm', 'package'],
  ['cli', 'command line'],
  ['audio', 'audio'],
  ['parser', 'parser'],
  ['component', 'component'],
  ['nextjs', 'Next.js'],
  ['11ty', 'Eleventy'],
  ['nunjucks', 'Nunjucks'],
  ['liquid', 'Liquid'],
  ['jekyll', 'Jekyll'],
  ['javascript', 'JavaScript'],
  ['typescript', 'TypeScript'],
  ['react', 'React'],
  ['node', 'Node.js'],
  ['sass', 'Sass'],
  ['tailwind', 'Tailwind'],
  ['aws', 'Amazon Web Services'],
  ['cloudformation', 'CloudFormation'],
]);

type TagData = Map<string, { label: string; count: number }>;

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

  const tags: TagData = useMemo(() => {
    const tagData: TagData = new Map();
    tagLabels.forEach((label, tag) => tagData.set(tag, { label, count: 0 }));
    projects.forEach(({ tags }) =>
      tags.forEach((t) => {
        const data = tagData.get(t);
        if (data) {
          data.count++;
        } else {
          tagData.set(t, { count: 1, label: tagLabels.get(t) ?? t });
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
    const savedFilters = new URLSearchParams(location.search).get('filter');
    if (savedFilters) setFilter(savedFilters.split(','));
  };

  const handleFilter = (tags: string[]): void => {
    setFilter(tags);
    updateSearchParams(tags);
  };

  useEffect(() => {
    updateFilterFromSearchParams();
    window.addEventListener('popstate', updateFilterFromSearchParams);
  }, []);

  return (
    <>
      <nav class="flex justify-center border-t-2 border-theme-tx">
        <ProjectFilter
          tags="website"
          style="tab"
          active={filter}
          handleFilter={handleFilter}
        >
          Websites
        </ProjectFilter>
        <ProjectFilter
          tags="app"
          style="tab"
          active={filter}
          handleFilter={handleFilter}
        >
          Apps
        </ProjectFilter>
        <ProjectFilter
          tags={['npm', 'aws']}
          style="tab"
          active={filter}
          handleFilter={handleFilter}
        >
          Packages
        </ProjectFilter>
      </nav>
      <div class="my-8 xl:flex xl:items-start">
        <ul class="grid basis-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects
            .filter(({ tags }) =>
              filter.length ? filter.some((f) => tags.includes(f)) : true
            )
            .map(({ tags, excerpt, ...project }) => (
              <ProjectPreview {...project}>
                {excerpt && <p dangerouslySetInnerHTML={{ __html: excerpt }} />}
              </ProjectPreview>
            ))}
        </ul>
        <nav class="inline-block flex-col items-start justify-start space-x-3 border-theme-tx/10 text-center leading-tight xl:ml-4 xl:flex xl:space-x-0 xl:space-y-1 xl:whitespace-nowrap xl:border-l xl:pl-4">
          <h2 class="mb-2 mt-8 text-xs font-semibold uppercase text-theme-br h-line">
            All tags
          </h2>
          {Array.from(tags.entries()).map(([tag, { label, count }]) => (
            <ProjectFilter
              style="list"
              tags={tag}
              active={filter}
              handleFilter={handleFilter}
            >{`${label} (${count})`}</ProjectFilter>
          ))}
        </nav>
      </div>
    </>
  );
};

export default ProjectGrid;
export type { ProjectPreviewData };
