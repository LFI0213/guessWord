import { useState } from "react";
import { supabase } from "../lib/supabaseClient"
import Profile from "./Profile"

function SideMenu({ isOpen, onClose, user}) {

  /*console.log("SideMenu 收到的 user:", user);
  console.log("user_metadata:", user?.user_metadata);
  console.log("global_name:", user?.user_metadata?.custom_claims?.global_name);
  console.log("full_name:", user?.user_metadata?.full_name);
  console.log("name:", user?.user_metadata?.name);
  console.log("avatar_url:", user?.user_metadata?.avatar_url);*/
  
  const [menuPage,setMenuPage] = useState("Menu"); //要顯示menu裡的哪個功能頁面

  async function handleLogout() {
  
    const { error } = await supabase.auth.signOut({
      scope: "local"
    })
  
    if (error) {
     console.error(error);
    }
  }

  return (
    <>
      {/* 遮罩 */}
      <div
        className={`menu-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>

      {/* 側邊選單 */}
      <div className={`side-menu ${isOpen ? "open" : ""}`}>

        {/* 主選單 */}
        {menuPage === "Menu" && (
          <>

            {/* 關閉按鈕 */}
            <button
              className="menu-close"
              onClick={onClose}
            >
              ×
            </button>
            
            <h2>Menu</h2>

            <div className="menu-content">

              <button onClick={() => setMenuPage("Profile")}>
                Profile</button>

              <button>How to Play</button>

              <button>Settings</button>

              <button onClick={handleLogout}>
                Log out
              </button>

            </div>
          </>
        )}

        {/* Profile */}
        {menuPage === "Profile" && (
          <Profile
            user={user}
            onBack={() => setMenuPage("Menu")}
          />
        )}

      </div>
    </>
  );
}

export default SideMenu;