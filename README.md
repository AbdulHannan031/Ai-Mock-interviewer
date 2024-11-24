AI Mock Interviewer Web
This project is an AI-powered mock interview platform built using React. It includes features like login, signup, mock interview creation, AI-generated questions, voice-to-text conversion using Whisper, and real-time result generation based on user answers. The platform is live and accessible at https://aimockinterview.netlify.app/.

Features
User Authentication: Secure login and signup functionality.
Mock Interview Creation: Users can create mock interviews tailored to specific job roles.
AI-Generated Questions: Automatically generated interview questions based on user preferences and job roles.
Voice-to-Text Conversion: Utilizes OpenAI's Whisper model for converting spoken answers to text.
Answer Analysis and Results: Real-time evaluation of user answers to provide detailed results and feedback.
Live Testing: Test the platform live at AI Mock Interviewer.
Available Scripts
In the project directory, you can run:

npm start
Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

npm run build
Builds the app for production to the build folder.
It optimizes the build for the best performance, making it ready for deployment.

Deployment
This project is deployed using Netlify.
Live at: https://aimockinterview.netlify.app/.

To deploy your own version:

Build the project using:
bash
Copy code
npm run build
Upload the build folder to your preferred hosting service (e.g., Netlify or Vercel).
Learn More
To dive deeper into the technologies used in this project:

React: React Documentation
Whisper: OpenAI Whisper Documentation
Project Workflow
1. User Journey
Signup/Login: Users create an account or log in to access features.
Interview Setup: Users specify job roles or areas of interest to generate interview questions.
Interview Process:
AI Question Generation: Questions tailored to the job role are displayed.
Voice Answer Recording: Users respond verbally, with Whisper converting speech to text.
Results and Feedback: Performance is evaluated and presented to the user.
2. Tech Stack
Frontend: React, Tailwind CSS
Backend: Node.js (API integration)
AI Models: OpenAI for question generation, Whisper for voice-to-text
Deployment: Netlify
Live Demo
Experience the app live at:
https://aimockinterview.netlify.app/

Contributing
If you'd like to contribute:

Fork the repository.
Create a new branch.
Make your changes and commit them.
Push the branch and create a pull request.
License
This project is licensed under the MIT License.

