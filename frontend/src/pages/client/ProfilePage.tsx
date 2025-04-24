const UserProfile = () => {
    return (
      <div className="max-w-md mx-auto mt-10 p-20 bg-white rounded-xl">
        <div className="flex flex-col items-center">
          <img
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
            src="https://i.pravatar.cc/150?img=8"
            alt="User Avatar"
          />
          <h2 className="text-xl font-semibold mt-4">Nguyễn Văn A</h2>
          <p className="text-gray-600">nguyenvana@example.com</p>
          <p className="mt-4 text-center text-sm text-gray-700">
            👋 Hi! I'm Nguyễn Văn A, a passionate frontend developer from Ho Chi Minh City. I love working with React and building clean UI with Tailwind CSS.
          </p>
          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition">
            Edit Profile
          </button>
        </div>
      </div>
    );
  };
  
  export default UserProfile;
  