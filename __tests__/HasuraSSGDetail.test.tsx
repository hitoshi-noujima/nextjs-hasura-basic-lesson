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
describe('UserDetail Test Cases', () => {
  it('Should render the user detail pre-fetched by getStaticProps', async () => {

    // ページを取得
    const { page } = await getPage({
      route: '/users/b6137849-7f1d-c2db-e609-22056fb86db3',
    })
    render(page)

    // 移動先ページの確認
    // toBeInTheDocument → 要素がドキュメントに存在するかどうか
    expect(await screen.findByText('User detail')).toBeInTheDocument()
    expect(screen.getByText('Test user A')).toBeInTheDocument()
    expect(
      screen.getByText('2021-01-13T18:06:46.412969+00:00')
    ).toBeInTheDocument()

    // メインページへの遷移を確認
    userEvent.click(screen.getByTestId('back-to-main'))
    expect(await screen.findByText('SSG+ISR')).toBeInTheDocument()
    userEvent.click(
      screen.getByTestId('link-2b07950f-9959-1bc7-834d-5656e4aeaac2')
    )

    // ユーザー個別ページへの遷移を確認
    expect(await screen.findByText('User detail')).toBeInTheDocument()
    expect(screen.getByText('Test user B')).toBeInTheDocument()
    expect(
      screen.getByText('2021-02-13T18:06:46.412969+00:00')
    ).toBeInTheDocument()
  })
})