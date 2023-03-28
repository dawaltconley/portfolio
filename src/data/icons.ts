import type { IconDefinition as FaIconDefinition } from '@fortawesome/fontawesome-common-types';
import type { ExtendedIconifyIcon } from '@iconify/types';

import IconNpmSimple from '@iconify-icons/icomoon-free/npm';
import IconNpmColor from '@iconify-icons/logos/npm-icon';
import IconNpmSkill from '@iconify-icons/logos/npm-icon';
// import IconNpmSimple from '@iconify-icons/simple-icons/npm'
// import IconNpmSimple from '@iconify-icons/cib/npm'
// import IconNpmSimple from '@iconify-icons/logos/npm'

import Icon11tySimple from '@iconify-icons/cib/eleventy';
import Icon11tyColor from '@iconify-icons/simple-icons/eleventy';
import Icon11tySkill from '@iconify-icons/simple-icons/eleventy';
// import Icon11tySimple from '@iconify-icons/logos/eleventy';

import IconNjkSimple from '@iconify-icons/simple-icons/nunjucks';
import IconNjkColor from '@iconify-icons/vscode-icons/file-type-nunjucks';
import IconNjkSkill from '@iconify-icons/vscode-icons/file-type-nunjucks';

import IconSassSimple from '@iconify-icons/simple-icons/sass';
import IconSassColor from '@iconify-icons/logos/sass';
import IconSassSkill from '@iconify-icons/skill-icons/sass';
// import IconSassSimple from '@iconify-icons/cib/sass';

import IconJsSimple from '@iconify-icons/simple-icons/javascript';
import IconJsColor from '@iconify-icons/logos/javascript';
import IconJsSkill from '@iconify-icons/skill-icons/javascript';
// import IconJsSimple from '@iconify-icons/cib/javascript';

import IconNodeSimple from '@iconify-icons/simple-icons/nodejs';
import IconNodeColor from '@iconify-icons/logos/nodejs-icon';
import IconNodeSkill from '@iconify-icons/skill-icons/nodejs-dark';
// import IconNodeColor from '@iconify-icons/vscode-icons/file-type-node';

import IconTsSimple from '@iconify-icons/simple-icons/typescript';
import IconTsColor from '@iconify-icons/logos/typescript-icon';
import IconTsSkill from '@iconify-icons/skill-icons/typescript';
// import IconTsColor from '@iconify-icons/logos/typescript-icon-round';
// import IconTsColor from '@iconify-icons/vscode-icons/file-type-typescript';

import IconReactSimple from '@iconify-icons/simple-icons/react';
import IconReactColor from '@iconify-icons/logos/react';
import IconReactSkill from '@iconify-icons/skill-icons/react-dark';
// import IconReactColor from '@iconify-icons/skill-icons/react-light';

import IconNextSimple from '@iconify-icons/simple-icons/nextdotjs';
import IconNextColor from '@iconify-icons/logos/nextjs-icon';
import IconNextSkill from '@iconify-icons/skill-icons/nextjs-dark';
// import IconNextSkill from '@iconify-icons/skill-icons/nextjs-light';

import IconTailwindSimple from '@iconify-icons/simple-icons/tailwindcss';
import IconTailwindColor from '@iconify-icons/logos/tailwindcss-icon';
import IconTailwindSkill from '@iconify-icons/skill-icons/tailwindcss-dark';
// import IconTailwindColor from '@iconify-icons/vscode-icons/file-type-tailwind';
// import IconTailwindSkill from '@iconify-icons/skill-icons/tailwindcss-light';

import IconAwsSimple from '@iconify-icons/simple-icons/amazonaws';
import IconAwsColor from '@iconify-icons/logos/aws';
import IconAwsSkill from '@iconify-icons/skill-icons/aws-dark';
// import IconAwsColor from '@iconify-icons/skill-icons/aws-light';

import IconCfnColor from '@iconify-icons/logos/aws-cloudformation';
import IconCfnSkill from '@iconify-icons/logos/aws-cloudformation';

import IconJekyllSimple from '@iconify-icons/simple-icons/jekyll';
import IconJekyllColor from '@iconify-icons/vscode-icons/file-type-jekyll';
import IconJekyllSkill from '@iconify-icons/vscode-icons/file-type-jekyll';
// import IconJekyllColor from '@iconify-icons/logos/jekyll';

