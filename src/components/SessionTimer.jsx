import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../store/slices/uiSlice';

function SessionTimer() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!user?.sessionExpires) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiresAt = new Date(user.sessionExpires).getTime();
      const diff = expiresAt - now;

      if (diff <= 0) {
        dispatch(logout());
        dispatch(showToast({ 
          message: 'Session expired. Please login again.', 
          type: 'warning' 
        }));
        navigate('/login');
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, dispatch, navigate]);

  if (!timeLeft) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isWarning = minutes < 5;

  return (
    <div className={`text-sm ${isWarning ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
      <span className="hidden md:inline">Session: </span>
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default SessionTimer;
