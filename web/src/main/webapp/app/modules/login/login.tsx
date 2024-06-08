// import React, { useState, useEffect } from 'react';
// import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import './login.scss';
// import { useAppDispatch, useAppSelector } from 'app/config/store';
// import { login } from 'app/shared/reducers/authentication';
// import LoginModal from './login-modal';
// // import {
// //   MDBBtn,
// //   MDBContainer,
// //   MDBRow,
// //   MDBCol,
// //   MDBInput
// // }
// // from 'mdb-react-ui-kit';

// import { MDBContainer, MDBCard, MDBRow, MDBCol, MDBCardImage, MDBCardBody, MDBIcon, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
// // import { useAppSelector } from 'app/config/store';

// export const Login = () => {
//   const dispatch = useAppDispatch();
//   const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
//   const loginError = useAppSelector(state => state.authentication.loginError);
//   const showModalLogin = useAppSelector(state => state.authentication.showModalLogin);
//   const [showModal, setShowModal] = useState(showModalLogin);
//   const navigate = useNavigate();
//   const pageLocation = useLocation();

//   useEffect(() => {
//     setShowModal(true);
//   }, []);

//   const handleLogin = (username, password, rememberMe = false) => dispatch(login(username, password, rememberMe));

//   const handleClose = () => {
//     setShowModal(false);
//     navigate('/');
//   };

//   const { from } = pageLocation.state || { from: { pathname: '/', search: pageLocation.search } };
//   if (isAuthenticated) {
//     return <Navigate to={from} replace />;
//   }
//   // return <LoginModal showModal={showModal} handleLogin={handleLogin} handleClose={handleClose} loginError={loginError} />;
//   return (
//     <div className="home">
//       {/* Your existing background image */}
//       <img src="/content/images/background.jpg" className="img-fluid w-100 h-100 background-image" alt="Responsive image" />

//       <div className="d-flex align-items-center justify-content-center mt-4 mb-4 login-card">
//         {/* <MDBContainer className="mt-4 mb-4 p-4"> */}
//           <MDBCard className="" style={{ height: '600px', marginTop: '20px' }}>
//             <MDBRow className='g-0'>
//               <MDBCol md='6'>
//                 <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp' alt="login form" className='rounded-start w-100' style={{ height: '600px' }} />
//               </MDBCol>
//               <MDBCol md='6'>
//                 <MDBCardBody className='d-flex flex-column'>
//                   <div className='d-flex flex-row mt-2'>
//                     <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
//                     <span className="h1 fw-bold mb-0">Logo</span>
//                   </div>
//                   <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Sign into your account</h5>
//                   <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" />
//                   <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" />
//                   <MDBBtn className="mb-4 px-5" color='dark' size='lg'>Login</MDBBtn>
//                   <a className="small text-muted" href="#!">Forgot password?</a>
//                   <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Don't have an account? <a href="#!" style={{ color: '#393f81' }}>Register here</a></p>
//                   <div className='d-flex flex-row justify-content-start'>
//                     <a href="#!" className="small text-muted me-1">Terms of use.</a>
//                     <a href="#!" className="small text-muted">Privacy policy</a>
//                   </div>
//                 </MDBCardBody>
//               </MDBCol>
//             </MDBRow>
//           </MDBCard>
//         {/* </MDBContainer> */}
//       </div>
//     </div>
//   );

// };

// export default Login;

import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import './login.scss';
import { Translate, translate, ValidatedField } from 'react-jhipster';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login } from 'app/shared/reducers/authentication';
import { Alert } from 'reactstrap';

// Remove import for LoginModal
// import LoginModal from './login-modal';

import { MDBContainer, MDBCard, MDBRow, MDBCol, MDBCardImage, MDBCardBody, MDBIcon, MDBInput, MDBBtn } from 'mdb-react-ui-kit';

export const Login = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loginError = useAppSelector(state => state.authentication.loginError);
  const showModalLogin = useAppSelector(state => state.authentication.showModalLogin);
  const [showModal, setShowModal] = useState(showModalLogin);
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleLogin = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    username: string,
    password: string,
    rememberMe = false,
  ) => {
    e.preventDefault(); // Prevent the default behavior of the anchor element if used as a link
    dispatch(login(username, password, rememberMe));
    if (username !== '' && password !== '') {
      // setShowModal(false);
      setShowModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/');
  };

  const { from } = pageLocation.state || { from: { pathname: '/', search: pageLocation.search } };
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="home">
      {/* Your existing background image */}
      <img src="/content/images/background.jpg" className="img-fluid w-100 h-100 background-image" alt="Responsive image" />

      {showModal && (
        <div className="d-flex align-items-center justify-content-center mt-4 mb-4 login-card">
          <MDBCard className="" style={{ height: '550px', marginTop: '20px' }}>
            <MDBRow className="g-0">
              {/* <MDBCol md="6">
                <div style={{ height: '600px', width: '500px', marginRight: '50px' }}>
                  <MDBCardImage
                    src="/content/images/skin.jpeg"
                    alt="login form"
                    className="rounded-start w-100"
                    style={{ height: '600px' }}
                  />
                </div>
              </MDBCol> */}
              <MDBCol style={{ width: '620px' }}>
                <MDBCardBody className="d-flex flex-column">
                  <div className="d-flex flex-row mt-2">
                    <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
                    <span className="h1 fw-bold mb-0"></span>
                  </div>
                  <center>
                    <img src="content/images/icon-app.png" alt="Logo" style={{ height: '150px', width: '150px' }} />
                    <h5 className="fw-normal my-4 pb-3">Sign into your account</h5>
                  </center>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="username"
                    id="formControlLg"
                    type="text"
                    size="lg"
                    value={username} // Set the value of the input
                    onChange={e => setUsername(e.target.value)} // Handle input change
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Password"
                    id="formControlLg"
                    type="password"
                    size="lg"
                    value={password} // Set the value of the input
                    onChange={e => setPassword(e.target.value)} // Handle input change
                  />
                  <MDBBtn className="mb-4 px-5" color="dark" size="lg" onClick={e => handleLogin(e, username, password)}>
                    Login
                  </MDBBtn>
                  <a className="small text-muted" href="/account/reset/request">
                    Forgot password?
                  </a>
                  {/* <Alert color="warning">
                    <Link to="/account/reset/request" data-cy="forgetYourPasswordSelector">
                      <Translate contentKey="login.password.forgot">Did you forget your password?</Translate>
                    </Link>
                  </Alert> */}
                  {/* <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Don't have an account? <a href="#!" style={{ color: '#393f81' }}>Register here</a></p> */}
                  <div className="d-flex flex-row justify-content-start">
                    <a href="#!" className="small text-muted me-1">
                      Terms of use.
                    </a>
                    <a href="#!" className="small text-muted">
                      Privacy policy
                    </a>
                  </div>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </div>
      )}
    </div>
  );
};

export default Login;
