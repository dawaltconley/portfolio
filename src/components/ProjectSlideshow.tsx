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

export interface ProjectSlideshowProps extends ComponentProps<'div'> {
  images: [ImageProps, ...ImageProps[]];
}

const getImageKey = (image: ImageProps, index: number): string =>
  index + Object.values(image.metadata)[0][0].url;

const pixelsPerMs = 2 / 1000;
const fadeInTime = 1000;
const maxWaitTime = 10000;

const ProjectSlideshow: FunctionComponent<ProjectSlideshowProps> = ({
  images,
  ...divProps
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<HTMLImageElement>();

  const [containerHeight, setContainerHeight] = useState<number>();
  useResizeObserver(divRef, ({ target }) => {
    setContainerHeight(target.clientHeight);
  });

  const [index, setIndex] = useState(0);
  const [current, currentKey] = useMemo(() => {
    const props = images[index];
    return [props, getImageKey(props, index)];
  }, [images, index]);

  const doesScroll = useMemo(() => {
    const { width, height } = Object.values(current.metadata)[0][0];
    return width < height;
  }, [current]);

  if (doesScroll && images.length === 1) images.push(images[0]);

  const [next, nextKey] = useMemo(() => {
    let i = index + 1;
    if (i > images.length - 1) i = 0;
    return [images[i], getImageKey(images[i], i)];
  }, [images, index]);

  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    setImg(img);
  }, []);

  const [showNextImage, setShowNextImage] = useState(false);
  const loadNextImage = () => {
    setShowNextImage(true);
    setTimeout(() => {
      setIndex((i) => {
        let next = i + 1;
        return next < images.length ? next : 0;
      });
      setShowNextImage(false);
    }, fadeInTime + 100);
  };

  const frameId = useRef(0);
  const animateScroll = (img: HTMLImageElement) => {
    const imgHeight = img.clientHeight;
    const buffer =
      (containerHeight ?? 0) + Math.ceil(pixelsPerMs * (fadeInTime + 100));
    let last = performance.now();
    let scrollDist = 0;
    let loadedNext = false;

    const frame: FrameRequestCallback = (now) => {
      const interval = now - last;
      last = now;
      scrollDist -= pixelsPerMs * interval;
      if (!loadedNext && imgHeight + scrollDist < buffer) {
        loadedNext = true;
        loadNextImage();
      }
      if (imgHeight + scrollDist < (containerHeight ?? 0)) return;
      img.style.transform = `translate3d(0px, ${scrollDist.toFixed(
        6
      )}px, 0px) rotate(0.02deg)`; // rotate to force subpixel rendering on firefox
      frameId.current = requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  const stopAnimation = (): void => cancelAnimationFrame(frameId.current);

  const [nextOpacity, setNextOpacity] = useState(0);
  useEffect(() => {
    setNextOpacity(() => (showNextImage ? 1 : 0));
  }, [showNextImage]);

  // either scroll or set a timer for the next image
  useEffect(() => {
    if (!img) return;
    if (doesScroll) {
      animateScroll(img);
      return () => stopAnimation();
    } else if (images.length > 1) {
      let timeout = window.setTimeout(() => {
        loadNextImage();
      }, maxWaitTime);
      return () => window.clearTimeout(timeout);
    }
  }, [images, img, containerHeight, doesScroll]);

  return (
    <div
      ref={divRef}
      {...divProps}
      class={classNames('relative-fallback', divProps.class?.toString())}
      style={{ perspective: '100px', transform: 'translateZ(0)' }}
    >
      <Image
        {...current}
        key={currentKey}
        class={classNames('absolute inset-0', {
          'overflow-hidden': doesScroll,
        })}
        imgRef={imgRef}
        imgProps={{
          ...current.imgProps,
          class: doesScroll
            ? 'w-full transition-transform duration-[20ms] linear'
            : 'w-full h-full object-cover object-top',
        }}
      />
      {showNextImage && (
        <Image
          {...next}
          key={nextKey}
          class="absolute inset-0"
          imgProps={{
            ...next.imgProps,
            class: 'w-full h-full object-cover object-top',
            style: {
              opacity: nextOpacity.toString(),
              transition: `opacity ${fadeInTime}ms ease-in`,
            },
          }}
        />
      )}
    </div>
  );
};

export default ProjectSlideshow;
