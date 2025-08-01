// components/UserSearch/UserSearch.js
import React, { useState } from "react";

function UserSearch() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);

  const handleSearch = () => {
    if (!username) return;

    // Имитация "поиска", Telegram API тут не используется
    const fakeAvatar = `https://t.me/i/userpic/320/${username}.jpg`; // не всегда работает
    const votes = Math.floor(Math.random() * 61) + 20; // от 20 до 80

    setUserData({
      username,
      avatar: fakeAvatar,
      votes,
    });
  };

  return (
    <div style={styles.container}>
      <h2>Поиск пользователя Telegram</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Введите username"
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>
        Найти
      </button>

      {userData && (
        <div style={styles.result}>
          <img
            src={userData.avatar}
            alt="Аватар"
            style={styles.avatar}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/100"; // если нет фото
            }}
          />
          <p>
            <strong>@{userData.username}</strong>
          </p>
          <p>Голосов: {userData.votes}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { marginTop: 30 },
  input: { padding: 10, fontSize: 16, marginRight: 10 },
  button: { padding: "10px 20px", fontSize: 16, cursor: "pointer" },
  result: { marginTop: 20, textAlign: "center" },
  avatar: { width: 100, height: 100, borderRadius: "50%", objectFit: "cover" },
};

export default UserSearch;
