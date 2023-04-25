import type { FunctionComponent, ComponentProps } from 'preact';
import Image, { ImageProps } from '@components/Image';
import useResizeObserver from '@react-hook/resize-observer';
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'preact/hooks';
import classNames from 'classnames';

class ScrollAnimation {
  element: HTMLElement;
  scrollPosition = 0;
  #currentFrame = 0;
  constructor(element: HTMLElement) {
    this.element = element;
  }

  scrollTo(pixels: number) {
    this.element.style.transform = `translate3d(0px, ${pixels.toFixed(
      6
    )}px, 0px) rotate(0.02deg)`; // rotate to force subpixel rendering on firefox
  }

  start({
    scrollRate = 0,
    containerHeight = 0,
    onScrollEnd,
  }: {
    scrollRate?: number;
    containerHeight?: number;
    onScrollEnd?: (self: ScrollAnimation) => void;
  } = {}): void {
    if (this.#currentFrame) this.stop();
    const imgHeight = this.element.clientHeight;
    const pixelsPerMs = scrollRate / 1000;
    let last = performance.now();

    const frame: FrameRequestCallback = (now) => {
      this.scrollPosition += pixelsPerMs * (now - last);
      last = now;
      const scrollRemaining = imgHeight - this.scrollPosition;
      if (scrollRemaining < containerHeight) {
        if (onScrollEnd) onScrollEnd(this);
        return;
      }
      this.scrollTo(-this.scrollPosition);
      this.#currentFrame = requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  stop(): void {
    cancelAnimationFrame(this.#currentFrame);
  }
}

export interface ProjectSlideshowProps extends ComponentProps<'div'> {
  image: ImageProps;
  scrollRate?: number;
  scrollDelay?: number;
  crossfade?: number;
}

const ProjectSlideshow: FunctionComponent<ProjectSlideshowProps> = ({
  image,
  scrollRate = 2,
  scrollDelay = 0,
  crossfade = 1000,
  ...divProps
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [current, setCurrent] = useState(image);
  const [next, setNext] = useState<ImageProps>();
  const [key, setKey] = useState(true); // allows transitioning into the same image, if it's scrolled

  const [containerHeight, setContainerHeight] = useState(0);
  useResizeObserver(divRef, ({ target }) => {
    setContainerHeight(target.clientHeight);
  });

  const doesScroll: boolean = useMemo(() => {
    const { width, height } = Object.values(current.metadata)[0][0];
    return scrollRate > 0 && width < height;
  }, [current, scrollRate]);

  const loadNext = useCallback(
    (image: ImageProps) => {
      setNext(image);
      return window.setTimeout(() => {
        setCurrent(image);
        setNext(undefined);
        setKey((k) => !k);
      }, crossfade + 100);
    },
    [crossfade]
  );

  useEffect(() => {
    if (Object.is(image, current) || Object.is(image, next)) return;
    const timeout = loadNext(image);
    return () => window.clearTimeout(timeout);
  }, [image]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollInstance = useRef<ScrollAnimation>();

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !doesScroll) return;
    const scrollAnimation =
      scrollInstance.current?.element === img
        ? scrollInstance.current
        : new ScrollAnimation(img);
    scrollInstance.current = scrollAnimation;
    const timeout = window.setTimeout(
      () =>
        scrollAnimation.start({
          scrollRate,
          containerHeight,
          onScrollEnd: ({ element }) => {
            element.style.removeProperty('transform');
            element.style.objectPosition = 'bottom';
            element.style.height = '100%';
          },
        }),
      scrollDelay
    );
    return () => {
      window.clearTimeout(timeout);
      scrollAnimation.stop();
    };
  }, [
    current,
    doesScroll,
    scrollRate,
    scrollDelay,
    crossfade,
    containerHeight,
  ]);

  return (
    <div
      ref={divRef}
      {...divProps}
      class={classNames('relative-fallback', divProps.class?.toString())}
    >
      <Image
        {...current}
        key={key}
        class={classNames('absolute inset-0', {
          'overflow-hidden': doesScroll,
        })}
        imgRef={imgRef}
        imgProps={{
          ...current.imgProps,
          class: 'w-full min-h-full object-cover object-top',
        }}
      />
      {next && (
        <Image
          {...next}
          key={!key}
          class="absolute inset-0"
          imgProps={{
            ...next.imgProps,
            class: 'fade-in w-full h-full object-cover object-top',
            style: {
              animationDuration: `${crossfade}ms`,
            },
          }}
        />
      )}
    </div>
  );
};

export default ProjectSlideshow;
