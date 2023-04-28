/* eslint-disable no-duplicate-imports, @typescript-eslint/no-duplicate-imports */

import type { IconDefinition as FaIconDefinition } from '@fortawesome/fontawesome-common-types';
import type { IconifyIcon } from '@iconify/types';

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

import { definition as IconGitHubSimple } from '@fortawesome/free-brands-svg-icons/faGithub';
import { definition as IconLinkedInSimple } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { definition as IconEmailSimple } from '@fortawesome/pro-regular-svg-icons/faEnvelope';
import { definition as IconPhoneSimple } from '@fortawesome/pro-regular-svg-icons/faPhone';

type IconDefinition = FaIconDefinition | IconifyIcon;

const iconStyles = ['simple', 'color', 'skill'] as const;
type DataIconStyle = Partial<
  Record<(typeof iconStyles)[number], IconDefinition>
>;

interface DataIcon {
  name: string;
  url?: string;
  style: DataIconStyle;
}

const icons: Record<string, DataIcon> = {
  email: {
    name: 'Email',
    style: {
      simple: IconEmailSimple,
    },
  },
  phone: {
    name: 'Phone',
    style: {
      simple: IconPhoneSimple,
    },
  },
  npm: {
    name: 'NPM',
    url: 'https://www.npmjs.com/',
    style: {
      simple: IconNpmSimple,
      color: IconNpmColor,
      skill: IconNpmSkill,
    },
  },
  '11ty': {
    name: 'Eleventy',
    url: 'https://www.11ty.dev/',
    style: {
      simple: Icon11tySimple,
      color: Icon11tyColor,
      skill: Icon11tySkill,
    },
  },
  nunjucks: {
    name: 'Nunjucks',
    url: 'https://mozilla.github.io/nunjucks/templating.html',
    style: {
      simple: IconNjkSimple,
      color: IconNjkColor,
      skill: IconNjkSkill,
    },
  },
  sass: {
    name: 'Sass',
    url: 'https://sass-lang.com/',
    style: {
      simple: IconSassSimple,
      color: IconSassColor,
      skill: IconSassSkill,
    },
  },
  javascript: {
    name: 'JavaScript',
    style: {
      simple: IconJsSimple,
      color: IconJsColor,
      skill: IconJsSkill,
    },
  },
  node: {
    name: 'Node',
    url: 'https://nodejs.org/en/',
    style: {
      simple: IconNodeSimple,
      color: IconNodeColor,
      skill: IconNodeSkill,
    },
  },
  typescript: {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org/',
    style: {
      simple: IconTsSimple,
      color: IconTsColor,
      skill: IconTsSkill,
    },
  },
  react: {
    name: 'React',
    url: 'https://reactjs.org/',
    style: {
      simple: IconReactSimple,
      color: IconReactColor,
      skill: IconReactSkill,
    },
  },
  nextjs: {
    name: 'Next.js',
    url: 'https://nextjs.org/',
    style: {
      simple: IconNextSimple,
      color: IconNextColor,
      skill: IconNextSkill,
    },
  },
  tailwind: {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com/',
    style: {
      simple: IconTailwindSimple,
      color: IconTailwindColor,
      skill: IconTailwindSkill,
    },
  },
  aws: {
    name: 'Amazon Web Services',
    url: 'https://aws.amazon.com/',
    style: {
      simple: IconAwsSimple,
      color: IconAwsColor,
      skill: IconAwsSkill,
    },
  },
  cloudformation: {
    name: 'AWS CloudFormation',
    style: {
      color: IconCfnColor,
      skill: IconCfnSkill,
    },
  },
  jekyll: {
    name: 'Jekyll',
    url: 'https://jekyllrb.com/',
    style: {
      simple: IconJekyllSimple,
      color: IconJekyllColor,
      skill: IconJekyllSkill,
    },
  },
  github: {
    name: 'GitHub',
    url: 'https://github.com',
    style: {
      simple: IconGitHubSimple,
    },
  },
  linkedin: {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    style: {
      simple: IconLinkedInSimple,
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

const getIconFromUrl = (url: string | URL): DataIcon | undefined => {
  try {
    const { protocol, host } = new URL(url);
    if (protocol === 'mailto:') return icons.email;
    if (protocol === 'tel:') return icons.phone;
    return icons[hostDomainIconId[host]];
  } catch (e) {
    if (e instanceof Error && 'code' in e && e.code === 'ERR_INVALID_URL')
      return undefined;
  }
};

const getIcon = (id: string | URL): DataIcon | undefined =>
  typeof id === 'string' && id in icons ? icons[id] : getIconFromUrl(id);

const getIcons = (ids: (string | URL)[]): DataIcon[] =>
  ids.map(getIcon).filter((icon): icon is DataIcon => Boolean(icon));

const getIconDefinition = (
  id: string | URL,
  style: keyof DataIconStyle
): IconDefinition | undefined => getIcon(id)?.style[style];

const getIconDefinitions = (
  ids: (string | URL)[],
  style: keyof DataIconStyle
): IconDefinition[] =>
  ids
    .map((id) => getIcon(id)?.style[style])
    .filter((icon): icon is IconDefinition => Boolean(icon));

const getDefaultIconDefinition = (icon: DataIcon): IconDefinition => {
  let defaultIcon: IconDefinition | undefined;
  for (const style of iconStyles) {
    defaultIcon = icon.style[style];
    if (defaultIcon) break;
  }
  if (!defaultIcon)
    throw new Error(`No icon types provided for icon ${icon.name}`);
  return defaultIcon;
};

const faToIconify = (icon: FaIconDefinition): IconifyIcon => {
  const [width, height, , , svgPathData] = icon.icon;
  const body = Array.isArray(svgPathData)
    ? `<g class="fa-duotone-group"><path class="fa-secondary" fill="currentColor" d="${svgPathData[0]}"></path><path class="fa-primary" fill="currentColor" d="${svgPathData[1]}"></path></g>`
    : `<path fill="currentColor" d=${svgPathData}></path>`;
  return { width, height, body };
};

export type { DataIcon, DataIconStyle, IconDefinition };
export {
  icons,
  iconStyles,
  getIconFromUrl,
  getIcon,
  getIconDefinition,
  getIcons,
  getIconDefinitions,
  getDefaultIconDefinition,
  faToIconify,
};
