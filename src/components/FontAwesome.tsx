import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { icon } from '@fortawesome/fontawesome-svg-core';
export interface Props {
  icon: IconDefinition;
  class?: string;
  inline?: boolean;
}
const { icon: iconDef, class: className, inline = false } = Astro.props;

const html = icon(iconDef, {
  classes: className ? className.split(' ') : [],
  styles: inline ? {} : { '--fa-display': 'block' },
}).html;
