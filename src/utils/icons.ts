interface IconLink {
  name: string;
  url?: string;
  icon: string;
  iconColor?: string;
}

// const icons = {
const icons: Record<string, IconLink> = {
  npm: {
    name: 'NPM',
    url: 'https://www.npmjs.com/',
    icon: 'simple-icons:npm',
    // icon: 'cib:npm',
    iconColor: 'logos:npm-icon',
  },
  '11ty': {
    name: 'Eleventy',
    url: 'https://www.11ty.dev/',
    icon: 'cib:eleventy',
    // iconColor: 'logos:eleventy',
    // iconColor: 'cib:eleventy',
    iconColor: 'simple-icons:eleventy',
  },
  nunjucks: {
    name: 'Nunjucks',
    url: 'https://mozilla.github.io/nunjucks/templating.html',
    icon: 'simple-icons:nunjucks',
    iconColor: 'vscode-icons:file-type-nunjucks',
  },
  sass: {
    name: 'Sass',
    url: 'https://sass-lang.com/',
    icon: 'cib:sass',
    // iconColor: 'logos:sass',
    iconColor: 'skill-icons:sass',
  },
  javascript: {
    name: 'JavaScript',
    icon: 'cib:javascript',
    // iconColor: 'logos:javascript',
    iconColor: 'skill-icons:javascript',
  },
  node: {
    name: 'Node',
    url: 'https://nodejs.org/en/',
    icon: 'simple-icons:nodejs',
    // iconColor: 'vscode-icons:file-type-node',
    // iconColor: 'logos:nodejs-icon',
    iconColor: 'skill-icons:nodejs-dark',
  },
  typescript: {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org/',
    icon: 'simple-icons:typescript',
    // iconColor: 'logos:typescript-icon',
    // iconColor: 'logos:typescript-icon-round',
    iconColor: 'skill-icons:typescript',
    // iconColor: 'vscode-icons:file-type-typescript-official',
  },
  react: {
    name: 'React',
    url: 'https://reactjs.org/',
    icon: 'simple-icons:react',
    // iconColor: 'logos:react',
    iconColor: 'skill-icons:react-dark',
    // iconColor: 'skill-icons:react-light',
  },
  nextjs: {
    name: 'Next.js',
    url: 'https://nextjs.org/',
    icon: 'simple-icons:nextdotjs',
    iconColor: 'logos:nextjs-icon',
  },
  tailwind: {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com/',
    icon: 'simple-icons:tailwindcss',
    // iconColor: 'logos:tailwindcss-icon',
    // iconColor: 'vscode-icons:file-type-tailwind',
    iconColor: 'skill-icons:tailwindcss-dark',
    // iconColor: 'skill-icons:tailwindcss-light',
  },
  aws: {
    name: 'Amazon Web Services',
    url: 'https://aws.amazon.com/',
    icon: 'simple-icons:amazonaws',
    // iconColor: 'logos:aws',
    iconColor: 'skill-icons:aws-dark',
    // iconColor: 'skill-icons:aws-light',
  },
  cloudformation: {
    name: 'AWS CloudFormation',
    url: 'https://www.npmjs.com/',
    icon: 'logos:aws-cloudformation',
    iconColor: 'logos:aws-cloudformation',
  },
  jekyll: {
    name: 'Jekyll',
    url: 'https://jekyllrb.com/',
    icon: 'simple-icons:jekyll',
    iconColor: 'vscode-icons:file-type-jekyll',
    // iconColor: 'logos:jekyll',
  },
};

export type { IconLink };
export { icons };
