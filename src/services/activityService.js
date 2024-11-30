import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Fetch recent activities for a user
export const getRecentActivities = async (userId) => {
  const activitiesRef = collection(db, 'activities');
  const q = query(
    activitiesRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(10) // Fetch the 10 most recent activities
  );
  const activitySnap = await getDocs(q);
  return activitySnap.docs.map((doc) => doc.data());
};
