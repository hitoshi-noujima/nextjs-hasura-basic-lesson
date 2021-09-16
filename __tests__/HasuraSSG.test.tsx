/**
 * @jest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { getPage, initTestHelpers } from 'next-page-tester'
import { setupServer } from 'msw/node'
import { handlers } from '../mock/handlers'
import 'setimmediate'

process.env.NEXT_PUBLIC_HASURA_URL = "https://01-basic-lesson-hasura.hasura.app/v1/graphql"

// 初期化
initTestHelpers()

// モックサーバのセットアップ
const server = setupServer(...handlers)

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})

// test
describe('SSG Test Cases', () => {
  it('Should render the list of users pre-fetched by getStaticProps', async () => {

    // ページを取得
    const { page } = await getPage({
      route: '/hasura-ssg',
    })
    render(page)

    // 移動先ページの確認
    // toBeInTheDocument → 要素がドキュメントに存在するかどうか
    expect(await screen.findByText('SSG+ISR')).toBeInTheDocument()
    expect(screen.getByText('Test user A')).toBeInTheDocument()
    expect(screen.getByText('Test user B')).toBeInTheDocument()
    expect(screen.getByText('Test user C')).toBeInTheDocument()
  })
})
