let ANIMEPAHE_URL: string = 'https://animepahe.ru';
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

const AnimeNameAniListQuery = `query Media($mediaId: Int) {
  Media(id: $mediaId) {
    id
    isAdult
    title {
      english
      native
      romaji
    }
    seasonYear
  }
}`;

const AnimeSearchAniListQuery = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      hasNextPage
      lastPage
      perPage
      total
    }
    media(search: $search, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      description
      format
      countryOfOrigin
      coverImage {
        medium
        large
      }
      format
      status
      episodes
      popularity
      averageScore
      bannerImage
    }
  }
}
`;
export {
	ANIMEPAHE_URL,
	ANILIST_GQL,
	AnimePageAniListQuery,
	AnimeNameAniListQuery,
	AnimeSearchAniListQuery,
};
