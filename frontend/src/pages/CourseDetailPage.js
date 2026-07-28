import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import courseService from '../services/courseService';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    courseService.getCourseDetail(courseId).then(setCourse);
    courseService.getCourseProgress(courseId).then(setProgress);
  }, [courseId]);

  if (!course) return <div className="min-h-screen bg-gray-900 pt-20 px-4 text-gray-400">Loading...</div>;

  const completedLessons = new Set();
  if (progress) {
    // We'd need a more detailed endpoint for per-lesson completion status
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/courses" className="text-blue-400 hover:underline text-sm mb-4 inline-block">&larr; Back to Courses</Link>
        <h1 className="text-3xl font-bold text-white mb-2">{course.name}</h1>
        {course.code && <p className="text-gray-500 mb-2">{course.code}</p>}
        <p className="text-gray-400 mb-4">{course.description}</p>
        {course.skills_unlocked && course.skills_unlocked.length > 0 && (
          <div className="mb-8">
            <p className="text-gray-300 text-sm mb-2">Skills unlocked on completion:</p>
            <div className="flex flex-wrap gap-2">
              {course.skills_unlocked.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-yellow-900/40 text-yellow-400 border border-yellow-700 rounded-full text-sm">{s}</span>
              ))}
            </div>
          </div>
        )}

        {progress && (
          <div className="mb-8 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{progress.completed_lessons}/{progress.total_lessons} lessons</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 rounded-full h-2 transition-all" style={{ width: `${progress.progress_pct}%` }} />
            </div>
          </div>
        )}

        <div className="space-y-6">
          {course.units?.map((unit) => (
            <div key={unit.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-1">{unit.title}</h2>
              <p className="text-gray-400 text-sm mb-4">{unit.description}</p>
              <div className="space-y-2">
                {unit.lessons?.map((lesson) => (
                  <Link key={lesson.id} to={`/lessons/${lesson.id}?courseId=${course.id}`}
                    className="block bg-gray-750 rounded-lg p-3 border border-gray-700 hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-200">{lesson.title}</span>
                      <span className="text-gray-500 text-xs">{lesson.duration_minutes} min</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
