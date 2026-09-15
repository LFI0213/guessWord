import { useEffect, useState } from 'react'

import { supabase } from './lib/supabaseClient'
import Auth from './components/Auth'

function App() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    getCurrentUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (event, session) => {

        console.log('Auth event:', event)

        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }

  }, [])

  async function getCurrentUser() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    setUser(user)

    setLoading(false)
  }

  async function handleLogout() {

    const { error } = await supabase.auth.signOut({
      scope: 'local'
    })

    if (error) {
      console.error(error)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div>

      <h1>Guess Word</h1>

      <h2>登入成功！</h2>

      <p>
        Email：{user.email}
      </p>

      <p>
        User ID：{user.id}
      </p>

      <button onClick={handleLogout}>
        登出
      </button>

    </div>
  )
}

export default App