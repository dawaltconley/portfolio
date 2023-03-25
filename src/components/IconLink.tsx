import type { IconifyJSON } from '@iconify/types';
import type { IconifyIconBuildResult } from '@iconify/utils';
import { lookupCollection } from '@iconify/json';
import { getIconData, stringToIcon, iconToSVG } from '@iconify/utils';

import type { IconLink, IconStyle } from '@data/icons';
import { icons } from '@data/icons';

const loadedIconSets: Record<string, IconifyJSON> = {};

const getSVG = async (iconId: string): Promise<IconifyIconBuildResult> => {
  const iconName = stringToIcon(iconId);
  if (!iconName) throw new Error('Invalid icon identifier: ' + iconId);
  const { prefix, name } = iconName;
  const iconSet = loadedIconSets[prefix] ?? (await lookupCollection(prefix));
  if (!(prefix in loadedIconSets)) loadedIconSets[prefix] = iconSet;
  const iconData = getIconData(iconSet, name);
  if (!iconData) throw new Error(`Couldn't find icon ${name} in set ${prefix}`);
  return iconToSVG(iconData);
};

interface IconBuildResults {
  simple?: IconifyIconBuildResult;
  color?: IconifyIconBuildResult;
  skill?: IconifyIconBuildResult;
}

const iconSVG = new Map<keyof typeof icons, IconBuildResults>();
for (let name in icons) {
  let icon = icons[name];
  let results: IconBuildResults = {};
  for (let type in icon.type) {
    if (type === 'simple' || type === 'color' || type === 'skill') {
      const id = icon.type[type];
      if (id) results[type] = await getSVG(id);
    }
  }
  iconSVG.set(name, results);
}

interface PropsBase extends Partial<Omit<IconLink, 'type'>> {
  type: keyof IconStyle;
  id?: keyof typeof icons;
  class?: string;
  inline?: boolean;
  urlText?: string;
  tag?: 'a' | 'span' | 'button' | 'div';
}

interface PropsId extends PropsBase {
  id: keyof typeof icons;
}

interface PropsUrl extends PropsBase {
  url: string;
}

export type Props = PropsId | PropsUrl;

function IconifySvg({
  type,
  id,
  class: className,
  ...extraAttributes
}: {
  id: keyof typeof icons;
  type: keyof IconBuildResults;
  class?: string;
  extraAttributes?: Record<string, string>;
}) {
  const build = iconSVG.get(id);
  if (!build) throw new Error(`Invalid icon ${id}`);
  const types = build[type];
  if (!types) return <></>;
  const { body, attributes } = types;
  return (
    <svg
      class={className}
      {...{ ...attributes, ...extraAttributes }}
      dangerouslySetInnerHTML={{ __html: body }}
    ></svg>
  );
}

export { IconifySvg };
