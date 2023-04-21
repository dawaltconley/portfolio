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

const pixelsPerMs = 2 / 1000;
const fadeInTime = 1000;
const maxWaitTime = 10000;

const useImageProps = (
  images: [ImageProps, ...ImageProps[]],
  index: number
): [ImageProps, string] =>
  useMemo(() => {
    const i = index > images.length - 1 ? 0 : index;
    const image = images[i];
    const key = i + Object.values(image.metadata)[0][0].url;
    return [image, key];
  }, [images, index]);

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
  const [current, currentKey] = useImageProps(images, index);

  const doesScroll = useMemo(() => {
    const { width, height } = Object.values(current.metadata)[0][0];
    return width < height;
  }, [current]);

  if (doesScroll && images.length === 1) images.push(images[0]);

  const [next, nextKey] = useImageProps(images, index + 1);

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

  const frameRef = useRef(0);
  const startScroll = () => {
    if (!img) return;
    const start = performance.now();
    const imgHeight = img.clientHeight;
    const buffer =
      (containerHeight ?? 0) + Math.ceil(pixelsPerMs * (fadeInTime + 100));
    let isLoadingNext = false;

    const frame: FrameRequestCallback = (now) => {
      const scrollDist = pixelsPerMs * (now - start);
      const scrollRemaining = imgHeight - scrollDist;
      if (!isLoadingNext && scrollRemaining < buffer) {
        isLoadingNext = true;
        loadNextImage();
      }
      if (scrollRemaining < (containerHeight ?? 0)) return;
      img.style.transform = `translate3d(0px, ${-scrollDist.toFixed(
        6
      )}px, 0px) rotate(0.02deg)`; // rotate to force subpixel rendering on firefox
      frameRef.current = requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  const stopScroll = (): void => cancelAnimationFrame(frameRef.current);

  const [nextOpacity, setNextOpacity] = useState(0);
  useEffect(() => {
    setNextOpacity(() => (showNextImage ? 1 : 0));
  }, [showNextImage]);

  // either scroll or set a timer for the next image
  useEffect(() => {
    if (!img) return;
    if (doesScroll) {
      startScroll();
      return () => stopScroll();
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
