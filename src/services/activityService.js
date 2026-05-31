import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const getRecentActivities = (callback) => {

  const q = query(
    collection(db, "activities"),
    orderBy("timestamp", "desc"),
    limit(5)
  );

  return onSnapshot(q, (snapshot) => {

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(data);

  });

};