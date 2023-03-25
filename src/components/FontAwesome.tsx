import type {
  IconDefinition,
  AbstractElement,
} from '@fortawesome/fontawesome-svg-core';
import { icon as faIcon } from '@fortawesome/fontawesome-svg-core';
import type { VNode } from 'preact';
import { h } from 'preact';

export interface Props {
  icon: IconDefinition;
  class?: string;
  inline?: boolean;
}

console.log('rendering tsx fontawesome icon');

const renderAbstract = ({
  tag,
  attributes,
  children,
}: AbstractElement): VNode<any> =>
  h(tag, attributes, children?.map(renderAbstract));

function Icon({ icon, class: className, inline }: Props) {
  const { abstract } = faIcon(icon, {
    classes: className ? className.split(' ') : [],
    styles: inline ? {} : { '--fa-display': 'block' },
  });
  return <>{abstract.map(renderAbstract)}</>;
}

export default Icon;
