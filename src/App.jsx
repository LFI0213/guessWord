import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import './App.css';
import "./components/SideMenu.css";
import "./components/Profile.css";
import "./components/Auth.css"
import Auth from "./components/Auth";
import Game from "./components/Game";

function App() {
  const [user, setUser] = useState(null); //第三方登入使用者
  const [profile, setProfile] = useState(null); //Profiles資料表中的資料
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const userId = user?.id;

  const defaultUsername =
        user?.user_metadata?.custom_claims?.global_name ||
        user?.user_metadata?.full_name ||
        "Player";

  //取得初始登入狀態，並監聽之後的登入/登出
  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);

        const currentUser = session?.user ?? null;

        setUser(currentUser);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //讀取Profile，沒有資料時才建立
  useEffect(() => {
    let ignore = false;

    setProfile(null);
    setProfileError("");

    if (!userId) {
      return;
    }

    async function loadProfile() {
      try {
        const { data: existingProfile, error: readError } = await supabase
          .from("profiles")
          .select("id, username, created_at")
          .eq("id", userId)
          .maybeSingle();

        if (readError) throw readError;

        //已有個人資料，直接使用資料庫裡的內容
        if (existingProfile) {
          if (!ignore) {
            setProfile(existingProfile);
          }

          return;
        }

        //沒有個人資料，才使用第三方名字建立
        const { error: createError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: userId,
              username: defaultUsername,
            },
            {
              onConflict: "id", //找不到相同id:新增資料，已有相同id:略過不修改
              ignoreDuplicates: true,
            }
          );

        if (createError) throw createError;

        //取得建立後的完整資料
        const { data: createdProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("id, username, created_at")
          .eq("id", userId)
          .single();

        if (fetchError) throw fetchError;

        if (!ignore) {
          setProfile(createdProfile);
        }
      } catch (error) {
        console.error("load profile failed:", error);

        if (!ignore) {
          setProfileError("無法讀取個人資料，請重新整理頁面後再試。");
        }
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [userId, defaultUsername]);

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) return <Auth />;

  if (profileError) {
    return <p role="alert">{profileError}</p>;
  }

  if (!profile || profile.id !== user.id) {
    return <p>Loading profile...</p>;
  }

  return (
    <Game
      user={user}
      profile={profile}
      onProfileUpdated={setProfile}
    />
  );
}

export default App;