import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const isLoggingInRef = useRef(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if already authenticated (but not during login process)
  useEffect(() => {
    if (isAuthenticated && !loading && !isLoggingInRef.current) {
      const redirectTo = new URLSearchParams(location.search).get('redirect') || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.search, loading]);

  // Check for success message from signup redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }

    // Real-time validation for email format
    if (name === 'email' && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        setErrors(prev => ({
          ...prev,
          email: 'Invalid email format'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          email: ''
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    isLoggingInRef.current = true;
    setErrors({});
    setSuccessMessage('');

    try {
      await login(formData.email.trim(), formData.password);
      
      // Wait for some time to show the loading.gif in the button before redirecting
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Redirect to dashboard (or the redirect parameter)
      const redirectTo = new URLSearchParams(location.search).get('redirect') || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error types
      if (error.response?.status === 401) {
        setErrors({ submit: 'Invalid email or password' });
      } else if (error.response?.status === 400) {
        const errorMessage = error.response.data?.error || 'Invalid login data';
        if (errorMessage.includes('email')) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.includes('password')) {
          setErrors({ password: errorMessage });
        } else {
          setErrors({ submit: errorMessage });
        }
      } else if (!error.response) {
        setErrors({ submit: 'Unable to connect to the server. Please check your connection.' });
      } else {
        setErrors({ submit: error.response.data?.error || 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
      // Reset the ref after a short delay to allow navigation to complete
      setTimeout(() => {
        isLoggingInRef.current = false;
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center">
      <div className="w-full flex flex-col md:flex-row">
        {/* Left Side - Football GIF */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <img 
            src="/videos/football-gif.gif" 
            alt="Football animation" 
            className="max-w-full h-auto max-h-[80vh] object-contain"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <div className="max-w-xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-river-bed mb-4">
                Login
              </h1>
              <p className="text-lg text-oslo-gray">
                Sign in to your account
              </p>
            </div>

            <Card>
              {/* Success Message from Signup */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-river-bed mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-river-bed mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  text="Sign In"
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  className="w-full text-lg md:text-xl"
                />

                {/* Signup Link */}
                <div className="text-center pt-4 border-t border-geyser">
                  <p className="text-sm text-oslo-gray">
                    Don't have an account?{' '}
                    <Link 
                      to="/signup" 
                      className="text-gulf-stream hover:underline font-medium"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

