import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Auth() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isRegister, setIsRegister] = useState(false);

  //訊息內容
  const [message, setMessage] = useState("");

  //訊息類別 success/error
  const [messageType,setMessageType] = useState("");

  //是否正在處理登入/註冊
  const [loading,setLoading] = useState(false);

  //是否顯示重新寄送驗證信箱
  const [showResend,setShowResend] = useState(false);

  async function handleDiscordLogin(e){
    const {data,error} = await supabase.auth.signInWithOAuth({
      provider:"discord"
    })
    if(error) console.error(error);
  }

  async function handleSubmit(e) {

    e.preventDefault();

    setMessage("");
    setMessageType("");
    setShowResend(false);

    if(!email || !password){
      setMessage("Please enter email and password.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    // ===================
    // 註冊
    // ===================
    if (isRegister) {

      const { data,error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        setMessage(error.message);
        setMessageType("error");
        setLoading(false);
        return;
      }

      //Supabase開啟Email Confirmation時，註冊成功通常會有user，但沒有session
      if(data.user && !data.session){
        setMessage(`Registration successful! A verification email has been sent to ${email}. Please complete the email verification in Gmail.`);
        setMessageType("success");
        setShowResend(true);
      }
      else{
        setMessage("Registration successful");
        setMessageType("success");
      }
      setLoading(false);
      return;
    }

    // ===================
    // 登入
    // ===================
    const {data,error} = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      setLoading(false);
      return;
    }

    //檢查Email是否已驗證
    if(data.user && !data.user.email_confirmed_at){
      //如果沒有驗證
      await supabase.auth.signOut({
        scope:"local"
      })

      setMessage("This email address has not been verified. Please go to Gmail and click the verification link.");
      setMessageType("error");
      setShowResend(true);
      setLoading(false);
      return;
    }

    //登入成功
    setMessage("Login successful!");
    setMessageType("success");
    setLoading(false);
  }

  // ===================
  // 重新寄送驗證信
  // ===================
  async function handleResendEmail() {
    if(!email){
      setMessage("Please enter your email first.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    const{error} = await supabase.auth.resend({
      type:"signup",
      email:email
    })

    if(error){
      setMessage(error.message);
      setMessageType("error");
    }
    else{
      setMessage(`The verification email has been resent to ${email}. Please check your Gmail.`);
      setMessageType("success");
    }

    setLoading(false);
  }

  // ===================
  // 切換登入/註冊
  // ===================
  function handleSwitchMode(){
    setIsRegister(!isRegister);
    setMessage("");
    setMessageType("");
    setShowResend(false);
  }

  return (

    <div className="auth-page">


      {/* =========================
          左側品牌區域
          ========================= */}

      <div className="auth-brand">

        <h1>GUESS WORD</h1>

        <p>
          Guess. Learn. Keep playing.
        </p>


        {/* Wordle 風格字母 */}

        <div className="word-preview">

          <span className="preview-tile correct">
            G
          </span>

          <span className="preview-tile wrong-position">
            U
          </span>

          <span className="preview-tile not-in-word">
            E
          </span>

          <span className="preview-tile correct">
            S
          </span>

          <span className="preview-tile">
            S
          </span>

        </div>

      </div>


      {/* =========================
          登入 / 註冊卡片
          ========================= */}

      <div className="auth-card">


        {/* 副標題 */}

        <p className="auth-subtitle">

          {isRegister? "Create your account" : "Welcome back"}

        </p>


        {/* Login / Register */}

        <h2 className="auth-heading">

          {isRegister? "Create an account" : "Log in"}

        </h2>


        {/* ===================
            表單
            =================== */}

        <form onSubmit={handleSubmit}>


          {/* Email */}

          <div className="input-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>


          {/* Password */}

          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword? "text" : "password"}
                placeholder="Please enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword? <FaEyeSlash/> : <FaEye/>}
              </button>
            </div>

          </div>


          {/* Submit */}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Processing..."
              : isRegister
                ? "Create account"
                : "Log in"}

          </button>

        </form>


        {/* ===================
            訊息
            =================== */}

        {message && (

          <div
            className={`auth-message ${messageType}`}
          >
            {message}
          </div>

        )}


        {/* ===================
            重新寄送驗證信
            =================== */}

        {showResend && (

          <button
            className="resend-button"
            onClick={handleResendEmail}
            disabled={loading}
          >

            Resend verification email

          </button>

        )}


        {/* ===================
            切換登入 / 註冊
            =================== */}

        <button
          className="switch-button"
          onClick={handleSwitchMode}
        >

          {isRegister
            ? "Already have an account? Log in."
            : "Don't have an account? Register here."}

        </button>

        <button
          className="discord"
          onClick={handleDiscordLogin}
        >
          <img
            src="/Discord-Symbol-Blurple.svg"
            alt="Discord"
            className="discord-icon"
          />
          Continue with Discord
        </button>

      </div>

    </div>
  );
}

export default Auth