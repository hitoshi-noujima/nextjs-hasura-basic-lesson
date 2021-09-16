import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import 'cross-fetch/polyfill'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // ブラウザではない
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_URL,
      headers: {
        'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_KEY,
      },
    }),
    cache: new InMemoryCache(),
  })
}

export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient()
  // SSGおよびSSRの場合、常に新しいApolloクライアントを作成します
  if (typeof window === 'undefined') return _apolloClient
  // クライアントで一度Apolloクライアントを作成します
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}