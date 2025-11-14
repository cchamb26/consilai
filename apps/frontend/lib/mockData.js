export const mockStudents = [

  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@school.com',
    grade: 'Grade 10',
    issues: ['Difficulty with problem-solving', 'Low participation in group work'],
    strengths: ['Strong in mathematics', 'Creative thinking', 'Leadership skills'],
    goals: ['Improve collaboration skills', 'Build confidence in presentations'],
    avatar: '👨‍🎓',
    seatPosition: { x: 0, y: 0 },
  },
  {
    id: '2',
    name: 'Sophia Chen',
    email: 'sophia.chen@school.com',
    grade: 'Grade 10',
    issues: ['Anxiety during tests', 'Difficulty with reading comprehension'],
    strengths: ['Artistic talent', 'Good time management', 'Peer mentor'],
    goals: ['Build test-taking confidence', 'Expand vocabulary'],
    avatar: '👩‍🎓',
    seatPosition: { x: 1, y: 0 },
  },
  {
    id: '3',
    name: 'Marcus Brown',
    email: 'marcus.brown@school.com',
    grade: 'Grade 10',
    issues: ['Disruptive behavior', 'Missing assignments'],
    strengths: ['Athletic abilities', 'Quick learner', 'Sense of humor'],
    goals: ['Improve responsibility', 'Stay organized'],
    avatar: '👨‍🦱',
    seatPosition: { x: 2, y: 0 },
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@school.com',
    grade: 'Grade 10',
    issues: ['Perfectionism anxiety', 'Over-commitment'],
    strengths: ['Excellent writing', 'Research skills', 'Attention to detail'],
    goals: ['Learn work-life balance', 'Accept constructive criticism'],
    avatar: '👩‍🦱',
    seatPosition: { x: 3, y: 0 },
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.wilson@school.com',
    grade: 'Grade 10',
    issues: ['Poor note-taking', 'Struggles with focus'],
    strengths: ['Musical talent', 'Collaborative', 'Problem solver'],
    goals: ['Develop study strategies', 'Improve concentration'],
    avatar: '👨‍💼',
    seatPosition: { x: 0, y: 1 },
  },
];

export const mockResearchInsights = [
  {
    id: '1',
    title: 'The Impact of Peer Support on Student Performance',
    fileName: 'peer-support-study.pdf',
    uploadDate: '2024-11-10',
    summary: 'Research shows that peer support networks increase academic performance by 23% on average.',
    relevantTopics: ['Collaboration', 'Social Learning', 'Student Engagement'],
    keyFindings: [
      'Peer mentoring improves retention rates',
      'Group study sessions boost comprehension',
      'Collaborative learning builds confidence',
    ],
  },
  {
    id: '2',
    title: 'Adaptive Learning Strategies for Diverse Learners',
    fileName: 'adaptive-learning.pdf',
    uploadDate: '2024-11-08',
    summary: 'Personalized learning approaches show 35% improvement in student outcomes.',
    relevantTopics: ['Differentiation', 'Personalization', 'Learning Styles'],
    keyFindings: [
      'Multi-modal instruction benefits all learners',
      'Real-time feedback improves engagement',
      'Flexible pacing reduces anxiety',
    ],
  },
];

export const mockPlans = [
  {
    id: '1',
    studentId: '1',
    title: 'Leadership Development Plan',
    objectives: 'Build team collaboration and public speaking skills',
    startDate: '2024-11-15',
    endDate: '2025-02-15',
    status: 'Active',
    milestones: [
      'Lead one class discussion',
      'Present project to class',
      'Mentor a junior student',
    ],
  },
];

export const mockDesks = Array.from({ length: 16 }, (_, index) => ({
  id: `desk-${index + 1}`,
  position: { x: index % 4, y: Math.floor(index / 4) },
  student: mockStudents[index] || null,
  available: !mockStudents[index],
}));

