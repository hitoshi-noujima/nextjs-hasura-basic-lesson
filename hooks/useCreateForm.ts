import { useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries/queries'
import { CreateUserMutation } from '../types/generated/graphql'

export const useCreateForm = () => {
  const [text, setText] = useState('')
  const [username, setUsername] = useState('')

  // create
  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    update(cache, { data: { insert_users_one } }) {
      // キャッシュのidを取得
      const cacheId = cache.identify(insert_users_one)
      // キャッシュの更新
      cache.modify({
        fields: {
          users(existingUsers, { toReference }) {
            return [toReference(cacheId), ...existingUsers]
          },
        },
      })
    },
  })

  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }, [])

  const usernameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }, [])

  const printMsg = useCallback(() => {
    console.log('Hello')
  }, [])

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        await insert_users_one({
          variables: {
            name: username,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setUsername('')
    },
    [username]
  )

  return {
    text,
    handleSubmit,
    username,
    usernameChange,
    printMsg,
    handleTextChange,
  }
}