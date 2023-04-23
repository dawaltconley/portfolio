import type { FunctionComponent, ComponentProps } from 'preact';
import Image, { ImageProps } from '@components/Image';
import useResizeObserver from '@react-hook/resize-observer';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import classNames from 'classnames';

class ScrollAnimation {
  element: HTMLElement;
  #currentFrame = 0;
  constructor(element: HTMLElement) {
    this.element = element;
  }

  setScrollPosition(pixels: number) {
    this.element.style.transform = `translate3d(0px, ${-pixels.toFixed(
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
    onScrollEnd?: () => void;
  } = {}): void {
    if (this.#currentFrame) this.stop();
    const start = performance.now();
    const imgHeight = this.element.clientHeight;
    const pixelsPerMs = scrollRate / 1000;

    const frame: FrameRequestCallback = (now) => {
      const scrollPosition = pixelsPerMs * (now - start);
      const scrollRemaining = imgHeight - scrollPosition;
      if (scrollRemaining < containerHeight) {
        if (onScrollEnd) onScrollEnd();
        return;
      }
      this.setScrollPosition(scrollPosition);
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

  const doesScroll: boolean =
    scrollRate > 0 &&
    !!imgRef.current &&
    imgRef.current.clientHeight >
      containerHeight + ((scrollDelay + crossfade) * scrollRate) / 1000;

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

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !doesScroll) return;
    const scrollAnimation = new ScrollAnimation(img);
    const timeout = window.setTimeout(
      () =>
        scrollAnimation.start({
          scrollRate,
          containerHeight,
        }),
      scrollDelay
    );
    return () => {
      window.clearTimeout(timeout);
      scrollAnimation.stop();
    };
  }, [key, doesScroll, scrollRate, scrollDelay, crossfade, containerHeight]);

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
