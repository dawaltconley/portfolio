import { createHash } from 'node:crypto';
import EleventyFetch from '@11ty/eleventy-fetch';
import MetaScraper from 'metascraper';
import MetaScraperImage from 'metascraper-image';

const ms = MetaScraper([MetaScraperImage()]);

const hash = (str: string) => createHash('md5').update(str).digest('hex');

const getMetadata = async (url: URL, duration = '1w') => {
  let html = await EleventyFetch(url.href, {
    duration,
    type: 'text',
  }).catch((e: any) => {
    console.warn(`${e.code}: unable to fetch data from ${url}`);
    return '';
  });
  let cache = new EleventyFetch.AssetCache(hash(html));
  if (cache.isCacheValid(duration)) {
    return cache.getCachedValue();
  }
  try {
    let metadata = await ms({ url: url.href, html });
    await cache.save(metadata, 'json');
    return metadata;
  } catch (e) {
    console.warn(`Unable to scrape metadata from ${url}:`);
    console.warn(e);
    return cache.isCacheValid('*') ? cache.getCachedValue() : {};
  }
};

export { getMetadata };
