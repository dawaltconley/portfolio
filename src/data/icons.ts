import type { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

interface IconStyle {
  simple?: string;
  color?: string;
  skill?: string;
  fa?: IconDefinition;
}

interface IconLink {
  name: string;
  url?: string;
  type: IconStyle;
}

// const icons = {
const icons: Record<string, IconLink> = {
  npm: {
    name: 'NPM',
    url: 'https://www.npmjs.com/',
    type: {
      // simple: 'simple-icons:npm',
      // simple: 'cib:npm',
      simple: 'icomoon-free:npm',
      // color: 'logos:npm',
      color: 'logos:npm-icon',
      skill: 'logos:npm-icon',
    },
  },
  '11ty': {
    name: 'Eleventy',
    url: 'https://www.11ty.dev/',
    type: {
      simple: 'cib:eleventy',
      // simple: 'logos:eleventy',
      color: 'simple-icons:eleventy',
      skill: 'simple-icons:eleventy',
    },
  },
  nunjucks: {
    name: 'Nunjucks',
    url: 'https://mozilla.github.io/nunjucks/templating.html',
    type: {
      simple: 'simple-icons:nunjucks',
      color: 'vscode-icons:file-type-nunjucks',
      skill: 'vscode-icons:file-type-nunjucks',
    },
  },
  sass: {
    name: 'Sass',
    url: 'https://sass-lang.com/',
    type: {
      // simple: 'cib:sass',
      simple: 'simple-icons:sass',
      color: 'logos:sass',
      skill: 'skill-icons:sass',
    },
  },
  javascript: {
    name: 'JavaScript',
    type: {
      // simple: 'cib:javascript',
      simple: 'simple-icons:javascript',
      color: 'logos:javascript',
      skill: 'skill-icons:javascript',
    },
  },
  node: {
    name: 'Node',
    url: 'https://nodejs.org/en/',
    type: {
      simple: 'simple-icons:nodejs',
      // color: 'vscode-icons:file-type-node',
      color: 'logos:nodejs-icon',
      skill: 'skill-icons:nodejs-dark',
    },
  },
  typescript: {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org/',
    type: {
      simple: 'simple-icons:typescript',
      color: 'logos:typescript-icon',
      // color: 'logos:typescript-icon-round',
      // color: 'vscode-icons:file-type-typescript-official',
      skill: 'skill-icons:typescript',
    },
  },
  react: {
    name: 'React',
    url: 'https://reactjs.org/',
    type: {
      simple: 'simple-icons:react',
      color: 'logos:react',
      skill: 'skill-icons:react-dark',
      // color: 'skill-icons:react-light',
    },
  },
  nextjs: {
    name: 'Next.js',
    url: 'https://nextjs.org/',
    type: {
      simple: 'simple-icons:nextdotjs',
      color: 'logos:nextjs-icon',
      skill: 'skill-icons:nextjs-dark',
      // skill: 'skill-icons:nextjs-light',
    },
  },
  tailwind: {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com/',
    type: {
      simple: 'simple-icons:tailwindcss',
      color: 'logos:tailwindcss-icon',
      // color: 'vscode-icons:file-type-tailwind',
      skill: 'skill-icons:tailwindcss-dark',
      // color: 'skill-icons:tailwindcss-light',
    },
  },
  aws: {
    name: 'Amazon Web Services',
    url: 'https://aws.amazon.com/',
    type: {
      simple: 'simple-icons:amazonaws',
      color: 'logos:aws',
      skill: 'skill-icons:aws-dark',
      // color: 'skill-icons:aws-light',
    },
  },
  cloudformation: {
    name: 'AWS CloudFormation',
    url: 'https://www.npmjs.com/',
    type: {
      color: 'logos:aws-cloudformation',
      skill: 'logos:aws-cloudformation',
    },
  },
  jekyll: {
    name: 'Jekyll',
    url: 'https://jekyllrb.com/',
    type: {
      simple: 'simple-icons:jekyll',
      color: 'vscode-icons:file-type-jekyll',
      // color: 'logos:jekyll',
      skill: 'vscode-icons:file-type-jekyll',
    },
  },
  github: {
    name: 'GitHub',
    url: 'https://github.com',
    type: {
      fa: faGithub,
    },
  },
  linkedin: {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    type: {
      fa: faLinkedin,
    },
  },
} as const;

const hostDomainIconId: Record<string, keyof typeof icons> = Object.entries(icons).reduce(
  (map: Record<string, string>, [id, {url}]) => {
    if (!url) return map;
    const { host } = new URL(url);
    map[host] = id;
    return map;
  },
  {}
);

const getIconFromUrl = (url: string | URL): IconLink | undefined => {
  try {
    const { host } = new URL(url);
    return icons[hostDomainIconId[host]];
  } catch (e) {
    if (e instanceof Error && 'code' in e && e.code === 'ERR_INVALID_URL')
      return undefined;
  }
};

export type { IconLink, IconStyle };
export { icons, getIconFromUrl };
