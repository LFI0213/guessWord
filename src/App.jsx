import { useEffect, useState } from "react"
import { supabase } from "./lib/supabaseClient"
import './App.css'
import "./components/SideMenu.css"
import "./components/Profile.css"
import Auth from "./components/Auth"
import Game from "./components/Game"

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser(); //先取得目前登入的使用者

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        console.log("Auth event:", event);

        const currentUser = session?.user ?? null;

        setUser(currentUser);

        // 登入成功時，建立/更新 profile
        if (currentUser && event === "SIGNED_IN") {
          await saveProfile(currentUser)
        }
      }
    )

    return () => {
      subscription.unsubscribe();
    }

  }, [])

  //建立/更新Profile資料
  async function saveProfile(user){
    const username =
          user?.user_metadata?.custom_claims?.global_name ||
          user?.user_metadata?.full_name ||
          "Player";

    const {error} = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            username: username,
          })
      
    if(error) console.error("save profile failed:",error);
  }

  //取得目前已經登入的使用者
  async function getCurrentUser() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    setUser(user)

    if(user) await saveProfile(user); //如果已經登入，就建立/更新資料

    setLoading(false)
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) return <Auth />
  else return <Game user={user}/>
}

export default App