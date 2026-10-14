import { PiCaretLeft } from "react-icons/pi";

function Profile({ user, onBack, onClose}) {

  const avatarUrl = user?.user_metadata?.avatar_url; //找頭貼

  const username =
        user?.user_metadata?.custom_claims?.global_name ||
        user?.user_metadata?.full_name ||
        "Player";

  const createTime = user?.created_at || "Wrong Time";

  return (
    <>
      {/* 標題 */}
      <div className="profile-header">

        <button
          className="profile-back"
          onClick={onBack}
        >
          <PiCaretLeft
          style={{marginTop:"1px"}}
            size={20}
          />
          Menu
        </button>

        {/* 關閉按鈕 */}
        <button
          className="menu-close"
          onClick={onClose}
        >
          ×
        </button>

      </div>

      {/* 內容 */}
      <div className="profile-content">

        {/* 頭貼 */}
        <div className="profile-avatar">

          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile Avatar"
            />
          ):(
            <span>
              {username.charAt(0).toUpperCase()}
            </span>
          )}

        </div>

        {/* username */}
        <h3 className="profile-username">
          {username}
        </h3>

        {/* createTime */}
        <text className="profile-createtime">
          Joined {createTime}
        </text>

      </div>
    </>
  );
}

export default Profile;