import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm">Name</label>
              <p className="text-white text-lg">{user?.name}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <p className="text-white text-lg">{user?.email}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Current Semester</label>
              <p className="text-white text-lg">Semester {user?.current_semester}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
