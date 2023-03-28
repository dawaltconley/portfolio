import type { JSX, ComponentProps } from 'preact';
import type { IconDefinition as FaIconDefinition } from '@fortawesome/fontawesome-common-types';
import type { ExtendedIconifyIcon } from '@iconify/types';

type IconDefinition = FaIconDefinition | ExtendedIconifyIcon;

interface IconProps extends Omit<ComponentProps<'svg'>, 'icon'> {
  icon: IconDefinition;
  class?: string;
}

interface IconPropsFa extends IconProps {
  icon: FaIconDefinition;
}

interface IconPropsIconify extends IconProps {
  icon: ExtendedIconifyIcon;
}

const FontAwesomeIcon = ({
  icon,
  class: className,
  ref,
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
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={`svg-inline--fa fa-${icon.iconName} ${className}`}
      data-prefix={icon.prefix}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      role="img"
      {...attributes}
    >
      {svgContent}
    </svg>
  );
};

const IconifyIcon = ({
  icon,
  class: className,
  ...attributes
}: IconPropsIconify): JSX.Element => (
  <svg
    className={className}
    viewBox={`0 0 ${icon.width} ${icon.height}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    role="img"
    {...attributes}
    dangerouslySetInnerHTML={{ __html: icon.body }}
  />
);

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
