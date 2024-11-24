import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../pages/Login.css'; // Adjust the CSS import as needed
import { Link, useNavigate } from 'react-router-dom';
import db, { auth } from '../lib/firebase';
import { useLocalContext } from '../context/context';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { message, Modal } from 'antd'; // Import Ant Design Modal

function Login() {
  const { setUser } = useLocalContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user); // Set user in context
      message.success("Login successful!");
      navigate('/'); // Redirect after successful login
    } catch (error) {
      console.error("Error logging in: ", error);
      message.error(error.message); // Show error message
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user); // Set user in context
      message.success("Google login successful!");
      navigate('/'); // Redirect after successful login
    } catch (error) {
      console.error("Error during Google sign in: ", error);
      message.error(error.message); // Show error message
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      message.error("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      message.success("Password reset email sent!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error sending password reset email: ", error);
      message.error(error.message); // Show error message
    }
  };

  return (
    <MDBContainer fluid className='p-5 background-radial-gradient overflow-hidden'>
      <MDBRow>
        <MDBCol md='6' className='mb-5 text-center text-md-start d-flex flex-column justify-content-center'>
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
            Welcome Back! <br />
            <span style={{ color: 'hsl(218, 81%, 75%)' }}>Login to Your Account</span>
          </h1>
          <p className='px-3' style={{ color: 'hsl(218, 81%, 85%)' }}>
            Join our AI-driven mock interview platform and continue improving your skills. Login to access your tailored feedback and insights!
          </p>
        </MDBCol>

        <MDBCol md='6' className='position-relative'>
          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
              <h1 className='mb-5' style={{ color: 'hsl(283.3, 100%, 56.1%)' }}>
                Login
              </h1>
              <form onSubmit={handleEmailLogin}>
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Email' 
                  id='form1' 
                  type='email' 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Password' 
                  id='form2' 
                  type='password' 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                />

                <MDBBtn 
                  className='w-100 mb-4' 
                  size='md' 
                  style={{ background: 'hsl(283.3, 100%, 56.1%)', border: 'none' }} 
                  type="submit"
                >
                  Log In
                </MDBBtn>
              </form>

              <div className="text-center">
                <p>or login with:</p>
                <MDBBtn 
                  tag='a' 
                  color='none' 
                  className='mx-3' 
                  style={{ color: 'hsl(283.3, 100%, 56.1%)' }} 
                  onClick={handleGoogleSignIn}
                >
                  <MDBIcon fab icon='google' size="sm" />
                </MDBBtn>
              </div>

              {/* Forgot Password link */}
              <div className="text-center mt-3">
                <p><Link to="#" onClick={showModal} style={{ color: 'hsl(283.3, 100%, 56.1%)' }}>Forgot Password?</Link></p>
              </div>

              {/* Don't have an account message */}
              <div className="text-center mt-4">
                <p>Don't have an account? <Link to="/signup" style={{ color: 'hsl(283.3, 100%, 56.1%)' }}>Sign Up</Link></p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Modal for password reset */}
      <Modal
        title="Reset Password"
        visible={isModalVisible}
        onOk={handleResetPassword}
        onCancel={handleCancel}
        okText="Send Reset Email"
        cancelText="Cancel"
      >
        <p>Please enter your email address to receive a password reset link:</p>
        <MDBInput 
          label='Email' 
          id='reset-email' 
          type='email' 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
      </Modal>
    </MDBContainer>
  );
}

export default Login;
