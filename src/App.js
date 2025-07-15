import { useState } from "react";
import axios from "axios";

function App() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [awaitingCode, setAwaitingCode] = useState(false);

  const NGROK_URL = "https://0576d32f6aa9.ngrok-free.app "; // <-- замени на свой актуальный

  const handlePhoneSubmit = async () => {
    try {
      await axios.post(`${NGROK_URL}/start-login`, { phone });
      setAwaitingCode(true);
    } catch (err) {
      alert("Ошибка отправки номера");
    }
  };

  const handleCodeSubmit = async () => {
    try {
      await axios.post(`${NGROK_URL}/send-code`, { code });
      alert("Код отправлен!");
    } catch (err) {
      alert("Ошибка отправки кода");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Telegram Login</h2>
      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handlePhoneSubmit}>Next</button>

      {awaitingCode && (
        <>
          <br />
          <br />
          <input
            placeholder="Enter Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleCodeSubmit}>Submit Code</button>
        </>
      )}
    </div>
  );
}

export default App;
