<<<<<<< HEAD
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
=======
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
>>>>>>> 1c2342d (wallet and review fixed)
import { db } from '../firebase/firebaseConfig';

// Fetch recent activities for a user
export const getRecentActivities = async (userId) => {
<<<<<<< HEAD
  const activitiesRef = collection(db, 'activities');
  const q = query(
    activitiesRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(10) // Fetch the 10 most recent activities
  );
  const activitySnap = await getDocs(q);
  return activitySnap.docs.map((doc) => doc.data());
=======
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    
    const activitySnap = await getDocs(q);
    
    // Get both transaction and job-related activities
    const activities = activitySnap.docs.map(doc => {
      const data = doc.data();
      let icon = data.icon;
      
      // Set default icons based on activity type if not provided
      if (!icon) {
        switch (data.type) {
          case 'contract_started':
            icon = '🤝';
            break;
          case 'job_completed':
            icon = '✅';
            break;
          case 'milestone_completed':
            icon = '🎯';
            break;
          default:
            icon = '📝';
        }
      }

      return {
        id: doc.id,
        ...data,
        icon,
        timestamp: data.timestamp?.toDate() || new Date()
      };
    });

    return activities.slice(0, 10);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

// Create a new activity
export const createActivity = async (activityData) => {
  try {
    const activitiesRef = collection(db, 'activities');
    const newActivity = {
      ...activityData,
      timestamp: serverTimestamp()
    };
    await addDoc(activitiesRef, newActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
  }
>>>>>>> 1c2342d (wallet and review fixed)
};
