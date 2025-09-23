import MentorHome from '../MentorHome';

const mockUser = {
  id: '2',
  email: 'alex.mentor@example.com',
  firstName: 'Alex',
  lastName: 'Thompson',
  profileImageUrl: undefined
};

export default function MentorHomeExample() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return <MentorHome user={mockUser} onLogout={handleLogout} />;
}