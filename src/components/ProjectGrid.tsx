import type { FunctionComponent } from 'preact';
import ProjectPreview, { ProjectPreviewProps } from './ProjectPreview';
import { useState } from 'preact/hooks';

const ProjectFilter: FunctionComponent<{
  handleFilter: (tag: string) => void;
  tag: string;
  active?: string[];
}> = ({ tag, active = [], handleFilter, children }) => {
  return (
    <button
      class={`block px-4 py-2 ${active.includes(tag) ? 'font-bold' : ''}`}
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

  const handleFilter = (tag: string): void => setFilter([tag]);

  return (
    <>
      <div class="flex justify-center">
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
      <ul class="container mx-auto grid gap-4 py-8 sm:grid-cols-2 xl:grid-cols-3">
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
