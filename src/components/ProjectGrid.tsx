import type { FunctionComponent, ComponentProps } from 'preact';
import type { ImageProps } from './Image';
import ProjectPreview, { ProjectPreviewProps } from './ProjectPreview';
import { useState, useEffect, useMemo } from 'preact/hooks';

const shuffle = <T,>(arr: T[]): T[] => {
  const len = arr.length;
  const remaining: T[] = [...arr];
  const shuffled: T[] = [];
  while (shuffled.length < len) {
    const i = Math.floor(Math.random() * remaining.length);
    const item = remaining.splice(i, 1)[0];
    shuffled.push(item);
  }
  return shuffled;
};

const ProjectFilter: FunctionComponent<{
  handleFilter: (tags: string[]) => void;
  tags: string | string[];
  active?: string[];
  style?: 'tab' | 'link';
}> = ({
  tags: initTags,
  style = 'link',
  active = [],
  handleFilter,
  children,
}) => {
  const tags = useMemo(() => ([] as string[]).concat(initTags), [initTags]);
  const isActive = tags.every((tag) => active.includes(tag));
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
    <button {...props} onClick={() => handleFilter(tags)}>
      {style === 'link' && (isActive ? '[-] ' : '[+] ')}
      {children}
    </button>
  );
};

const tagLabels = new Map([
  ['website', 'website'],
  ['app', 'app'],
  ['cli', 'command line'],
  ['audio', 'audio'],
  ['parser', 'parser'],
  ['component', 'component'],
  ['npm', 'NPM'],
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

const nextImageInterval = 10000;

interface ProjectPreviewData extends Omit<ProjectPreviewProps, 'image'> {
  id: string;
  tags: string[];
  images?: ImageProps[];
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
    }, nextImageInterval);

    return () => window.clearInterval(interval);
  }, [filteredProjects]);

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
      <ul class="my-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      <hr class="my-2 border-theme-tx/10" />
      <nav class="space-x-3 text-center leading-tight">
        {Array.from(tags.entries()).map(([tag, { label, count }]) => (
          <ProjectFilter
            key={tag}
            tags={tag}
            active={filter}
            handleFilter={handleFilter}
          >{`${label} (${count})`}</ProjectFilter>
        ))}
      </nav>
    </>
  );
};

export default ProjectGrid;
export type { ProjectPreviewData };
