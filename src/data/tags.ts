export const ProjectTag = [
  'website',
  'app',
  'cli',
  'audio',
  'parser',
  'component',
  'npm',
  'nextjs',
  '11ty',
  'nunjucks',
  'liquid',
  'jekyll',
  'javascript',
  'typescript',
  'react',
  'node',
  'sass',
  'tailwind',
  'aws',
  'cloudformation',
] as const;

export type ProjectTag = (typeof ProjectTag)[number];

export const labels: Record<ProjectTag, string> = {
  website: 'website',
  app: 'app',
  cli: 'command line',
  audio: 'audio',
  parser: 'parser',
  component: 'component',
  npm: 'NPM',
  nextjs: 'Next.js',
  '11ty': 'Eleventy',
  nunjucks: 'Nunjucks',
  liquid: 'Liquid',
  jekyll: 'Jekyll',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  node: 'Node.js',
  sass: 'Sass',
  tailwind: 'Tailwind',
  aws: 'Amazon Web Services',
  cloudformation: 'CloudFormation',
} as const;

export const isProjectTag = (tag: string): tag is ProjectTag => tag in labels;
