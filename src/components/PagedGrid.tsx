import type { FunctionComponent, ComponentProps, VNode } from 'preact';
import { useState } from 'preact/hooks';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons/faChevronRight';
import Icon from '@components/Icon';
import classNames from 'classnames';

interface PageButtonProps extends Omit<ComponentProps<'button'>, 'ref'> {
  page: number;
  current: number;
  handleClick: (page: number) => void;
}

const PageButton: FunctionComponent<PageButtonProps> = ({
  page,
  current,
  handleClick,
  children,
  className,
  class: className2,
  ...props
}) => {
  const isCurrent = page === current;
  return (
    <button
      className={classNames(
        'block h-[2rem] min-w-[2rem] rounded-full bg-gray-900 px-2 text-center leading-none duration-300',
        className?.toString(),
        className2?.toString(),
        {
          'hover:bg-pink-800': !isCurrent,
        }
      )}
      onClick={() => handleClick(page)}
      disabled={isCurrent}
      {...props}
    >
      {children}
    </button>
  );
};

interface PagedViewProps {
  components: VNode[];
  tag: 'div' | 'ul' | 'ol';
  perPage: number;
}

const PagedGrid: FunctionComponent<PagedViewProps> = ({
  components,
  tag = 'div',
  perPage,
}) => {
  const [page, setPage] = useState(1);

  const pages = Array.from({
    length: Math.ceil(components.length / perPage),
  }).map((_p, i) => i);

  const inRange = (page: number): number =>
    Math.max(0, Math.min(pages.length - 1, page));

  const getComponents = (page: number): VNode[] => {
    const start = inRange(page) * perPage;
    const end = start + perPage;
    return components.slice(start, end);
  };

  const nextPage = inRange(page + 1);
  const prevPage = inRange(page - 1);

  // only display 5 page buttons max
  const lowRange = inRange(Math.min(pages.length - 5, page - 2));
  const highRange = inRange(Math.max(5, page + 2));

  const Grid = tag;
  const buttonProps = { handleClick: setPage, current: inRange(page) };

  return (
    <>
      <Grid className="grid gap-4 md:grid-cols-2 md:grid-rows-3 xl:grid-cols-3 xl:grid-rows-2">
        {getComponents(page)}
      </Grid>
      <div className="mt-8 flex justify-center space-x-4">
        <PageButton
          key="prev"
          page={prevPage}
          className="disabled:text-slate-500"
          {...buttonProps}
        >
          <Icon
            className="m-auto text-sm"
            width="1em"
            height="1em"
            icon={faChevronLeft}
          />
        </PageButton>
        {pages.slice(lowRange, highRange + 1).map((p) => (
          <PageButton
            key={p}
            page={p}
            {...buttonProps}
            className={classNames('font-medium', {
              'bg-pink-800': p === buttonProps.current && pages.length > 1,
              'disabled:text-slate-500': pages.length < 2,
            })}
          >
            {p + 1}
          </PageButton>
        ))}
        <PageButton
          key="next"
          page={nextPage}
          className="disabled:text-slate-500"
          {...buttonProps}
        >
          <Icon
            className="m-auto text-sm"
            width="1em"
            height="1em"
            icon={faChevronRight}
          />
        </PageButton>
      </div>
    </>
  );
};

export default PagedGrid;
