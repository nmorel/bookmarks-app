import fetch from 'node-fetch';
import {loadMetadataFromUrl} from '../metadata';

beforeEach(function() {
  global.fetch = fetch;
});

it(`returns empty object for empty url`, async () => {
  await expect(loadMetadataFromUrl()).resolves.toEqual({});
  await expect(loadMetadataFromUrl(null)).resolves.toEqual({});
  await expect(loadMetadataFromUrl('')).resolves.toEqual({});
});

it(`returns no additional data if the url does not match vimeo or flickr url`, async () => {
  await expect(loadMetadataFromUrl('http://mylife.com/abcd')).resolves.toEqual({
    url: 'http://mylife.com/abcd',
  });
});

it(`fails if the vimeo api fails or the video is not found`, async () => {
  await expect(loadMetadataFromUrl('vimeo.com/0')).rejects.toBeDefined();
});

it(`retrieves the vimeo metadata`, async () => {
  const match = {
    service: 'Vimeo',
    title: 'Sarah Drasner - SVG can do that?!',
    author: 'Frontend Conference Zurich',
    width: 1920,
    height: 1080,
    duration: 2673,
    thumbnailSmall: 'http://i.vimeocdn.com/video/653247162_100x75.jpg',
    thumbnailMedium: 'http://i.vimeocdn.com/video/653247162_200x150.jpg',
    thumbnailLarge: 'http://i.vimeocdn.com/video/653247162_640.jpg',
    tags: [],
  };

  await expect(loadMetadataFromUrl('vimeo.com/232158544')).resolves.toMatchObject(match);
  await expect(loadMetadataFromUrl('http://vimeo.com/232158544/test')).resolves.toMatchObject(
    match
  );
  await expect(
    loadMetadataFromUrl('https://vimeo.com/album/4754313/video/232158544')
  ).resolves.toMatchObject(match);
});

it(`fails if the flickr api fails or the photo is not found`, async () => {
  await expect(
    loadMetadataFromUrl('http://flickr.com/photos/lalal/0/in/stuff')
  ).rejects.toBeDefined();
});

it(`retrieves the flickr metadata`, async () => {
  const match = {
    service: 'Flickr',
    title: 'The Bunker',
    author: 'Peter Stewart',
    width: 1600,
    height: 1068,
    thumbnailSmall: 'https://farm5.staticflickr.com/4427/37189661310_620e155b7d_t.jpg',
    thumbnailMedium: 'https://farm5.staticflickr.com/4427/37189661310_620e155b7d_m.jpg',
    thumbnailLarge: 'https://farm5.staticflickr.com/4427/37189661310_620e155b7d_z.jpg',
    tags: [
      'Kawasaki',
      'Tokyo',
      'Japan',
      'interior',
      'modern',
      'urban',
      'architecture',
      'circular',
      'stairwel',
      'bunker',
      'underground',
      'abstract',
      'spiral',
      'stairs',
      'looking',
      'up',
      'Grey',
      'coiled',
      'dark',
      'well',
    ],
  };

  await expect(
    loadMetadataFromUrl('https://www.flickr.com/photos/shinrya/37189661310/in/explore-2017-10-02/')
  ).resolves.toMatchObject(match);
  await expect(
    loadMetadataFromUrl('http://flickr.com/photos/shinrya/37189661310/in/explore-2017-10-02/')
  ).resolves.toMatchObject(match);
});
