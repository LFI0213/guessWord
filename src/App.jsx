import { useEffect, useState } from "react"
import { supabase } from "./lib/supabaseClient"
import './App.css'
import "./components/SideMenu.css"
import "./components/Profile.css"
import Auth from "./components/Auth"
import Game from "./components/Game"

function App() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    getCurrentUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (event, session) => {

        console.log("Auth event:", event)

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

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) return <Auth />
  else return <Game user={user}/>
}

export default App