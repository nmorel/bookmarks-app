import {get} from './fetch';
import _keyBy from 'lodash/keyBy';

const providers = [
  {
    service: 'Vimeo',
    regexp: /^(?:https?:\/\/)?vimeo\.com(?:\/album\/[0-9]+\/video)?\/([0-9]+)(?:\/.*)?$/i,
    match(url) {
      return this.regexp.test(url);
    },
    fetch: async function(url) {
      const videoId = this.regexp.exec(url)[1];
      try {
        let metadata = await get(`http://vimeo.com/api/v2/video/${videoId}.json`);
        metadata = metadata && metadata[0];
        return {
          url,
          kind: 'VIDEO',
          title: metadata.title,
          description: metadata.description,
          author: metadata.user_name,
          duration: parseInt(metadata.duration || 0, 10),
          width: parseInt(metadata.width || 0, 10),
          height: parseInt(metadata.height || 0, 10),
          thumbnailSmall: metadata.thumbnail_small,
          thumbnailMedium: metadata.thumbnail_medium,
          thumbnailLarge: metadata.thumbnail_large,
          tags: (metadata.tags || '')
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => !!tag),
        };
      } catch (err) {
        console.log(`Failed to retrieve metadata on Vimeo for video ${videoId} : `, err.message);
        throw new Error(`Failed to retrieve metadata on Vimeo for video ${videoId}`);
      }
    },
  },
  {
    service: 'Flickr',
    regexp: /^(?:https?:\/\/)?(?:www\.)?flickr\.com\/photos\/.*\/([0-9]+)(?:\/.*)?$/i,
    match(url) {
      return this.regexp.test(url);
    },
    fetch: async function(url) {
      const photoId = this.regexp.exec(url)[1];
      try {
        let metadata = await get(`https://api.flickr.com/services/rest`, {
          photo_id: photoId,
          method: 'flickr.photos.getInfo',
          api_key: 'e313024ac7788e84caa0e8138e6db0e7',
          format: 'json',
          nojsoncallback: 1,
          extras: 'sizes',
        });
        if (metadata.code > 0) {
          throw new Error(metadata.message);
        }
        metadata = metadata.photo;

        const photos = _keyBy(metadata.sizes.size, 'label');

        const originalPhoto =
          photos['Original'] ||
          (metadata.sizes.size || []).reduce(
            (p1, p2) => (parseInt(p1.width || 0, 10) > parseInt(p2.width || 0, 10) ? p1 : p2),
            {
              width: 0,
              height: 0,
            }
          );

        const thumbnailLarge = photos['Medium 640'] || originalPhoto;
        const thumbnailMedium = photos['Small'] || thumbnailLarge;
        const thumbnailSmall = photos['Thumbnail'] || thumbnailMedium;

        return {
          url,
          kind: 'PHOTO',
          title: metadata.title._content,
          description: metadata.description._content,
          author: metadata.owner.realname || metadata.owner.username,
          width: parseInt(originalPhoto.width || 0, 10),
          height: parseInt(originalPhoto.height || 0, 10),
          thumbnailSmall: thumbnailSmall.source,
          thumbnailMedium: thumbnailMedium.source,
          thumbnailLarge: thumbnailLarge.source,
          tags: ((metadata.tags && metadata.tags.tag) || [])
            .map(tag => tag.raw || tag._content)
            .map(tag => tag.trim())
            .filter(tag => !!tag),
        };
      } catch (err) {
        console.log(`Failed to retrieve metadata on Flickr for photo ${photoId} : `, err.message);
        throw new Error(`Failed to retrieve metadata on Flickr for photo ${photoId}`);
      }
    },
  },
];

export async function loadMetadataFromUrl(url) {
  if (!url) {
    return {};
  }

  const provider = providers.find(provider => provider.match(url));
  if (provider) {
    return await provider.fetch(url);
  } else {
    throw new Error(`Url ${url} does not match a supported provider.`);
  }
}
