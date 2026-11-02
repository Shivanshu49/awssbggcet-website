import { ComboboxOption } from '@/components/registration/SearchableCombobox';

// ─── Academic Years ──────────────────────────────────────────────────────────
export const ACADEMIC_YEAR_OPTIONS: ComboboxOption[] = [
  { value: '1st Year', label: '1st Year (Freshman / 1st-2nd Sem)' },
  { value: '2nd Year', label: '2nd Year (Sophomore / 3rd-4th Sem)' },
  { value: '3rd Year', label: '3rd Year (Junior / 5th-6th Sem)' },
  { value: '4th Year', label: '4th Year (Senior / 7th-8th Sem)' },
  { value: 'Alumni', label: 'Alumni / Recent Graduate' },
];

// ─── Degrees / Courses ────────────────────────────────────────────────────────
export const DEGREE_OPTIONS: ComboboxOption[] = [
  // UNDERGRADUATE
  { value: 'B.Tech / B.E.', label: 'B.Tech / B.E. (Bachelor of Technology / Engineering)', category: 'Undergraduate' },
  { value: 'BCA', label: 'BCA (Bachelor of Computer Applications)', category: 'Undergraduate' },
  { value: 'B.Sc.', label: 'B.Sc. (Bachelor of Science)', category: 'Undergraduate' },
  { value: 'BBA', label: 'BBA (Bachelor of Business Administration)', category: 'Undergraduate' },
  { value: 'B.Com.', label: 'B.Com. (Bachelor of Commerce)', category: 'Undergraduate' },
  { value: 'B.Des.', label: 'B.Des. (Bachelor of Design)', category: 'Undergraduate' },
  { value: 'B.Arch.', label: 'B.Arch. (Bachelor of Architecture)', category: 'Undergraduate' },

  // POSTGRADUATE
  { value: 'M.Tech / M.E.', label: 'M.Tech / M.E. (Master of Technology / Engineering)', category: 'Postgraduate' },
  { value: 'MCA', label: 'MCA (Master of Computer Applications)', category: 'Postgraduate' },
  { value: 'M.Sc.', label: 'M.Sc. (Master of Science)', category: 'Postgraduate' },
  { value: 'MBA', label: 'MBA (Master of Business Administration)', category: 'Postgraduate' },
  { value: 'M.Com.', label: 'M.Com. (Master of Commerce)', category: 'Postgraduate' },
  { value: 'M.Des.', label: 'M.Des. (Master of Design)', category: 'Postgraduate' },
  { value: 'M.Arch.', label: 'M.Arch. (Master of Architecture)', category: 'Postgraduate' },

  // OTHER
  { value: 'Polytechnic / Diploma', label: 'Polytechnic / Diploma Engineering', category: 'Diploma & Doctorate' },
  { value: 'Ph.D.', label: 'Ph.D. (Doctor of Philosophy)', category: 'Diploma & Doctorate' },
];

// ─── Branches / Departments ──────────────────────────────────────────────────
export const BRANCH_OPTIONS: ComboboxOption[] = [
  // COMPUTER SCIENCE & ALLIED
  { value: 'Computer Science and Engineering (CSE)', label: 'Computer Science and Engineering (CSE)', category: 'Computer Science & IT' },
  { value: 'Information Technology (IT)', label: 'Information Technology (IT)', category: 'Computer Science & IT' },
  { value: 'Artificial Intelligence (AI)', label: 'Artificial Intelligence (AI)', category: 'Computer Science & IT' },
  { value: 'Artificial Intelligence and Machine Learning (AI & ML)', label: 'Artificial Intelligence and Machine Learning (AI & ML)', category: 'Computer Science & IT' },
  { value: 'Data Science', label: 'Data Science', category: 'Computer Science & IT' },
  { value: 'Artificial Intelligence and Data Science', label: 'Artificial Intelligence and Data Science', category: 'Computer Science & IT' },
  { value: 'Cyber Security', label: 'Cyber Security', category: 'Computer Science & IT' },
  { value: 'Internet of Things (IoT)', label: 'Internet of Things (IoT)', category: 'Computer Science & IT' },
  { value: 'Computer Science and Business Systems', label: 'Computer Science and Business Systems', category: 'Computer Science & IT' },
  { value: 'Computer Science and Design', label: 'Computer Science and Design', category: 'Computer Science & IT' },

  // CORE ENGINEERING
  { value: 'Mechanical Engineering', label: 'Mechanical Engineering', category: 'Core Engineering' },
  { value: 'Civil Engineering', label: 'Civil Engineering', category: 'Core Engineering' },
  { value: 'Electrical Engineering', label: 'Electrical Engineering', category: 'Core Engineering' },
  { value: 'Electrical and Electronics Engineering', label: 'Electrical and Electronics Engineering (EEE)', category: 'Core Engineering' },
  { value: 'Electronics and Communication Engineering', label: 'Electronics and Communication Engineering (ECE)', category: 'Core Engineering' },
  { value: 'Electronics Engineering', label: 'Electronics Engineering', category: 'Core Engineering' },
  { value: 'Chemical Engineering', label: 'Chemical Engineering', category: 'Core Engineering' },
  { value: 'Automobile Engineering', label: 'Automobile Engineering', category: 'Core Engineering' },
  { value: 'Aerospace Engineering', label: 'Aerospace Engineering', category: 'Core Engineering' },
  { value: 'Biotechnology', label: 'Biotechnology', category: 'Core Engineering' },
  { value: 'Biomedical Engineering', label: 'Biomedical Engineering', category: 'Core Engineering' },
  { value: 'Mechatronics Engineering', label: 'Mechatronics Engineering', category: 'Core Engineering' },
  { value: 'Robotics and Automation', label: 'Robotics and Automation', category: 'Core Engineering' },
  { value: 'Production Engineering', label: 'Production Engineering', category: 'Core Engineering' },
  { value: 'Instrumentation Engineering', label: 'Instrumentation Engineering', category: 'Core Engineering' },
  { value: 'Mining Engineering', label: 'Mining Engineering', category: 'Core Engineering' },
  { value: 'Environmental Engineering', label: 'Environmental Engineering', category: 'Core Engineering' },
  { value: 'Industrial Engineering', label: 'Industrial Engineering', category: 'Core Engineering' },
];

