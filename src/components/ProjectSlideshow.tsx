import type { FunctionComponent, ComponentProps } from 'preact';
import Image, { ImageProps } from '@components/Image';
import useResizeObserver from '@react-hook/resize-observer';
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'preact/hooks';
import classNames from 'classnames';

const useScrollAnimation = ({
  scrollRate = 0,
  containerHeight = 0,
}: {
  scrollRate?: number;
  containerHeight?: number;
}) => {
  const frameRef = useRef(0);
  const startScroll = useCallback(
    (img: HTMLImageElement) => {
      const start = performance.now();
      const imgHeight = img.clientHeight;
      const pixelsPerMs = scrollRate / 1000;
      // const buffer =
      //   (containerHeight ?? 0) + Math.ceil(pixelsPerMs * (crossfade + 100));
      // let isLoadingNext = false;

      const frame: FrameRequestCallback = (now) => {
        const scrollDist = pixelsPerMs * (now - start);
        const scrollRemaining = imgHeight - scrollDist;
        // if (!isLoadingNext && scrollRemaining < buffer) {
        //   isLoadingNext = true;
        //   loadNext(current);
        // }
        if (scrollRemaining < containerHeight) return;
        img.style.transform = `translate3d(0px, ${-scrollDist.toFixed(
          6
        )}px, 0px) rotate(0.02deg)`; // rotate to force subpixel rendering on firefox
        frameRef.current = requestAnimationFrame(frame);
      };

      requestAnimationFrame(frame);
    },
    [scrollRate, containerHeight]
  );

  const stopScroll = useCallback(
    (): void => cancelAnimationFrame(frameRef.current),
    []
  );

  return {
    startScroll,
    stopScroll,
  };
};

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
  const [current, setCurrent] = useState(image);
  const [next, setNext] = useState<ImageProps>();
  const [key, setKey] = useState(true); // allows transitioning into the same image, if it's scrolled

  const divRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<HTMLImageElement>();

  const [containerHeight, setContainerHeight] = useState<number>();
  useResizeObserver(divRef, ({ target }) => {
    setContainerHeight(target.clientHeight);
  });

  // TODO move into hook?
  const doesScroll: boolean = useMemo(() => {
    return (
      scrollRate > 0 &&
      !!img &&
      !!containerHeight &&
      img.clientHeight >
        containerHeight + ((scrollDelay + crossfade) * scrollRate) / 1000
    );
  }, [img, containerHeight, scrollRate, scrollDelay, crossfade]);

  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    setImg(img);
  }, []);

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
    if (Object.is(image, next)) return;
    const timeout = loadNext(image);
    return () => window.clearTimeout(timeout);
  }, [image]); // eslint-disable-line react-hooks/exhaustive-deps

  const { startScroll, stopScroll } = useScrollAnimation({
    scrollRate,
    containerHeight,
  });

  // start scroll if image supports it
  useEffect(() => {
    if (!img || !doesScroll) return;
    const timeout = window.setTimeout(() => startScroll(img), scrollDelay);
    return () => {
      window.clearTimeout(timeout);
      stopScroll();
    };
  }, [img, doesScroll, scrollDelay, startScroll, stopScroll]);

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
