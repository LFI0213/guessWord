import { supabase } from "../lib/supabaseClient"
function SideMenu({ isOpen, onClose, user}) {

  console.log(user);

  const avatarUrl = user?.user_metadata?.avatar_url

  const username =
        user?.user_metadata?.custom_claims?.global_name ||
        user?.user_metadata?.full_name ||
        "Player"

  async function handleLogout() {
  
    const { error } = await supabase.auth.signOut({
      scope: "local"
    })
  
    if (error) {
     console.error(error)
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

        {/* 關閉按鈕 */}
        <button
          className="menu-close"
          onClick={onClose}
        >
          ×
        </button>

        <h2>Menu</h2>

        <div className="menu-content">
          <button>Profile</button>
          <button>How to Play</button>
          <button>Settings</button>
          <button onClick={handleLogout}>
            Log out
          </button>
        </div>

      </div>
    </>
  );
}

export default SideMenu;