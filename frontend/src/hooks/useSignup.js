
import { useState } from 'react';

const useSignup = () => {
  const [loading, setLoading] = useState(false);

  const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
    console.log('📤 Frontend sending:', { fullName, username, password, confirmPassword, gender });

    const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
      });

      const data = await res.json();
      console.log('📥 Backend response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store user data in localStorage
      localStorage.setItem('chat-user', JSON.stringify(data));
      alert('Signup successful!');
      
    } catch (error) {
      console.error('❌ Signup error:', error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    alert('Please fill in all fields');
    return false;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return false;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return false;
  }

  return true;
}

export default useSignup;
