import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Divider } from 'antd';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import '../components/ResultScreen.css';

const { Title, Text } = Typography;
const ResultScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobTitle, experienceRequired, questions, scoresAndFeedback } = location.state || {};
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      {/* Main Content Card */}
      <Card
        className="w-full max-w-2xl p-8 shadow-xl rounded-lg bg-opacity-20 backdrop-blur-lg relative print-only"
        bodyStyle={{ padding: '24px' }}
        style={{
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <Title level={3} style={{ color: 'black', textShadow: '0 0 5px rgba(255, 255, 255, 0.8)' }}>
            {jobTitle || 'AI Interview Results'}
          </Title>
          <Button 
           className='nma'
            type="text" 
            icon={<CloseOutlined style={{ color: 'rgba(255, 85, 85, 0.8)', fontSize: '1.2rem' }} />} 
            style={{ transition: 'color 0.3s' }}
            onClick={() => navigate('/')} // Navigate back to the previous page
            onMouseEnter={(e) => e.target.style.color = '#ff5555'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 85, 85, 0.8)'}
          />
        </div>

        {/* Experience Required */}
        <Text strong style={{ fontSize: '1.1rem', color: 'black' }}>Experience Required: </Text>
        <Text style={{ fontSize: '1.1rem', color: 'black' }}>{experienceRequired || 'Not Specified'}</Text>
        
        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />

        {/* Questions and Feedback */}
        {questions?.map((question, index) => {
          const questionKey = `Question ${index + 1}`;
          const feedback = scoresAndFeedback[questionKey] || {};

          const borderColor = feedback.Color;
          const backgroundColor = 'rgba(255, 255, 255, 0.1)';

          return (
            <div
              key={index}
              className="mb-6 p-4 rounded-lg transform transition duration-300 hover:scale-105"
              style={{
                border: `2px solid ${borderColor}`,
                backgroundColor: backgroundColor,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Text strong style={{ fontSize: '1.1rem', color: 'black' }}>{questionKey}:</Text>
             
              <p style={{ margin: '0.5rem 0', color: 'darkgray' }}>{question?.question || 'No question text'}</p>
              <p>
  <Text strong style={{ color: 'Black' }}>Your Answer: </Text>
  <div style={{ 
    color: 'black', 
    whiteSpace: 'normal', // Allow text to wrap onto new lines
    overflowWrap: 'break-word', // Break long words if necessary
    maxWidth: '100%', // Set a maximum width
  }}>
    {feedback.Youranswer || 'No Answer provided.'}
  </div>
</p>

              <Text strong style={{ color: "black" }}>Score: </Text>
              <Text style={{ color: feedback.Color }}>{feedback.score }</Text>
              
              <p>
                <Text strong style={{ color: 'Black' }}>Feedback: </Text>
                <span style={{ color: 'Black' }}>{feedback.feedback || 'No feedback provided.'}</span>
              </p>
            </div>
          );
        })}

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />

        {/* Print Button */}
        <Button
          className='nma'
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
          style={{
            width: '100%',
            height: '45px',
            fontSize: '1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #5e60ce, #6930c3)',
            border: 'none',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }}
        >
          Print Results
        </Button>
      </Card>
    </div>
  );
};

export default ResultScreen;
