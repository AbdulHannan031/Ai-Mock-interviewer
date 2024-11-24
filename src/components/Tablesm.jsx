import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Typography, Skeleton } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import db from '../lib/firebase';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const PastReports = () => {
  const [pastReports, setPastReports] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch past reports from Firestore
  const fetchPastReports = async () => {
    setLoading(true); // Set loading to true when starting fetch
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const reportsRef = collection(db, "users", userId, "testResults");
      const snapshot = await getDocs(reportsRef);
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPastReports(reports);
    }
    setLoading(false); // Set loading to false once fetch is complete
  };

  useEffect(() => {
    fetchPastReports();
  }, []);

  const handleView = (record) => {
    const { jobTitle, experienceRequired, questions, results } = record;
    navigate('/result', {
      state: {
        jobTitle,
        experienceRequired,
        questions,
        scoresAndFeedback: JSON.parse(results),
      },
    });
  };

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const reportRef = doc(db, "users", userId, "testResults", id);
      await deleteDoc(reportRef);
      setPastReports(pastReports.filter(report => report.id !== id));
      console.log(`Deleted report with ID: ${id}`);
    }
  };

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
    {
      title: 'Experience Required',
      dataIndex: 'experienceRequired',
      key: 'experienceRequired',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => {
        if (date && typeof date === 'object' && date.toDate) {
          return date.toDate().toLocaleDateString();
        } else if (typeof date === 'string') {
          const parsedDate = new Date(date);
          return isNaN(parsedDate) ? 'Invalid Date' : parsedDate.toLocaleDateString();
        }
        return 'No Date Provided';
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)} 
            style={{ marginRight: '8px' }}
          />
          <Popconfirm
            title="Are you sure to delete this report?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={3}>Past Reports</Title>
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} /> // Show skeleton when loading is true
      ) : (
        <Table
          dataSource={pastReports}
          columns={columns}
          rowKey="id"
          pagination={false} // Remove pagination for simplicity; enable if needed
        />
      )}
    </div>
  );
};

export default PastReports;
