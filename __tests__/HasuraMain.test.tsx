
/**
 * @jest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { setupServer } from 'msw/node'
import { getPage, initTestHelpers } from 'next-page-tester'
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
describe('Hasura Fetch Test Cases', () => {
  it('Should render the list of users by useQuery', async () => {
    // ページを取得
    const { page } = await getPage({
      route: '/hasura-main',
    })
    render(page)

    // 移動先ページの確認
    // toBeInTheDocument → 要素がドキュメントに存在するかどうか
    expect(await screen.findByText('Hasura main page')).toBeInTheDocument()

    // ユーザー情報を取得出来ているかを確認（fetch処理が入るのでawaitしている）
    expect(await screen.findByText('Test user A')).toBeInTheDocument()
    expect(screen.getByText('Test user B')).toBeInTheDocument()
    expect(screen.getByText('Test user C')).toBeInTheDocument()
  })
})