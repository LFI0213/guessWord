import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { PiCaretLeft } from "react-icons/pi";

function Profile({ user, profile,onProfileUpdated,onBack, onClose}) {

  const avatarUrl = user?.user_metadata?.avatar_url; //找頭貼

  const username =
        profile?.username || "Player";

  const createTime = user?.created_at || "Wrong Time";

  const formatTime = new Date(createTime).toLocaleDateString("en-GB",{
    day:"numeric",
    month:"long",
    year:"numeric",
  });

  return (
    <>
      {/* 返回和關閉按鈕 */}
      <div className="top">

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

      {/* 標題 */}
      <div className="profile-header">

        <p>
          GUESSWORD / PROFILE
        </p>

        <h2>
          Profile
        </h2>

        <p className="slogan">
          Every guess is a step forward
        </p>

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

        <div className="nameAndtime-container">
          {/* username */}
          <h4 className="profile-username">
            {username}
          </h4>

          {/* createTime */}
          <text className="profile-createtime">
            Joined {formatTime}
          </text>
        </div>
      
      </div>
    </>
  );
}

export default Profile;