import type { FunctionComponent } from 'preact';
import 'preact';
import { coerceToArray } from '@browser/utils';

export type FilterButton = FunctionComponent<{
  isActive: boolean;
  onClick: () => void;
}>;

const DefaultButton: FilterButton = ({ ...props }) => <button {...props} />;

export interface FilterProps {
  tags: string | string[];
  active?: string[];
  handleFilter: (tags: string[]) => void;
}

const Filter: FunctionComponent<
  FilterProps & {
    button?: FilterButton;
  }
> = ({
  tags: tagsProp,
  active = [],
  handleFilter,
  button: Button = DefaultButton,
  children,
}) => {
  const tags: string[] = coerceToArray(tagsProp);
  const isActive: boolean = tags.every((tag) => active.includes(tag));
  return (
    <Button
      isActive={isActive}
      onClick={() => handleFilter(tags)}
      children={children}
    />
  );
};

export const makeFilter = (
  button: FilterButton
): FunctionComponent<FilterProps> =>
  function BoundFilter(props) {
    return <Filter {...props} button={button} />;
  };

export default Filter;
