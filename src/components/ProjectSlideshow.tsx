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
  scrollRate?: number;
  crossfade?: number;
  slideDuration?: number;
}

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
  images: imagesProp,
  scrollRate = 2,
  crossfade = 1000,
  slideDuration = 10000,
  ...divProps
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<HTMLImageElement>();

  const [containerHeight, setContainerHeight] = useState<number>();
  useResizeObserver(divRef, ({ target }) => {
    setContainerHeight(target.clientHeight);
  });

  const [images, setImages] = useState(imagesProp);
  const [index, setIndex] = useState(0);
  const [current, currentKey] = useImageProps(images, index);

  const doesScroll = useMemo(() => {
    const { width, height } = Object.values(current.metadata)[0][0];
    return width < height;
  }, [current]);

  useEffect(() => setImages(imagesProp), [imagesProp]);
  useEffect(() => {
    if (doesScroll && images.length === 1) {
      setImages((i) => [...i, i[0]]);
    }
  }, [images, doesScroll]);

  const [next, nextKey] = useImageProps(images, index + 1);

  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    setImg(img);
  }, []);

  const [showNextImage, setShowNextImage] = useState(false);
  const loadNextImage = useCallback(() => {
    setShowNextImage(true);
    const timeout = window.setTimeout(() => {
      setIndex((i) => {
        const next = i + 1;
        return next < images.length ? next : 0;
      });
      setShowNextImage(false);
    }, crossfade + 100);
    return () => window.clearTimeout(timeout);
  }, [images, crossfade]);

  const frameRef = useRef(0);
  const startScroll = useCallback(() => {
    if (!img) return;
    const start = performance.now();
    const imgHeight = img.clientHeight;
    const pixelsPerMs = scrollRate / 1000;
    const buffer =
      (containerHeight ?? 0) + Math.ceil(pixelsPerMs * (crossfade + 100));
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
  }, [img, crossfade, scrollRate, containerHeight, loadNextImage]);

  const stopScroll = useCallback(
    (): void => cancelAnimationFrame(frameRef.current),
    []
  );

  // either scroll or set a timer for the next image
  useEffect(() => {
    if (!img) return;
    if (doesScroll) {
      startScroll();
      return () => stopScroll();
    } else if (images.length > 1) {
      const timeout = window.setTimeout(() => {
        loadNextImage();
      }, slideDuration);
      return () => window.clearTimeout(timeout);
    }
  }, [
    images,
    img,
    doesScroll,
    slideDuration,
    startScroll,
    stopScroll,
    loadNextImage,
  ]);

  return (
    <div
      ref={divRef}
      {...divProps}
      class={classNames('relative-fallback', divProps.class?.toString())}
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
            ? 'w-full'
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
