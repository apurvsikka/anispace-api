let HIANIME: string = 'https://hianime.to';
let ANIMEPAHE: string = 'https://animepahe.ru';
let KAIZE: string = 'https://kaize.io';
let ANIMEPLANET: string = 'https://anime-planet.com';
let ANILIST_GQL: string = 'https://graphql.anilist.co';

const AnimePageAniListQuery = `query Media($mediaId: Int $mediaType: MediaType) {
  Media(id: $mediaId,type: $mediaType) {
    bannerImage
    coverImage {
      color
      extraLarge
      large
      medium
    }
    description
    duration
    episodes
    externalLinks {
      icon
      color
      id
      isDisabled
      language
      notes
      site
      siteId
      type
      url
    }
    isAdult
    meanScore
    season
    nextAiringEpisode {
      airingAt
      episode
    }
    relations {
      edges {
        id
        relationType
        node {
          bannerImage
          coverImage {
            color
            large
            medium
            extraLarge
          }
          averageScore
          countryOfOrigin
          chapters
          format
          type
          episodes
          isAdult
        }
      }
    }
  }
}`;
export {
	HIANIME,
	ANIMEPAHE,
	KAIZE,
	ANIMEPLANET,
	ANILIST_GQL,
	AnimePageAniListQuery,
};
