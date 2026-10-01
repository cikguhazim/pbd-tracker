import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2 } from 'lucide-react';

const RecordPerformance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [standards, setStandards] = useState([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');
  const [plScore, setPlScore] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const skills = ['reading', 'writing', 'listening', 'speaking'];

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const studentsSnap = await getDocs(collection(db, 'students'));
        const studentsData = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Extract unique classes
        const uniqueClasses = [...new Set(studentsData.map(s => s.className))].filter(Boolean);
        setClasses(uniqueClasses);
        setStudents(studentsData);
        
        const standardsSnap = await getDocs(collection(db, 'learning_standards'));
        setStandards(standardsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const filteredStudents = students.filter(s => s.className === selectedClass);
  const filteredStandards = standards.filter(s => s.skill === selectedSkill);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedStandard || !plScore) return;

    setSaving(true);
    try {
      await addDoc(collection(db, 'assessments'), {
        studentId: selectedStudent,
        standardId: selectedStandard,
        skill: selectedSkill,
        pl: parseInt(plScore),
        date: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setPlScore(''); // reset score
    } catch (error) {
      console.error("Error saving assessment:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading data...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Record Performance Level</h1>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        
        {/* Class Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select 
            value={selectedClass} 
            onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudent(''); }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a class...</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Student Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
          <select 
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={!selectedClass}
          >
            <option value="">Select a student...</option>
            {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* Skill Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
          <select 
            value={selectedSkill} 
            onChange={(e) => { setSelectedSkill(e.target.value); setSelectedStandard(''); }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a skill...</option>
            {skills.map(skill => <option key={skill} value={skill}>{skill.charAt(0).toUpperCase() + skill.slice(1)}</option>)}
          </select>
        </div>

        {/* Learning Standard Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Learning Standard</label>
          <select 
            value={selectedStandard} 
            onChange={(e) => setSelectedStandard(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={!selectedSkill}
          >
            <option value="">Select a standard...</option>
            {filteredStandards.map(st => (
              <option key={st.id} value={st.id}>{st.code} - {st.description}</option>
            ))}
          </select>
        </div>

        {/* PL Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Performance Level (1-6)</label>
          <div className="flex justify-between max-w-sm">
            {[1, 2, 3, 4, 5, 6].map(level => (
              <button
                type="button"
                key={level}
                onClick={() => setPlScore(level)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                  plScore === level 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
          <button
            type="submit"
            disabled={saving || !plScore || !selectedStudent || !selectedStandard}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Record'}
          </button>
          
          {success && (
            <span className="text-green-600 flex items-center font-medium">
              <CheckCircle2 className="w-5 h-5 mr-1" />
              Saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecordPerformance;
