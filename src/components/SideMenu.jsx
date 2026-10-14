import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { RiAccountCircleLine } from "react-icons/ri";
import { FiBookOpen } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { PiCaretRight } from "react-icons/pi";
import WordPreview from "./WordPreview";
import Profile from "./Profile";
import { AuthError } from "@supabase/supabase-js";

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
            <div className="top-header">
              {/* 上方小字 */}
              <div className="smallword">
                YOUR GUESSWORD
              </div>
                       
              {/* 關閉按鈕 */}
              <button
                className="menu-close"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            
            <img className="menu-game-logo"
              src="/guess-word-logo.png" 
              alt="Guess Word" 
            />

            <div className="menu-content">

              <button onClick={() => setMenuPage("Profile")}>
                <RiAccountCircleLine 
                  size={32}
                />
                <span className="menu-label">Profile</span>
                <PiCaretRight className="rightArrow-icon"/>
              </button>

              <button>
                <FiBookOpen
                  size={32}
                />
                <span className="menu-label">How to Play</span>
                <PiCaretRight className="rightArrow-icon"/>
              </button>

              <button>
                <IoSettingsOutline 
                  size={32}
                />
                <span className="menu-label">Settings</span>
                <PiCaretRight className="rightArrow-icon"/>
              </button>

              <button onClick={handleLogout}>
                <MdLogout
                  size={32}
                />
                <span className="menu-label">Log out</span>
                <PiCaretRight className="rightArrow-icon"/>
              </button>

            </div>

            <WordPreview 
              size={30} fontSize={14} gap={4}
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
            onClose={onClose}
            onBack={() => setMenuPage("Menu")}
          />
        )}

      </div>
    </>
  );
}

export default SideMenu;