import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../services/courseService';

const semesterColors = ['#4ECDC4', '#FF6B35', '#45B7D1', '#96CEB4'];

export default function CoursesPage() {
  const [semesters, setSemesters] = useState([]);
  const [coursesBySemester, setCoursesBySemester] = useState({});
  const [activeSemester, setActiveSemester] = useState(1);

  useEffect(() => {
    courseService.getSemesters().then((data) => {
      setSemesters(data);
      data.forEach((s) => {
        courseService.getCourses(s.id).then((courses) => {
          setCoursesBySemester((prev) => ({ ...prev, [s.id]: courses }));
        });
      });
    });
  }, []);

  const activeCourses = coursesBySemester[activeSemester] || [];

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Courses</h1>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {semesters.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSemester(s.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeSemester === s.id ? 'text-white shadow-lg' : 'text-gray-400 bg-gray-800 hover:bg-gray-700'
              }`}
              style={activeSemester === s.id ? { backgroundColor: semesterColors[i % semesterColors.length] } : {}}>
              {s.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCourses.map((course, i) => (
            <Link key={course.id} to={`/courses/${course.id}`}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
                style={{ backgroundColor: `${semesterColors[(activeSemester - 1) % semesterColors.length]}20` }}>
                <span style={{ color: semesterColors[(activeSemester - 1) % semesterColors.length] }}>
                  {course.icon || '📘'}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">{course.name}</h3>
              {course.code && <p className="text-gray-500 text-sm mb-2">{course.code}</p>}
              <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-gray-500 text-xs">{course.credits} Credits</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
