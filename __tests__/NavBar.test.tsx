/**
 * @jest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
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
describe('Navigation Test Cases', () => {
  it('Should route to selected page in navbar', async () => {
    // ページを取得
    const { page } = await getPage({
      route: '/',
    })
    render(page)

    // 移動先ページの確認
    // toBeInTheDocument → 要素がドキュメントに存在するかどうか
    expect(await screen.findByText('Next.js + GraphQL')).toBeInTheDocument()

    // クリックして遷移できているかの確認
    // getByTestId → data-testid属性を設定しているdomを取得
    userEvent.click(screen.getByTestId('makevar-nav'))
    expect(await screen.findByText('makeVar')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('fetchpolicy-nav'))
    expect(await screen.findByText('Hasura main page')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('crud-nav'))
    expect(await screen.findByText('Hasura CRUD')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('ssg-nav'))
    expect(await screen.findByText('SSG+ISR')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('memo-nav'))
    expect(
      await screen.findByText('Custom Hook + useCallback + memo')
    ).toBeInTheDocument()
    userEvent.click(screen.getByTestId('home-nav'))
    expect(await screen.findByText('Next.js + GraphQL')).toBeInTheDocument()
  })
})