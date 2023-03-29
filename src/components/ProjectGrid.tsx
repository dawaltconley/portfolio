import type { FunctionComponent, ComponentProps } from 'preact';
import ProjectPreview, { ProjectPreviewProps } from './ProjectPreview';
import { useState, useEffect, useMemo } from 'preact/hooks';

const ProjectFilter: FunctionComponent<{
  handleFilter: (tag: string) => void;
  tag: string;
  active?: string[];
  style?: 'tab' | 'link';
}> = ({ tag, style = 'link', active = [], handleFilter, children }) => {
  const isActive = active.includes(tag);
  const props: ComponentProps<'button'> = useMemo(() => {
    if (style === 'tab')
      return {
        class: `spotlight-button spotlight-button--no-js block overflow-hidden border-l-2 border-theme-tx bg-theme-bg p-4 font-medium uppercase leading-none transition-all duration-300 last:border-r-2 ${
          isActive ? 'bg-theme-br text-white' : ''
        }`,
        style: {
          '--scale': 1.5,
          ...(isActive
            ? { '--opacity': 0.3, '--color': 'var(--theme-bg)' }
            : {}),
        },
      };
    return {
      class: `text-xs ${isActive ? 'font-semibold' : 'text-theme-tx/80'}`,
    };
  }, [style, isActive]);
  return (
    <button {...props} onClick={() => handleFilter(tag)}>
      {style === 'link' && (isActive ? '[-] ' : '[+] ')}
      {children}
    </button>
  );
};

const tagLabels = new Map([
  ['website', 'website'],
  ['11ty', 'Eleventy'],
  ['sass', 'Sass'],
  ['nunjucks', 'Nunjucks'],
  ['npm', 'NPM'],
  ['parser', 'parser'],
  ['javascript', 'JavaScript'],
  ['app', 'app'],
  ['cli', 'command line'],
  ['node', 'Node.js'],
  ['typescript', 'TypeScript'],
  ['react', 'React'],
  ['nextjs', 'Next.js'],
  ['tailwind', 'Tailwind CSS'],
  ['aws', 'Amazon Web Services'],
  ['cloudformation', 'CloudFormation'],
  ['component', 'component'],
  ['jekyll', 'Jekyll'],
  ['liquid', 'Liquid'],
  ['audio', 'audio'],
]);

interface TagData {
  [tag: string]: {
    label: string;
    count: number;
  };
}

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
    const tagData: TagData = {};
    projects.forEach(({ tags }) =>
      tags.forEach((t) => {
        if (t in tagData) {
          tagData[t].count++; // actually can do this with a Map as well
        } else {
          const label = tagLabels.get(t) ?? t;
          tagData[t] = { count: 1, label };
        }
      })
    );
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
      <nav class="flex justify-center border-t-2 border-theme-tx">
        <p class="block p-4 font-medium uppercase leading-none">Portfolio:</p>
        <ProjectFilter
          tag="website"
          style="tab"
          active={filter}
          handleFilter={handleFilter}
        >
          Websites
        </ProjectFilter>
        <ProjectFilter
          tag="app"
          style="tab"
          active={filter}
          handleFilter={handleFilter}
        >
          Apps
        </ProjectFilter>
        <ProjectFilter
          tag="npm"
          style="tab"
          active={filter}
          handleFilter={handleFilter}
        >
          Packages
        </ProjectFilter>
      </nav>
      <ul class="my-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      <hr class="my-2 border-theme-tx/10" />
      <nav class="space-x-3 text-center leading-tight">
        {Object.entries(tags).map(([tag, { label, count }], i) => (
          <>
            {/* i > 0 && <span class="text-sm">–</span> */}
            <ProjectFilter
              tag={tag}
              active={filter}
              handleFilter={handleFilter}
            >{`${label} (${count})`}</ProjectFilter>
          </>
        ))}
      </nav>
    </>
  );
};

export default ProjectGrid;
export type { ProjectPreviewData };
