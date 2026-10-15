import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { PiCaretLeft } from "react-icons/pi";
import { GoPencil } from "react-icons/go";
import { createPortal } from "react-dom";

function Profile({ user, profile,onProfileUpdated,onBack, onClose}) {

  const avatarUrl = user?.user_metadata?.avatar_url; //找頭貼

  const username = profile?.username || "Player";

  const createTime = user?.created_at || "Wrong Time";

  const formatTime = new Date(createTime).toLocaleDateString("en-GB",{
    day:"numeric",
    month:"long",
    year:"numeric",
  });

  const [isEditing, setIsEditing] = useState(false); //是否開啟編輯視窗
  const [editedName, setEditedName] = useState(""); //輸入框裡的名字
  const [isSaving, setIsSaving] = useState(false); //是否正在儲存
  const [saveError, setSaveError] = useState(""); //儲存失敗的訊息

  function handleOpenEdit() {
    setEditedName(username); //先把目前的名字放進輸入框
    setSaveError(""); //清除上一次的錯誤訊息
    setIsEditing(true); //開啟視窗
  }

  async function handleSaveProfile(event) {
    event.preventDefault(); //避免表單送出時重新整理頁面

    if (isSaving) return;

    const newName = editedName.trim(); //移除前後空白

    if (newName.length < 1 || newName.length > 20) {
      setSaveError("Please enter a name that is 1 to 20 characters long");
      return;
    }

    if (!user?.id) {
      setSaveError("Please login first");
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ username: newName })
        .eq("id", user.id)
        .select("id, username, created_at, update_time")
        .single();

      if (error) throw error;

      onProfileUpdated(data); //資料庫更新成功後，再更新畫面
      setIsEditing(false);
    } catch (error) {
      console.error("更新個人資料失敗：", error);
      setSaveError("Save failed, please try again later");
    } finally {
      setIsSaving(false);
    }
  }

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

        <button 
          className="edit-btn"
          onClick={handleOpenEdit}
          >
          <GoPencil size={14}/>
        </button>
      
      </div>

      {/* 編輯Profile區 */}
      {isEditing && createPortal(
        <div className="edit-profile-overlay">
          <section
            className="edit-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <button
              type="button"
              className="edit-profile-close"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              aria-label="關閉編輯視窗"
            >
              ×
            </button>

            <p className="edit-profile-label">MAKE IT YOURS</p>

            <h2 id="edit-profile-title">Edit Profile</h2>

            <form onSubmit={handleSaveProfile}>
              <label htmlFor="profile-name">Display Name</label>

              <input
                id="profile-name"
                type="text"
                value={editedName}
                onChange={event => setEditedName(event.target.value)}
                maxLength={20}
                disabled={isSaving}
                required
              />

              <small>1–20 characters, Chinese characters can be used</small>

              {saveError && <p role="alert">{saveError}</p>}

              <div className="edit-profile-actions">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving…" : "✓ Save"}
                </button>
              </div>
            </form>
          </section>
        </div>,
        document.body
      )}
    </>
  );
}

export default Profile;