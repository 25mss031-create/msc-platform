import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';

export default function DashboardPage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    courseService.getProgressOverview().then(setOverview).catch(() => {});
    courseService.getUnlockedSkills().then((data) => setSkills(data.unlocked_skills || [])).catch(() => {});
  }, []);

  const overallProgress = overview.length
    ? Math.round(overview.reduce((a, c) => a + c.progress_pct, 0) / overview.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-400 mb-8">Semester {user?.current_semester} — M.Sc. Software Systems</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Overall Progress</p>
            <p className="text-4xl font-bold text-white mt-2">{overallProgress}%</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Courses</p>
            <p className="text-4xl font-bold text-white mt-2">{overview.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Skills Unlocked</p>
            <p className="text-4xl font-bold text-white mt-2">{skills.length}</p>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">Unlocked Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-green-900/40 text-green-400 border border-green-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Course Progress</h2>
          <div className="space-y-4">
            {overview.map((c) => (
              <Link key={c.course_id} to={`/courses/${c.course_id}`} className="block bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-medium">{c.course_name}</h3>
                  <span className="text-gray-400 text-sm">{c.completed_lessons}/{c.total_lessons} lessons</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 rounded-full h-2 transition-all" style={{ width: `${c.progress_pct}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
