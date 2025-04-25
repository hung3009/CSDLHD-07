// components/HeaderWithNotifications.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Props {
  notifications: Notification[];
}

const HeaderWithNotifications: React.FC<Props> = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-gray-900 text-white p-4 flex justify-between items-center relative">
      <h1 className="text-xl font-bold">My App</h1>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="relative flex items-center space-x-2 hover:bg-gray-800 px-3 py-2 rounded"
        >
          <Bell className="w-5 h-5" />
          <span>Notifications</span>

          {notifications.some((n) => !n.is_read) && (
            <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2" />
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white text-black shadow-lg rounded-md z-50">
            <div className="p-3 font-bold border-b">Notifications</div>
            <ul className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="p-3 text-sm text-gray-600">No notifications</li>
              ) : (
                notifications.map((noti) => (
                  <li
                    key={noti.id}
                    className={`p-3 text-sm border-b ${
                      noti.is_read ? 'bg-gray-100' : 'bg-yellow-50'
                    }`}
                  >
                    <div>{noti.message}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(noti.created_at).toLocaleString()}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderWithNotifications;
