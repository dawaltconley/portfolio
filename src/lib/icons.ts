import type { IconDefinition as FaIconDefinition } from '@fortawesome/fontawesome-common-types';
import type { IconifyIcon } from '@iconify/types';
import type { DataIcon, DataIconStyle, IconDefinition } from '@data/icons';
import icons, { iconStyles } from '@data/icons';

export type { DataIcon, DataIconStyle, IconDefinition };

const hostDomainIconId: Record<string, keyof typeof icons> = Object.entries(
  icons
).reduce((map: Record<string, string>, [id, { url }]) => {
  if (!url) return map;
  const { host } = new URL(url);
  map[host] = id;
  return map;
}, {});

const urlToIconKey = (url: string | URL): string | undefined => {
  try {
    const { protocol, host } = new URL(url);
    if (protocol === 'mailto:') return 'email';
    if (protocol === 'tel:') return 'phone';
    return hostDomainIconId[host];
  } catch (e) {
    if (e instanceof Error && 'code' in e && e.code === 'ERR_INVALID_URL')
      return undefined;
  }
};

const getIconFromUrl = (url: string | URL): DataIcon | undefined =>
  icons[urlToIconKey(url) ?? ''];

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

export {
  getIconFromUrl,
  getIcon,
  getIconDefinition,
  getIcons,
  getIconDefinitions,
  getDefaultIconDefinition,
  faToIconify,
  urlToIconKey,
};
