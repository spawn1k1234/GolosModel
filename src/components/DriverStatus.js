import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

function DriverStatus() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const db = getDatabase();
    const statusRef = ref(db, "driver/status");

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      setStatus(data?.status || "offline");
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ marginTop: 10 }}>
      <strong>Драйвер: </strong>
      <span style={{ color: status === "running" ? "green" : "red" }}>
        {status === "running" ? "В сети" : "Отключен"}
      </span>
    </div>
  );
}

export default DriverStatus;
