import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import courseService from '../services/courseService';

export default function LessonPage() {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    courseService.getLesson(lessonId).then(setLesson);
  }, [lessonId]);

  const handleComplete = async () => {
    try {
      await courseService.completeLesson(Number(courseId), Number(lessonId));
      toast.success('Lesson completed!');
    } catch (err) {
      toast.error('Failed to mark as complete');
    }
  };

  if (!lesson) return <div className="min-h-screen bg-gray-900 pt-20 px-4 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to={`/courses/${courseId}`} className="text-blue-400 hover:underline text-sm mb-4 inline-block">&larr; Back to Course</Link>
        <h1 className="text-3xl font-bold text-white mb-4">{lesson.title}</h1>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content?.replace(/\n/g, '<br/>') }} />
        </div>
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h3 className="text-white font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              {lesson.resources.map((r, i) => (
                <li key={i} className="text-blue-400 hover:underline">
                  <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title || r.url}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={handleComplete} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
          Mark as Complete
        </button>
      </div>
    </div>
  );
}
