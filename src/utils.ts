import EleventyFetch, { AssetCache } from '@11ty/eleventy-fetch';
import MetaScraper, { Metadata } from 'metascraper';
import MetaScraperImage from 'metascraper-image';

const ms = MetaScraper([MetaScraperImage()]);

const getMetadata = async (url: URL, duration = '1w'): Promise<Metadata> => {
  let html = await EleventyFetch(url.href, {
    duration,
    type: 'text',
  }).catch((e: Error) => {
    if ('code' in e) {
      console.warn(`${e.code}: unable to fetch data from ${url}`);
      return '';
    } else {
      throw e;
    }
  });
  let cache = new AssetCache<Metadata>(html);
  if (cache.isCacheValid(duration)) {
    return cache.getCachedValue();
  }
  try {
    let metadata = await ms({ url: url.href, html });
    await cache.save(metadata, 'json');
    return metadata;
  } catch (e) {
    console.warn(`Unable to scrape metadata from ${url}:`);
    if (cache.isCacheValid('*')) {
      console.warn(e);
      return cache.getCachedValue();
    }
    throw e;
  }
};

export { getMetadata };
