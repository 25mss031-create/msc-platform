import api from './api';

const courseService = {
  async getSemesters() {
    const res = await api.get('/courses/semesters');
    return res.data;
  },
  async getCourses(semesterId) {
    const res = await api.get(`/courses/semesters/${semesterId}/courses`);
    return res.data;
  },
  async getCourseDetail(courseId) {
    const res = await api.get(`/courses/courses/${courseId}`);
    return res.data;
  },
  async getLesson(lessonId) {
    const res = await api.get(`/courses/lessons/${lessonId}`);
    return res.data;
  },
  async completeLesson(courseId, lessonId) {
    const res = await api.post('/progress/lessons/complete', { course_id: courseId, lesson_id: lessonId });
    return res.data;
  },
  async getCourseProgress(courseId) {
    const res = await api.get(`/progress/courses/${courseId}`);
    return res.data;
  },
  async getProgressOverview() {
    const res = await api.get('/progress/overview');
    return res.data;
  },
  async getUnlockedSkills() {
    const res = await api.get('/progress/unlocked-skills');
    return res.data;
  },
};

export default courseService;
