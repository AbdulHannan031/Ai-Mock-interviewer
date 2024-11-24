import React, { useState } from 'react';
import { Card, Button, Modal, Spin } from 'antd';
import { DeleteOutlined, AudioOutlined, VideoCameraOutlined, SolutionOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getGeminiResponse } from '../lib/gemni';

const InterviewCard = ({ jobTitle, experience, createdAt, onDelete }) => {
    const formattedDate = createdAt ? new Date(createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // New state for delete confirmation
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setLoading(true);
        setIsModalVisible(false);

        const prompt = `Please generate a set of 5 interview questions that are commonly asked for the position of ${jobTitle}. The questions should be tailored for candidates with ${experience} years of experience in the field. The format of the response should be as follows:

        [
          {
            "question": "Describe your experience with different testing methodologies and how you've applied these methodologies in your previous roles.",
            "experience": 2
          },
          {
            "question": "Explain your understanding of various testing types, such as unit testing, integration testing, and acceptance testing, and how you've executed these tests in past projects.",
            "experience": 2
          },
          {
            "question": "Share your experience with test automation tools and frameworks. Which tools have you used, and where have you successfully implemented test automation?",
            "experience": 2
          },
          {
            "question": "Describe a challenging testing scenario you faced in your projects and how you approached it. What were the results of your actions?",
            "experience": 2
          },
          {
            "question": "How do you stay up-to-date with the latest testing trends and technologies? Please mention any recent advancements you've explored or implemented.",
            "experience": 2
          }
        ]
        `;
        
        try {
            const response = await getGeminiResponse(prompt);
            const questions = await response.text();
            const parsedQuestions = JSON.parse(questions);
            navigate('/test', { state: { questions: parsedQuestions, JobTitle:jobTitle,       // Replace with dynamic value as needed
                experienceRequired:experience  } });
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showDeleteConfirmation = () => {
        setIsDeleteModalVisible(true); // Show delete confirmation modal
    };

    const handleDeleteConfirm = () => {
        onDelete(); // Call the delete function
        setIsDeleteModalVisible(false); // Hide the modal
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false); // Close the delete modal without deleting
    };

    return (
        <>
            <Card
                hoverable
                style={{
                    width: 300,
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    margin: '8px',
                    position: 'relative',
                }}
                cover={
                    <img
                        alt="Interview"
                        src="./as.jpg"
                        style={{ borderRadius: '8px 8px 0 0', height: '150px', objectFit: 'cover' }}
                    />
                }
            >
                <DeleteOutlined
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: 'red',
                        cursor: 'pointer',
                    }}
                    onClick={showDeleteConfirmation} // Show delete confirmation on click
                />

                <Card.Meta title={jobTitle} style={{ marginBottom: '8px' }} />
                <p>
                    <strong>Experience Required:</strong> {experience} years
                </p>
                <p>
                    <strong>Created At:</strong> {formattedDate}
                </p>
                <Button
                    type="primary"
                    style={{ background: 'hsl(283.3, 100%, 56.1%)', border: 'none', float: 'right' }}
                    onClick={showModal}
                >
                    Start
                </Button>
            </Card>

            <Modal
                title="Test Rules"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                footer={[
                    <Button key="continue" type="primary" onClick={handleOk}>
                        Continue
                    </Button>
                ]}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <AudioOutlined style={{ fontSize: '20px', color: '#1890ff', marginRight: '8px' }} />
                    <span>Allow microphone access for audio input.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <VideoCameraOutlined style={{ fontSize: '20px', color: '#1890ff', marginRight: '8px' }} />
                    <span>Enable camera access for video monitoring.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <SolutionOutlined style={{ fontSize: '20px', color: '#1890ff', marginRight: '8px' }} />
                    <span>Answer every question and maintain a professional demeanor.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px', color: '#1890ff', marginRight: '8px' }}>⚠️</span>
                    <span>Do not reload the browser between tests.</span>
                </div>
            </Modal>

            {/* Delete confirmation modal */}
            <Modal
                title="Confirm Deletion"
                visible={isDeleteModalVisible}
                onOk={handleDeleteConfirm} // Call handleDeleteConfirm if confirmed
                onCancel={handleDeleteCancel} // Close modal on cancel
                okText="Delete"
                okButtonProps={{ danger: true }}
                cancelText="Cancel"
                centered
            >
                <p>Are you sure you want to delete this interview?</p>
            </Modal>

            {/* Loading spinner overlay */}
            {loading && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <Spin size="large" tip="Generating Questions..." />
                </div>
            )}
        </>
    );
};

export default InterviewCard;
