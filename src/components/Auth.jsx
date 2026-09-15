import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Auth() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isRegister, setIsRegister] = useState(false)

  const [message, setMessage] = useState('')

  async function handleSubmit(e) {

    e.preventDefault()

    setMessage('')

    if (isRegister) {

      const { error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        setMessage(error.message)
        return
      }

      setMessage('註冊成功，請確認您的Email！')

    } else {

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setMessage(error.message)
        return
      }

      setMessage('登入成功！')
    }
  }

  return (
    <div>

      <h2>
        {isRegister ? '註冊帳號' : '登入'}
      </h2>

      <form onSubmit={handleSubmit}>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">
          {isRegister ? '註冊' : '登入'}
        </button>

      </form>

      <p>{message}</p>

      <button
        onClick={() => {
          setIsRegister(!isRegister)
          setMessage('')
        }}
      >
        {isRegister
          ? '已經有帳號？前往登入'
          : '還沒有帳號？前往註冊'
        }
      </button>

    </div>
  )
}

export default Auth