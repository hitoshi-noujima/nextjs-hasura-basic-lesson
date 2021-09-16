
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
describe('Hasura CRUD Test Cases', () => {
  it('Should render the list of users by useQuery', async () => {
    // ページを取得
    const { page } = await getPage({
      route: '/hasura-crud',
    })
    render(page)

    // 移動先ページの確認
    // toBeInTheDocument → 要素がドキュメントに存在するかどうか
    expect(await screen.findByText('Hasura CRUD')).toBeInTheDocument()

    // ユーザー情報を取得出来ているかを確認（fetch処理が入るのでawaitしている）
    expect(await screen.findByText('Test user A')).toBeInTheDocument()
    expect(
      screen.getByText('2021-01-13T18:06:46.412969+00:00')
    ).toBeInTheDocument()
    // getByTestId → data-testid属性を設定しているdomを取得
    // toBeTruthy → trueかどうかを判定
    expect(
      screen.getByTestId('edit-b6137849-7f1d-c2db-e609-22056fb86db3')
    ).toBeTruthy()
    expect(
      screen.getByTestId('delete-b6137849-7f1d-c2db-e609-22056fb86db3')
    ).toBeTruthy()
    expect(screen.getByText('Test user B')).toBeInTheDocument()
    expect(
      screen.getByText('2021-02-13T18:06:46.412969+00:00')
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('edit-2b07950f-9959-1bc7-834d-5656e4aeaac2')
    ).toBeTruthy()
    expect(
      screen.getByTestId('delete-2b07950f-9959-1bc7-834d-5656e4aeaac2')
    ).toBeTruthy()
    expect(screen.getByText('Test user C')).toBeInTheDocument()
    expect(
      screen.getByText('2021-03-13T18:06:46.412969+00:00')
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('edit-7fe58619-10ec-5239-6f43-1da15a634aba')
    ).toBeTruthy()
    expect(
      screen.getByTestId('delete-7fe58619-10ec-5239-6f43-1da15a634aba')
    ).toBeTruthy()
  })
})