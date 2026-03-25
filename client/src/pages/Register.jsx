import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiUserPlus } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      const user = await register(userData);
      switch (user.role) {
        case 'vendor': navigate('/vendor'); break;
        case 'delivery_agent': navigate('/delivery'); break;
        default: navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🐯</span>
          <h1>Join TAIGA</h1>
          <p>Create your account to get started</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><FiUser /> Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label><FiMail /> Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label><FiPhone /> Phone (optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />
          </div>
          <div className="form-group">
            <label>Select Role</label>
            <div className="role-selector">
              {[
                { value: 'customer', label: '🛒 Customer', desc: 'Browse & buy products' },
                { value: 'vendor', label: '🏪 Vendor', desc: 'Sell your products' },
                { value: 'delivery_agent', label: '🚚 Delivery Agent', desc: 'Deliver orders' }
              ].map((role) => (
                <label
                  key={role.value}
                  className={`role-option ${formData.role === role.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleChange}
                  />
                  <span className="role-label">{role.label}</span>
                  <span className="role-desc">{role.desc}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label><FiLock /> Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label><FiLock /> Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : <><FiUserPlus /> Create Account</>}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
