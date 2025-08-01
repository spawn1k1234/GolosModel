// import { getDatabase, ref, onValue } from "firebase/database";
// import { useEffect, useState } from "react";

// function DriverStatus() {
//   const [status, setStatus] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const db = getDatabase();
//     const statusRef = ref(db, "driver/status");

//     const unsubscribe = onValue(statusRef, (snapshot) => {
//       const data = snapshot.val();
//       setStatus(data?.status || "offline");
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) return <p>Проверка подключения софта...</p>;

//   return (
//     <div style={{ marginTop: 10 }}>
//       <strong>Софт: </strong>
//       <span style={{ color: status === "running" ? "green" : "red" }}>
//         {status === "running" ? "Подключён" : "Не подключён"}
//       </span>
//     </div>
//   );
// }

// export default DriverStatus;
import { ref, onValue } from "firebase/database";
import { database } from "../config/firebase-config"; // импортируй правильно

import { useEffect, useState } from "react";

function DriverStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statusRef = ref(database, "driver/status"); // используем 'database'

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      setStatus(data?.status || "offline");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Проверка подключения софта...</p>;

  return (
    <div style={{ marginTop: 10 }}>
      <strong>Софт: </strong>
      <span style={{ color: status === "running" ? "green" : "red" }}>
        {status === "running" ? "Подключён" : "Не подключён"}
      </span>
    </div>
  );
}

export default DriverStatus;
