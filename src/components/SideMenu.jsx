import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { RiAccountCircleLine } from "react-icons/ri";
import { FiBookOpen } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import WordPreview from "./WordPreview";
import Profile from "./Profile";

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
            
            <img className="menu-game-logo"
              src="/guess-word-logo.png" 
              alt="Guess Word" 
            />

            <div className="menu-content">

                <button onClick={() => setMenuPage("Profile")}>
                  <RiAccountCircleLine 
                    size={30}
                  />
                  Profile
                </button>

              <button>
                <FiBookOpen
                  size={30}
                />
                How to Play
              </button>

              <button>
                <IoSettingsOutline 
                  size={30}
                />
                Settings
              </button>

              <button onClick={handleLogout}>
                <MdLogout
                  size={30}
                />
                Log out
              </button>

            </div>

            <WordPreview 
              size={35} fontSize={15} gap={4}
              style={{
                borderTop:"2px solid #e0e0e0",
                paddingTop: "25px",
                margin: "16px 25px 25px",
              }}
            />
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