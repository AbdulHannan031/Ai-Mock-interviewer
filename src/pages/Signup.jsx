import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import { message, Modal, Input, Spin } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import db, { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [verificationCodeFromEmail, setverificationCodeFromEmail] = useState(null);
  // Function to send verification email
  const sendVerificationEmail = async () => {
    try {
      const response = await fetch('https://hannan.pythonanywhere.com/send_email', { // Adjust URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: email,
          subject: 'Email Verification'
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setVerificationModalVisible(true); // Show verification modal after sending email
        return data.verification_code; // Return the verification code for local validation
      } else {
        throw new Error(data.error || "Failed to send verification email");
      }
    } catch (error) {
      message.error("Failed to send verification email: " + error.message);
      throw error;
    }
  };
  const isStrongPassword = (password) => {
    const minLength = 8; // Minimum length of password
    const hasUpperCase = /[A-Z]/.test(password); // At least one uppercase letter
    const hasLowerCase = /[a-z]/.test(password); // At least one lowercase letter
    const hasNumbers = /\d/.test(password); // At least one number
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password); // At least one special character
  
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      message.error("Please fill in all fields!");
      return;
    }
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    if (!isStrongPassword(password)) {
      message.error("Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.");
      return;
    }
    setIsLoading(true);
    try {
       var verificationCodeFromEmai = await sendVerificationEmail();
       setverificationCodeFromEmail(verificationCodeFromEmai);
       console.log(verificationCodeFromEmail)
      // You may want to store the verification code in state if needed
    } catch (error) {
      // Error handling already done in sendVerificationEmail
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    // Convert verificationCode array to a string
    const codeEntered = verificationCode.join('');
    console.log(verificationCodeFromEmail)
    // Here, you would need to compare codeEntered with the code sent to the email
    // If it matches, create the user
    if (codeEntered === verificationCodeFromEmail) {
      // Continue with Firebase user creation
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, "userdata", user.uid), {
          email: user.email,
          firstName,
          lastName,
        });

        message.success("Signup successful!");
        navigate('/');
      } catch (error) {
        message.error("Signup failed: " + error.message);
      }
    } else {
      message.error("Invalid verification code. Please try again.");
    }
  };

  const handleCodeChange = (value, index) => {
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);  // Only allow one character per box
    setVerificationCode(newCode);
    if (value && index < 3) document.getElementById(`digit-${index + 1}`).focus();
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, "userdata", user.uid), {
        email: user.email,
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ')[1] || '',
      });

      message.success("Signup with Google successful!");
      navigate('/');
    } catch (error) {
      console.error("Error signing up with Google:", error);
      message.error("Error signing up with Google: " + error.message);
    }
  };

  return (
    <MDBContainer fluid className='p-5 background-radial-gradient overflow-hidden'>
      <MDBRow>
        <MDBCol md='6' className='mb-5 text-center text-md-start d-flex flex-column justify-content-center csa'>
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
            The Best Place To <br />
            <span style={{ color: 'hsl(218, 81%, 75%)' }}>Practice Your Interviews</span>
          </h1>
          <p className='px-3' style={{ color: 'hsl(218, 81%, 85%)' }}>
            Practice, improve, and build confidence with our AI-driven mock interview platform.
          </p>
        </MDBCol>

        <MDBCol md='6' className='position-relative'>
          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
              <h1 className='mb-5' style={{ color: 'hsl(283.3, 100%, 56.1%)' }}>Signup</h1>
              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol col='6'>
                    <MDBInput wrapperClass='mb-4' label='First name' type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </MDBCol>
                  <MDBCol col='6'>
                    <MDBInput wrapperClass='mb-4' label='Last name' type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </MDBCol>
                </MDBRow>
                <MDBInput wrapperClass='mb-4' label='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <MDBInput wrapperClass='mb-4' label='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <MDBInput wrapperClass='mb-4' label='Confirm Password' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <MDBBtn className='w-100 mb-4' size='md' style={{ background: 'hsl(283.3, 100%, 56.1%)', border: 'none' }} type="submit">
                  {isLoading ? <Spin /> : "Sign Up"}
                </MDBBtn>
              </form>

              <div className="text-center">
                <p>or Signup with:</p>
                <MDBBtn 
                  tag='a' 
                  color='none' 
                  className='mx-3' 
                  style={{ color: 'hsl(283.3, 100%, 56.1%)' }} 
                  onClick={handleGoogleSignup}
                >
                  <MDBIcon fab icon='google' size="sm" />
                </MDBBtn>
              </div>

              <div className="text-center mt-3">
                <p>
                  Already have an account?{' '}
                  <Link to="/" style={{ color: 'hsl(283.3, 100%, 56.1%)', textDecoration: 'underline' }}>
                    Log In
                  </Link>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Verification Modal */}
      <Modal
        title="Verify Your Email"
        visible={verificationModalVisible}
        onOk={handleVerification}
        onCancel={() => setVerificationModalVisible(false)}
      >
        <p style={{ textAlign: 'center' }}>Please enter the 4-digit code sent to {email}:</p>
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20px 0',
          flexWrap: 'wrap'
        }}>
          {[0, 1, 2, 3].map((index) => (
            <Input
              key={index}
              id={`digit-${index}`}
              type="text"
              value={verificationCode[index]}
              onChange={(e) => handleCodeChange(e.target.value, index)}
              maxLength={1}
              style={{ width: '40px', textAlign: 'center' }}
            />
          ))}
        </div>
      </Modal>
    </MDBContainer>
  );
}

export default Signup;
