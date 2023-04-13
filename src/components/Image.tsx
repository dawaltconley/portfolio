import type { ComponentProps } from 'preact';
import type { Metadata, MetadataEntry } from '11ty__eleventy-img';

export interface ImageProps extends ComponentProps<'picture'> {
  metadata: Metadata;
  alt: string;
  sizes?: string;
  imgProps?: ComponentProps<'img'>;
}

export default function Image({
  metadata,
  alt,
  sizes,
  imgProps = {},
  ...picture
}: ImageProps) {
  const metaValues = Object.values(metadata);
  const smallest: MetadataEntry = metaValues[0][0];
  const biggest: MetadataEntry = metaValues[0][metaValues[0].length - 1];
  return (
    <picture {...picture}>
      {metaValues.map((imageFormat) => (
        <source
          type={imageFormat[0].sourceType}
          srcset={imageFormat.map((img) => img.srcset).join(', ')}
          sizes={sizes}
        />
      ))}
      <img
        src={smallest.url}
        width={biggest.width}
        height={biggest.height}
        alt={alt}
        loading="lazy"
        decoding="async"
        {...imgProps}
      />
    </picture>
  );
}
