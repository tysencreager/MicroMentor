import MenteeHome from '../MenteeHome';

const mockUser = {
  id: '1',
  email: 'jane.doe@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  profileImageUrl: undefined
};

export default function MenteeHomeExample() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return <MenteeHome user={mockUser} onLogout={handleLogout} />;
}