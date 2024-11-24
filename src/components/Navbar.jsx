import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { Modal, Button, Input, Form, Dropdown, Menu, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.png';
import db, { auth } from '../lib/firebase';
import { useLocalContext } from '../context/context';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import '../components/Navbar.css';

const Navbar = ({ toggleSidebar, refreshInterviews }) => { 
  const { user, setUser } = useLocalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, [setUser]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Toggle modal visibility
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Dropdown menu for avatar
  const menu = (
    <Menu>
      <Menu.Item key="logout">
        <Button type="text" onClick={handleLogout} className="w-full text-left">
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  // Handle form submission to Firestore
  const handleFormSubmit = async (values) => {
    if (!user) return;
    const { jobTitle, experience } = values;

    setLoading(true); // Start loading before save operation
    try {
      const userEmail = user.email;
      const newInterviewDoc = doc(db, `userinterviews/${userEmail.replace('.', '_')}interviews${Date.now()}`);

      await setDoc(newInterviewDoc, {
        jobTitle,
        experience,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      message.success('Interview details saved successfully!');

      setIsModalOpen(false);

      refreshInterviews();
      
    } catch (error) {
      console.error('Error saving interview details:', error);
      message.error('Failed to save interview details.');
    } finally {
      setLoading(false); // Stop loading after save operation completes
    }
  };

  return (
    <div className="w-full fixed top-0 z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-4 py-3 sm:px-6">
        {/* Logo and Hamburger Icon */}
        <div className="flex items-center gap-4">
          <FaBars
            className="text-2xl text-black cursor-pointer"
            onClick={toggleSidebar}
          />
          <img src={logo} className="h-10" alt="Logo" />
        </div>

        {/* Menu Section */}
        <div className="flex items-center gap-8">
          <Button type="primary" className="bg-blue-500 hello" onClick={showModal} style={{background: 'hsl(283.3, 100%, 56.1%)', border:'none'}}>
            + Mock Interview
          </Button>
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <img
              src={user?.photoURL || avatar}
              className="h-10 w-10 rounded-full cursor-pointer"
              alt="Avatar"
            />
          </Dropdown>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center">
            <CloseOutlined
              className="absolute top-4 right-4 text-2xl cursor-pointer"
              onClick={toggleMenu}
            />
            <Button type="primary" className="mb-4 bg-blue-500" onClick={showModal}>
              + Mock Interview
            </Button>
            <Button type="text" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Modal for Mock Interview */}
      <Modal
        title="Mock Interview Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Job Title"
            name="jobTitle"
            rules={[{ required: true, message: 'Please enter the job title' }]}
          >
            <Input placeholder="Enter job title" />
          </Form.Item>
          <Form.Item
            label="Experience Required"
            name="experience"
            rules={[ 
              { required: true, message: 'Please enter required experience' },
              { pattern: /^\d+$/, message: 'Please enter a valid integer' },
            ]}
          >
            <Input placeholder="Enter experience (e.g., 3)" />
          </Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}> {/* Disable and show loading */}
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Navbar;
