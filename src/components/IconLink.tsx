import type { FunctionComponent } from 'preact';
import type { IconProps } from './Icon';
import Icon from './Icon';

interface IconLinkProps extends IconProps {
  url?: string;
  tag?: 'a' | 'span' | 'button' | 'div' | 'li';
  title?: string;
}

const IconLink: FunctionComponent<IconLinkProps> = ({
  url,
  tag,
  title,
  class: className,
  children,
  ...iconAttributes
}) => {
  const IconWrapper = tag ?? (url ? 'a' : 'span');
  return (
    <IconWrapper href={url} className={className} title={title}>
      <Icon width="1em" height="1em" {...iconAttributes} />
      {children}
    </IconWrapper>
  );
};

export default IconLink;
export type { IconLinkProps };
