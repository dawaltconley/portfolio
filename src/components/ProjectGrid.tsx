import type { FunctionComponent } from 'preact';
import ProjectPreview, { ProjectPreviewProps } from './ProjectPreview';

interface ProjectPreviewData extends ProjectPreviewProps {
  tags: string[];
  excerpt?: string;
}

const ProjectGrid: FunctionComponent<{
  projects: ProjectPreviewData[];
  filter?: string | string[];
}> = ({ projects, filter }) => {
  return (
    <ul class="container mx-auto grid gap-4 py-8 sm:grid-cols-2 xl:grid-cols-3">
      {projects
        .filter(({ tags }) =>
          filter && filter.length
            ? ([] as string[]).concat(filter).some((f) => tags.includes(f))
            : true
        )
        .map(({ tags, excerpt, ...project }) => (
          <ProjectPreview {...project}>
            <p>{excerpt}</p>
          </ProjectPreview>
        ))}
    </ul>
  );
};

export default ProjectGrid;
export type { ProjectPreviewData };
