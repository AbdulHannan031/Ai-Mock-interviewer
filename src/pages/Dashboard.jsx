// Dashboard.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import InterviewSection from '../components/InterviewSection';
import PastReports from '../components/Tablesm';
import db from '../lib/firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useLocalContext } from '../context/context';
import { Skeleton } from 'antd';

const Dashboard = () => {
  const { user } = useLocalContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("interviews");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchInterviews = async () => {
    if (user) {
      setLoading(true);
      try {
        const userInterviewsRef = collection(db, 'userinterviews');
        const interviewsQuery = query(userInterviewsRef, where('email', '==', user.email));
        const snapshot = await getDocs(interviewsQuery);
        const interviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInterviews(interviewsData);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteInterview = async (id) => {
    try {
      await deleteDoc(doc(db, 'userinterviews', id));
      setInterviews(interviews.filter((interview) => interview.id !== id));
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [user]);

  const refreshInterviews = () => {
    fetchInterviews();
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} refreshInterviews={refreshInterviews} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
        setActiveSection={setActiveSection} // Pass setActiveSection
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[16vw]' : 'ml-0'}`}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          activeSection === "interviews" ? (
            <InterviewSection interviews={interviews} deleteInterview={deleteInterview} />
          ) : (
            <PastReports />
          )
        )}
      </div>
    </>
  );
};

export default Dashboard;
