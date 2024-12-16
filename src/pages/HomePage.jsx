// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/FirebaseAuthContext";
// import { getUserStats, getFreelancerStats, getClientStats } from "../services/userService";
// import { getRecentActivities } from "../services/activityService";
// import { getTrendingSkills } from "../services/jobService";
// import { Link } from "react-router-dom";
// import WalletBalance from "../components/WalletBalance";

// const HomePage = () => {
//   const { currentUser, userData } = useAuth();
//   const userRole = userData?.role || "client";

//   const [userStats, setUserStats] = useState(null);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [trendingSkills, setTrendingSkills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [walletBalance, setWalletBalance] = useState(0);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         if (!currentUser) return;

//         // Fetch stats based on role
//         let stats = null;
//         if (userRole === "freelancer") {
//           stats = await getFreelancerStats(currentUser.uid);
//         } else {
//           stats = await getClientStats(currentUser.uid);
//         }
//         setUserStats(stats);

//         // Fetch recent activities
//         const activities = await getRecentActivities(currentUser.uid);
//         setRecentActivity(activities);

//         // Fetch trending skills dynamically
//         const skills = await getTrendingSkills();
//         setTrendingSkills(skills);

//         // TODO: Fetch wallet balance
//         // For now, we'll use a placeholder value
//         setWalletBalance(1000);
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError("Failed to load data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [currentUser, userRole]);

//   if (loading) {
//     return <div className="text-center mt-8">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center mt-8 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 text-white">
//       <main className="container mx-auto px-4 py-8">
//         <h2 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
//           {userRole === "freelancer" ? "Freelancer Dashboard" : "Client Dashboard"}
//         </h2>

//         {/* Welcome Section */}
//         <section className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 mb-8">
//           <h3 className="text-2xl font-semibold mb-4">
//             Welcome back, {userData?.fullName || currentUser?.displayName || "User"}!
//           </h3>
//           <div className="flex flex-col md:flex-row justify-around items-center gap-4">
//             <div className="flex justify-around w-full md:w-auto">
//               {userRole === "freelancer" ? (
//                 <>
//                   <div className="text-center mx-4">
//                     <p className="text-3xl font-bold">{userStats?.completedJobs || 0}</p>
//                     <p className="text-sm">Completed Jobs</p>
//                   </div>
//                   <div className="text-center mx-4">
//                     <p className="text-3xl font-bold">₦{userStats?.earnings || 0}</p>
//                     <p className="text-sm">Total Earnings</p>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="text-center mx-4">
//                     <p className="text-3xl font-bold">{userStats?.postedJobs || 0}</p>
//                     <p className="text-sm">Posted Jobs</p>
//                   </div>
//                   <div className="text-center mx-4">
//                     <p className="text-3xl font-bold">{userStats?.activeContracts || 0}</p>
//                     <p className="text-sm">Active Contracts</p>
//                   </div>
//                 </>
//               )}
//             </div>
//             <div className="w-full md:w-auto">
//               <WalletBalance balance={walletBalance} />
//             </div>
//           </div>
//         </section>

//         {/* Quick Actions */}
//         <section className="mb-8">
//           <h3 className="text-2xl font-semibold mb-4">Quick Actions</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {userRole === "freelancer" ? (
//               <>
//                 <QuickActionCard to="/jobs" title="Browse Jobs" icon="🔍" />
//                 <QuickActionCard to="/proposals" title="My Proposals" icon="📋" />
//                 <QuickActionCard to="/messages" title="Messages" icon="💬" />
//                 <QuickActionCard to="/profile" title="Update Profile" icon="👤" />
//               </>
//             ) : (
//               <>
//                 <QuickActionCard to="/post-job" title="Post a Job" icon="📝" />
//                 <QuickActionCard to="/my-jobs" title="My Jobs" icon="📊" />
//                 <QuickActionCard to="/messages" title="Messages" icon="💬" />
//                 <QuickActionCard to="/find-freelancers" title="Find Freelancers" icon="🔎" />
//               </>
//             )}
//           </div>
//         </section>

//         {/* Recent Activity */}
//         <section className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 mb-8">
//           <h3 className="text-2xl font-semibold mb-4">Recent Activity</h3>
//           <ul className="space-y-2">
//             {recentActivity.map((activity, index) => (
//               <li key={index} className="flex justify-between items-center">
//                 <span>{activity.text}</span>
//                 <span className="text-sm text-gray-300">
//                   {new Date(activity.timestamp.seconds * 1000).toLocaleString()}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </section>

//         {/* Trending Skills */}
//         <section className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6">
//           <h3 className="text-2xl font-semibold mb-4">Trending Skills</h3>
//           <div className="flex flex-wrap gap-2">
//             {trendingSkills.map((skill, index) => (
//               <span key={index} className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm">
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// const QuickActionCard = ({ to, title, icon }) => (
//   <Link
//     to={to}
//     className="bg-white bg-opacity-20 backdrop-blur-lg text-white p-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-opacity-30 transition-all duration-300 flex flex-col items-center text-center"
//   >
//     <span className="text-3xl mb-2">{icon}</span>
//     <h4 className="text-lg font-semibold">{title}</h4>
//   </Link>
// );

// export default HomePage;
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/FirebaseAuthContext";
import { getUserStats, getFreelancerStats, getClientStats } from "../services/userService";
import { getRecentActivities } from "../services/activityService";
import { getTrendingSkills } from "../services/jobService";
import { Link } from "react-router-dom";
import WalletBalance from "../components/WalletBalance";
import { FaUser, FaSearch, FaFileAlt, FaComments, FaUserCircle, FaPencilAlt, FaChartBar, FaIdCard } from "react-icons/fa";

const HomePage = () => {
  const { currentUser, userData } = useAuth();
  const userRole = userData?.role || "client";

  const [userStats, setUserStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!currentUser) return;

        // Fetch stats based on role
        let stats = null;
        if (userRole === "freelancer") {
          stats = await getFreelancerStats(currentUser.uid);
        } else {
          stats = await getClientStats(currentUser.uid);
        }
        setUserStats(stats);

        // Fetch recent activities
        const activities = await getRecentActivities(currentUser.uid);
        setRecentActivity(activities);

        // Fetch trending skills dynamically
        const skills = await getTrendingSkills();
        setTrendingSkills(skills);

        // TODO: Fetch wallet balance
        // For now, we'll use a placeholder value
        setWalletBalance(1000);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, userRole]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          {userRole === "freelancer" ? "Freelancer Dashboard" : "Client Dashboard"}
        </h2>

        {/* Welcome Section */}
        <section className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4">
            Welcome back, {userData?.fullName || currentUser?.displayName || "User"}!
          </h3>
          <div className="flex flex-col md:flex-row justify-around items-center gap-4">
            <div className="flex justify-around w-full md:w-auto">
              {userRole === "freelancer" ? (
                <>
                  <div className="text-center mx-4">
                    <p className="text-3xl font-bold">{userStats?.completedJobs || 0}</p>
                    <p className="text-sm">Completed Jobs</p>
                  </div>
                  <div className="text-center mx-4">
                    <p className="text-3xl font-bold">${userStats?.earnings || 0}</p>
                    <p className="text-sm">Total Earnings</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mx-4">
                    <p className="text-3xl font-bold">{userStats?.postedJobs || 0}</p>
                    <p className="text-sm">Posted Jobs</p>
                  </div>
                  <div className="text-center mx-4">
                    <p className="text-3xl font-bold">{userStats?.activeContracts || 0}</p>
                    <p className="text-sm">Active Contracts</p>
                  </div>
                </>
              )}
            </div>
            <div className="w-full md:w-auto">
              <WalletBalance balance={walletBalance} />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {userRole === "freelancer" ? (
              <>
                <QuickActionCard to="/jobs" title="Browse Jobs" icon={<FaSearch />} />
                <QuickActionCard to="/proposals" title="My Proposals" icon={<FaFileAlt />} />
                <QuickActionCard to="/messages" title="Messages" icon={<FaComments />} />
                <QuickActionCard to="/profile" title="Update Profile" icon={<FaUserCircle />} />
                <QuickActionCard to="/kyc" title="KYC Verification" icon={<FaIdCard />} />
              </>
            ) : (
              <>
                <QuickActionCard to="/post-job" title="Post a Job" icon={<FaPencilAlt />} />
                <QuickActionCard to="/my-jobs" title="My Jobs" icon={<FaChartBar />} />
                <QuickActionCard to="/messages" title="Messages" icon={<FaComments />} />
                <QuickActionCard to="/find-freelancers" title="Find Freelancers" icon={<FaSearch />} />
                <QuickActionCard to="/kyc" title="KYC Verification" icon={<FaIdCard />} />
              </>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-2">
            {recentActivity.map((activity, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{activity.text}</span>
                <span className="text-sm text-gray-300">
                  {new Date(activity.timestamp.seconds * 1000).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Trending Skills */}
        <section className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-2xl font-semibold mb-4">Trending Skills</h3>
          <div className="flex flex-wrap gap-2">
            {trendingSkills.map((skill, index) => (
              <span key={index} className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const QuickActionCard = ({ to, title, icon }) => (
  <Link
    to={to}
    className="bg-white bg-opacity-20 backdrop-blur-lg text-white p-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-opacity-30 transition-all duration-300 flex flex-col items-center text-center"
  >
    <span className="text-3xl mb-2">{icon}</span>
    <h4 className="text-lg font-semibold">{title}</h4>
  </Link>
);

export default HomePage;