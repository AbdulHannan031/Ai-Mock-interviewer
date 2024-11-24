import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography, Tooltip, Modal, Spin } from 'antd';
import { AudioOutlined, SoundOutlined, CloseOutlined } from '@ant-design/icons'; // Import Close Icon
import { getGeminiResponse } from '../lib/gemni';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import db, { auth } from '../lib/firebase';

const { Text } = Typography;

const TestScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const questions = location.state?.questions || [];
  const jobTitle = location.state?.JobTitle || "Unknown Job Title";
  const experienceRequired = location.state?.experienceRequired || "N/A";
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [results, setResults] = useState({});
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  useEffect(() => {
    if (!questions.length) {
      navigate('/');
    }

    const initCameraAndMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        Modal.confirm({
          title: 'Permissions Required',
          content: 'You must grant camera and microphone permissions to start the test.',
          okText: 'Try Again',
          cancelText: 'Exit Test',
          onOk: initCameraAndMic,
          onCancel: () => navigate('/'),
        });
      }
    };

    initCameraAndMic();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [questions, navigate]);

  const handleClose = () => {
    navigate('/'); // Navigate back to the homepage or any specified route
  };

  const handleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const transcription = await uploadAudio(audioBlob);

        const updatedResults = {
          ...results,
          [`Question ${questionIndex + 1}`]: {
            question: questions[questionIndex]?.question,
            answer: transcription,
          },
        };
        setResults(updatedResults);
        setIsLoading(false);

        if (questionIndex === questions.length - 1) {
          setIsLastQuestion(true); 
        } else {
          goToNextQuestion();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.mp3');

    try {
      const response = await fetch('https://hannan.pythonanywhere.com/transcribe', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      return response.ok ? result.transcription : '';
    } catch (error) {
      console.error('Error uploading audio:', error);
      return '';
    }
  };

  const speakQuestion = () => {
    const questionText = questions[questionIndex]?.question || '';
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(questionText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in this browser.");
    }
  };

  const goToNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleGetResults = async () => {
    setIsLoading(true);
    const prompt = Object.entries(results)
      .map(([key, value]) => `Question ${key.split(' ')[1]}: ${value.question}\nYour answer: ${value.answer}`)
      .join('\n');

    const requestData = `Please evaluate the following responses, providing a detailed JSON object that includes the scores out of 10, feedback, and a suggested color coding for each response and be lenient. The format should be as follows:

    {
      "Question 1": {
        "Youranswer":<user answer>,
        "score": <score>,
        "feedback": "<feedback>",
        "Color": "<color>"
      }
    }

    Responses to evaluate:
    ${prompt}`;

    try {
      const response = await getGeminiResponse(requestData);
      const scoresAndFeedback = await response.text();

      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const testResultRef = doc(collection(db, "users", userId, "testResults"));
        await setDoc(testResultRef, {
          questions: questions,
          results: scoresAndFeedback,
          jobTitle,
          experienceRequired,
          date: new Date(),
          timestamp: serverTimestamp(),
        });
      }
      setIsLoading(false);
      navigate('/result', {
        state: {
          jobTitle,
          experienceRequired,
          questions,
          scoresAndFeedback: JSON.parse(scoresAndFeedback)
        }
      });
      
    } catch (error) {
      console.error('Error getting results:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 p-6">
      <div className="md:w-1/2 flex flex-col bg-white rounded-lg shadow-lg p-6 relative">
        <CloseOutlined
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 cursor-pointer text-lg"
        />
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold">Question {questionIndex + 1}</h2>
          <Tooltip title="Click to listen">
            <SoundOutlined onClick={speakQuestion} className="ml-2 text-blue-500 cursor-pointer text-2xl" />
          </Tooltip>
        </div>
        <p className="text-lg text-gray-700 mb-6">
          {questions[questionIndex]?.question || 'Loading question...'}
        </p>

        <div className="p-4 bg-blue-50 rounded-lg text-blue-700 mb-6">
          <Text strong>Note:</Text>
          <p>Click on Record Answer when you want to answer the question. At the end of the interview, we will give you feedback along with the correct answer for each question and your answer to compare it.</p>
        </div>
      </div>

      <div className="md:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md h-64 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex space-x-4">
          <Button
            type="primary"
            onClick={handleRecording}
            icon={<AudioOutlined />}
            className={`mt-4 px-6 py-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
            disabled={isLastQuestion}
          >
            {isRecording ? 'Stop Recording' : 'Record Answer'}
          </Button>

          {isLastQuestion && (
            <Button
              type="default"
              onClick={handleGetResults}
              className="mt-4 px-6 py-2 rounded-full bg-green-500 text-white"
            >
              Get Results
            </Button>
          )}
        </div>

        {isLoading && <Spin className="mt-4" />}
      </div>
    </div>
  );
};

export default TestScreen;    