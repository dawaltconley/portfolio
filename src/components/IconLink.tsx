import type { IconLink, IconStyle, IconComponent } from '@data/icons';
import { icons, getIconFromUrl } from '@data/icons';
import type { FunctionComponent, ComponentChild } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

interface PropsBase extends Partial<Omit<IconLink, 'type'>> {
  type?: keyof IconStyle;
  id?: keyof typeof icons;
  class?: string;
  inline?: boolean;
  urlText?: string;
  tag?: 'a' | 'span' | 'button' | 'div';
}

interface PropsId extends PropsBase {
  type: keyof IconStyle;
  id: keyof typeof icons;
}

interface PropsUrl extends PropsBase {
  type: keyof IconStyle;
  url: string;
}

// function IconLink(props: PropsId);
// function IconLink(props: PropsUrl);
// function IconLink({
//   id,
//   type: iconStyle,
//   class: className,
//   inline = false,
//   urlText,
//   tag,
//   ...iconProps
// }: PropsId | PropsUrl) {

const IconLink: FunctionComponent<PropsId | PropsUrl> = ({
  id,
  type: iconStyle,
  class: className,
  inline = false,
  urlText,
  tag,
  ...iconProps
}: PropsId | PropsUrl) => {
  let icon =
    id !== undefined
      ? icons[id]
      : iconProps.url && getIconFromUrl(iconProps.url);
  if (!icon) return null;

  icon = {
    ...icon,
    ...iconProps,
  };

  const IconWrapper = tag ?? icon.url ? 'a' : 'span';
  const Icon = icon.type[iconStyle];
  if (!Icon) return null;

  return (
    <IconWrapper href={icon.url} title={icon.name} class={className ?? ''}>
      <Icon
        class="iconify"
        width="1em"
        height="1em"
        data-icon={icon.type[iconStyle]}
        data-inline={inline.toString()}
      />
      {icon.url && urlText && <span class="icon-url-text">{urlText}</span>}
    </IconWrapper>
  );
};

export default IconLink;