import { definition as IconGitHubFa } from '@fortawesome/free-brands-svg-icons/faGithub';
import { definition as IconLinkedInFa } from '@fortawesome/free-brands-svg-icons/faLinkedin';

type IconDefinition = FaIconDefinition | ExtendedIconifyIcon;

interface IconStyle {
  simple?: IconDefinition;
  color?: IconDefinition;
  skill?: IconDefinition;
  fa?: IconDefinition;
}

interface IconLink {
  name: string;
  url?: string;
  type: IconStyle;
}

const icons: Record<string, IconLink> = {
  npm: {
    name: 'NPM',
    url: 'https://www.npmjs.com/',
    type: {
      simple: IconNpmSimple,
      color: IconNpmColor,
      skill: IconNpmSkill,
    },
  },
  '11ty': {
    name: 'Eleventy',
    url: 'https://www.11ty.dev/',
    type: {
      simple: Icon11tySimple,
      color: Icon11tyColor,
      skill: Icon11tySkill,
    },
  },
  nunjucks: {
    name: 'Nunjucks',
    url: 'https://mozilla.github.io/nunjucks/templating.html',
    type: {
      simple: IconNjkSimple,
      color: IconNjkColor,
      skill: IconNjkSkill,
    },
  },
  sass: {
    name: 'Sass',
    url: 'https://sass-lang.com/',
    type: {
      simple: IconSassSimple,
      color: IconSassColor,
      skill: IconSassSkill,
    },
  },
  javascript: {
    name: 'JavaScript',
    type: {
      simple: IconJsSimple,
      color: IconJsColor,
      skill: IconJsSkill,
    },
  },
  node: {
    name: 'Node',
    url: 'https://nodejs.org/en/',
    type: {
      simple: IconNodeSimple,
      color: IconNodeColor,
      skill: IconNodeSkill,
    },
  },
  typescript: {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org/',
    type: {
      simple: IconTsSimple,
      color: IconTsColor,
      skill: IconTsSkill,
    },
  },
  react: {
    name: 'React',
    url: 'https://reactjs.org/',
    type: {
      simple: IconReactSimple,
      color: IconReactColor,
      skill: IconReactSkill,
    },
  },
  nextjs: {
    name: 'Next.js',
    url: 'https://nextjs.org/',
    type: {
      simple: IconNextSimple,
      color: IconNextColor,
      skill: IconNextSkill,
    },
  },
  tailwind: {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com/',
    type: {
      simple: IconTailwindSimple,
      color: IconTailwindColor,
      skill: IconTailwindSkill,
    },
  },
  aws: {
    name: 'Amazon Web Services',
    url: 'https://aws.amazon.com/',
    type: {
      simple: IconAwsSimple,
      color: IconAwsColor,
      skill: IconAwsSkill,
    },
  },
  cloudformation: {
    name: 'AWS CloudFormation',
    url: 'https://www.npmjs.com/',
    type: {
      color: IconCfnColor,
      skill: IconCfnSkill,
    },
  },
  jekyll: {
    name: 'Jekyll',
    url: 'https://jekyllrb.com/',
    type: {
      simple: IconJekyllSimple,
      color: IconJekyllColor,
      skill: IconJekyllSkill,
    },
  },
  github: {
    name: 'GitHub',
    url: 'https://github.com',
    type: {
      fa: IconGitHubFa,
    },
  },
  linkedin: {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    type: {
      fa: IconLinkedInFa,
    },
  },
} as const;

const hostDomainIconId: Record<string, keyof typeof icons> = Object.entries(
  icons
).reduce((map: Record<string, string>, [id, { url }]) => {
  if (!url) return map;
  const { host } = new URL(url);
  map[host] = id;
  return map;
}, {});

const getIconFromUrl = (url: string | URL): IconLink | undefined => {
  try {
    const { host } = new URL(url);
    return icons[hostDomainIconId[host]];
  } catch (e) {
    if (e instanceof Error && 'code' in e && e.code === 'ERR_INVALID_URL')
      return undefined;
  }
};

export type { IconLink, IconStyle, IconDefinition };
export { icons, getIconFromUrl };
