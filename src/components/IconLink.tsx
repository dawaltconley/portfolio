import type { IconLink, IconStyle, IconComponent } from '@data/icons';
import { icons, getIconFromUrl } from '@data/icons';
import type { FunctionComponent, JSX } from 'preact';
import { Fragment } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

interface PropsBase extends Partial<Omit<IconLink, 'type'>> {
  type?: keyof IconStyle;
  id?: keyof typeof icons;
  icon?: IconComponent;
  class?: string;
  inline?: boolean;
  urlText?: string;
  tag?: 'a' | 'span' | 'button' | 'div';
  attributes?: JSX.SVGAttributes<SVGSVGElement>;
}

interface PropsId extends PropsBase {
  type: keyof IconStyle;
  id: keyof typeof icons;
}

interface PropsUrl extends PropsBase {
  type: keyof IconStyle;
  url: string;
}

interface PropsIcon extends PropsBase {
  icon: IconComponent;
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

const IconLink: FunctionComponent<PropsId | PropsUrl | PropsIcon> = ({
  id,
  type: iconStyle,
  icon: iconComponent,
  class: className,
  // inline = false,
  tag,
  children,
  ...iconProps
}) => {
  let icon =
    id !== undefined
      ? icons[id]
      : iconProps.url && getIconFromUrl(iconProps.url);
  if (!icon) return null;

  icon = { ...icon, ...iconProps };
  const IconWrapper = tag ?? icon.url ? 'a' : 'span';
  const Icon = iconComponent || (iconStyle && icon.type[iconStyle]);
  if (!Icon) return null;

  console.log(Icon);

  return (
    <IconWrapper href={icon.url} title={icon.name} class={className ?? ''}>
      <Icon
        // class="iconify"
        width="1em"
        height="1em"
        // data-icon={icon.type[iconStyle]}
        // data-inline={inline.toString()}
      />
      {children}
      {/* icon.url && urlText && <span class="icon-url-text">{urlText}</span> */}
    </IconWrapper>
  );
};

const IconLink2: FunctionComponent<{
  icon: IconComponent;
  url?: string;
  tag?: 'a' | 'span' | 'button' | 'div' | 'li';
  title?: string;
  class?: string;
  attributes?: JSX.SVGAttributes<SVGSVGElement>;
}> = ({
  icon: Icon,
  url,
  tag,
  title,
  class: className,
  children,
  ...attributes
}) => {
  const IconWrapper = tag ?? url ? 'a' : 'span';
  return (
    <IconWrapper href={url} className={className} title={title}>
      <Icon width="1em" height="1em" {...attributes} />
      {children}
    </IconWrapper>
  );
};

export default IconLink;

export { IconLink2 };
