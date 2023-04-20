import type { FunctionComponent, ComponentProps } from 'preact';
import Image, { ImageProps } from '@components/Image';
import { useState, useEffect, useMemo, useCallback } from 'preact/hooks';

export interface ProjectSlideshowProps extends ComponentProps<'div'> {
  images: [ImageProps, ...ImageProps[]];
}

const getImageKey = (image: ImageProps, index: number): string =>
  index + Object.values(image.metadata)[0][0].url;

const ProjectSlideshow: FunctionComponent<ProjectSlideshowProps> = ({
  images,
  ...divProps
}) => {
  if (images.length === 1) images.push(images[0]);

  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [current, currentKey] = useMemo(() => {
    const props = images[index];
    return [props, getImageKey(props, index)];
  }, [images, index]);
  const [next, nextKey] = useMemo(() => {
    let i = index + 1;
    if (i > images.length - 1) i = 0;
    return [images[i], getImageKey(images[i], i)];
  }, [images, index]);

  const [showNextImage, setShowNextImage] = useState(false);

  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    if (img.complete) handleCurrentLoad();
    else img.addEventListener('load', handleCurrentLoad);
  }, []);

  const handleCurrentLoad = () => {
    setPosition('bottom');
    setTimeout(() => {
      setShowNextImage(true);
      setTimeout(() => {
        setIndex((i) => {
          let next = i + 1;
          return next < images.length ? next : 0;
        });
        setShowNextImage(false);
      }, 1100);
    }, 10000);
  };

  const [nextOpacity, setNextOpacity] = useState(0);
  useEffect(() => {
    setNextOpacity(() => (showNextImage ? 1 : 0));
  }, [showNextImage]);

  return (
    <div class="relative" {...divProps}>
      <Image
        {...current}
        key={currentKey}
        class="absolute inset-0"
        imgRef={imgRef}
        imgProps={{
          ...current.imgProps,
          class: 'w-full h-full object-cover',
          style: {
            objectPosition: position,
            transition: 'object-position 30s linear',
          },
        }}
      />
      {showNextImage && (
        <Image
          {...next}
          key={nextKey}
          class="absolute inset-0"
          imgProps={{
            ...next.imgProps,
            class: 'w-full h-full object-cover',
            style: {
              objectPosition: 'top',
              opacity: nextOpacity.toString(),
              transition: 'object-position 30s 1s linear, opacity 1s ease-in',
            },
          }}
        />
      )}
    </div>
  );
};

export default ProjectSlideshow;
