import type { JSX, ComponentProps } from 'preact';
import type { IconDefinition as FaIconDefinition } from '@fortawesome/fontawesome-common-types';
import type { IconifyIcon } from '@iconify/types';

type IconDefinition = FaIconDefinition | IconifyIcon;

interface IconProps extends Omit<ComponentProps<'svg'>, 'icon'> {
  icon: IconDefinition;
  class?: string;
  title?: string;
}

interface IconPropsFa extends IconProps {
  icon: FaIconDefinition;
}

interface IconPropsIconify extends IconProps {
  icon: IconifyIcon;
}

const FontAwesomeIcon = ({
  icon,
  class: className,
  title,
  ...attributes
}: IconPropsFa): JSX.Element => {
  const [width, height, , , svgPathData] = icon.icon;
  let svgContent: JSX.Element;
  if (Array.isArray(svgPathData)) {
    svgContent = (
      <g class="fa-duotone-group">
        <path
          className="fa-secondary"
          fill="currentColor"
          d={svgPathData[0]}
        ></path>
        <path
          className="fa-primary"
          fill="currentColor"
          d={svgPathData[1]}
        ></path>
      </g>
    );
  } else {
    svgContent = <path fill="currentColor" d={svgPathData}></path>;
  }
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`svg-inline--fa fa-${icon.iconName} ${className}`}
      data-prefix={icon.prefix}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      role="img"
      {...attributes}
    >
      {title && <title>{title}</title>}
      {svgContent}
    </svg>
  );
};

const IconifyIcon = ({
  icon,
  class: className,
  title,
  ...attributes
}: IconPropsIconify): JSX.Element => {
  let innerHtml = icon.body;
  if (title) innerHtml = `<title>${title}</title>` + innerHtml;
  const { left = 0, top = 0, width = 16, height = 16 } = icon;
  return (
    <svg
      className={className}
      viewBox={`${left} ${top} ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      role="img"
      {...attributes}
      dangerouslySetInnerHTML={{ __html: innerHtml }}
    />
  );
};
const Icon = ({
  icon,
  class: className,
  ...attributes
}: IconProps): JSX.Element =>
  'iconName' in icon ? (
    <FontAwesomeIcon icon={icon} className={className} {...attributes} />
  ) : (
    <IconifyIcon icon={icon} className={className} {...attributes} />
  );

export default Icon;
export type { IconDefinition, IconProps, IconPropsFa, IconPropsIconify };
export { IconifyIcon, FaIconDefinition };
