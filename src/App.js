import React, { useState, useEffect } from "react";
import TelegramLogin from "./components/TelegramLogin/TelegramLogin";
import DriverStatus from "./components/DriverStatus";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isTelegramApp, setIsTelegramApp] = useState(false);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setIsTelegramApp(true);
      const tg = window.Telegram.WebApp;
      tg.expand();

      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        setUserData({
          username:
            user.username ||
            `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`,
          photoUrl: user.photo_url || null,
        });
      }
    }
  }, []);

  return (
    <div style={styles.container}>
      {!showLogin ? (
        <>
          <h1>Добро пожаловать!</h1>

          {isTelegramApp && userData ? (
            <div style={styles.userInfo}>
              {userData.photoUrl && (
                <img
                  src={userData.photoUrl}
                  alt="User Avatar"
                  style={styles.avatar}
                />
              )}
              <p>{userData.username}</p>
            </div>
          ) : (
            <p>Аноним</p>
          )}

          <DriverStatus />

          <p>Нажмите кнопку ниже, чтобы подвязать</p>
          <button onClick={() => setShowLogin(true)} style={styles.button}>
            Подвязать
          </button>
        </>
      ) : (
        <TelegramLogin />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: "0 auto",
    padding: 20,
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    cursor: "pointer",
  },
  userInfo: {
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    marginBottom: 10,
  },
};

export default App;
