import React from 'react';
import { Row, Col } from 'react-bootstrap';
import InterviewCard from './InterviewCard';
import { Skeleton } from 'antd'; // Import Ant Design Skeleton
import { FaClipboardList } from 'react-icons/fa'; // Importing an icon
import '../components/Navbar.css';

const InterviewSection = ({ interviews,deleteInterview  }) => {
  return (
    <div className="my-4 mt-10 sm:pt-[18vh] overflow-hidden helloa">
      <Row>
        {interviews.length === 0 ? (
          <Col className="text-center my-5"> {/* Center the message */}
            <h2 className="text-xl font-semibold text-gray-700">Let’s get started with your first mock interview!</h2>
            <p className="text-gray-500">It seems you don’t have any interviews scheduled.</p>
           
          </Col>
        ) : (
          interviews.map(interview => (
            <Col key={interview.id} sm={12} md={6} lg={4} className="mb-4">
              <InterviewCard 
                jobTitle={interview.jobTitle} 
                experience={interview.experience} 
                createdAt={interview.createdAt} 
                onDelete={() => deleteInterview(interview.id)} // Pass delete function with interview id
              />
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default InterviewSection;
