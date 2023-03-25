import IconNpmSimple from '~icons/icomoon-free/npm';
import IconNpmColor from '~icons/logos/npm-icon';
import IconNpmSkill from '~icons/logos/npm-icon';
// import IconNpmSimple from '~icons/simple-icons/npm'
// import IconNpmSimple from '~icons/cib/npm'
// import IconNpmSimple from '~icons/logos/npm'

import Icon11tySimple from '~icons/cib/eleventy';
import Icon11tyColor from '~icons/simple-icons/eleventy';
import Icon11tySkill from '~icons/simple-icons/eleventy';
// import Icon11tySimple from '~icons/logos/eleventy';

import IconNjkSimple from '~icons/simple-icons/nunjucks';
import IconNjkColor from '~icons/vscode-icons/file-type-nunjucks';
import IconNjkSkill from '~icons/vscode-icons/file-type-nunjucks';

import IconSassSimple from '~icons/simple-icons/sass';
import IconSassColor from '~icons/logos/sass';
import IconSassSkill from '~icons/skill-icons/sass';
// import IconSassSimple from '~icons/cib/sass';

import IconJsSimple from '~icons/simple-icons/javascript';
import IconJsColor from '~icons/logos/javascript';
import IconJsSkill from '~icons/skill-icons/javascript';
// import IconJsSimple from '~icons/cib/javascript';

import IconNodeSimple from '~icons/simple-icons/nodejs';
import IconNodeColor from '~icons/logos/nodejs-icon';
import IconNodeSkill from '~icons/skill-icons/nodejs-dark';
// import IconNodeColor from '~icons/vscode-icons/file-type-node';

import IconTsSimple from '~icons/simple-icons/typescript';
import IconTsColor from '~icons/logos/typescript-icon';
import IconTsSkill from '~icons/skill-icons/typescript';
// import IconTsColor from '~icons/logos/typescript-icon-round';
// import IconTsColor from '~icons/vscode-icons/file-type-typescript';

import IconReactSimple from '~icons/simple-icons/react';
import IconReactColor from '~icons/logos/react';
import IconReactSkill from '~icons/skill-icons/react-dark';
// import IconReactColor from '~icons/skill-icons/react-light';

import IconNextSimple from '~icons/simple-icons/nextdotjs';
import IconNextColor from '~icons/logos/nextjs-icon';
import IconNextSkill from '~icons/skill-icons/nextjs-dark';
// import IconNextSkill from '~icons/skill-icons/nextjs-light';

import IconTailwindSimple from '~icons/simple-icons/tailwindcss';
import IconTailwindColor from '~icons/logos/tailwindcss-icon';
import IconTailwindSkill from '~icons/skill-icons/tailwindcss-dark';
// import IconTailwindColor from '~icons/vscode-icons/file-type-tailwind';
// import IconTailwindSkill from '~icons/skill-icons/tailwindcss-light';

import IconAwsSimple from '~icons/simple-icons/amazonaws';
import IconAwsColor from '~icons/logos/aws';
import IconAwsSkill from '~icons/skill-icons/aws-dark';
// import IconAwsColor from '~icons/skill-icons/aws-light';

import IconCfnColor from '~icons/logos/aws-cloudformation';
import IconCfnSkill from '~icons/logos/aws-cloudformation';

import IconJekyllSimple from '~icons/simple-icons/jekyll';
import IconJekyllColor from '~icons/vscode-icons/file-type-jekyll';
import IconJekyllSkill from '~icons/vscode-icons/file-type-jekyll';
// import IconJekyllColor from '~icons/logos/jekyll';

import IconGitHubFa from '~icons/fap-brands/github';
import IconLinkedInFa from '~icons/fap-brands/linkedin';

type IconComponent = typeof IconNpmSimple;

interface IconStyle {
  simple?: IconComponent;
  color?: IconComponent;
  skill?: IconComponent;
  fa?: IconComponent;
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

export type { IconLink, IconStyle, IconComponent };
export { icons, getIconFromUrl };
