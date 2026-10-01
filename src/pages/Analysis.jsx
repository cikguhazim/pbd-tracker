import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Analysis = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const studentsSnap = await getDocs(collection(db, 'students'));
        const studentsData = studentsSnap.docs.map(doc => doc.data());
        const uniqueClasses = [...new Set(studentsData.map(s => s.className))].filter(Boolean);
        setClasses(uniqueClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setAnalysisData([]);
      return;
    }

    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        // 1. Get students for selected class
        const q = query(collection(db, 'students'), where('className', '==', selectedClass));
        const studentsSnap = await getDocs(q);
        const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 2. Get all assessments
        const assessmentsSnap = await getDocs(collection(db, 'assessments'));
        const assessments = assessmentsSnap.docs.map(doc => doc.data());

        // 3. Process data per student
        const processed = students.map(student => {
          const studentAssessments = assessments.filter(a => a.studentId === student.id);
          
          const getSkillAvg = (skillName) => {
            const skillRecords = studentAssessments.filter(a => a.skill === skillName);
            if (skillRecords.length === 0) return 0;
            const sum = skillRecords.reduce((acc, curr) => acc + curr.pl, 0);
            return sum / skillRecords.length;
          };

          const readingAvg = getSkillAvg('reading');
          const writingAvg = getSkillAvg('writing');
          const listeningAvg = getSkillAvg('listening');
          const speakingAvg = getSkillAvg('speaking');

          const skillsAssessedCount = [readingAvg, writingAvg, listeningAvg, speakingAvg].filter(val => val > 0).length;
          const overallAvg = skillsAssessedCount > 0 
            ? (readingAvg + writingAvg + listeningAvg + speakingAvg) / skillsAssessedCount 
            : 0;

          return {
            id: student.id,
            name: student.name,
            reading: readingAvg,
            writing: writingAvg,
            listening: listeningAvg,
            speaking: speakingAvg,
            overall: overallAvg
          };
        });

        // Sort by name
        processed.sort((a, b) => a.name.localeCompare(b.name));
        setAnalysisData(processed);

      } catch (error) {
        console.error("Error fetching analysis data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [selectedClass]);

  const formatPL = (num) => num > 0 ? num.toFixed(1) : '-';

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Performance Analysis</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class to Analyze</label>
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="max-w-xs w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a class...</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading && <div className="text-center py-10">Calculating averages...</div>}

      {!loading && selectedClass && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Student Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">Reading PL</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">Writing PL</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">Listening PL</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">Speaking PL</th>
                  <th className="px-6 py-4 font-semibold text-blue-700 text-center bg-blue-50">Overall PL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {analysisData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No students found in this class.</td>
                  </tr>
                ) : (
                  analysisData.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-center">{formatPL(student.reading)}</td>
                      <td className="px-6 py-4 text-center">{formatPL(student.writing)}</td>
                      <td className="px-6 py-4 text-center">{formatPL(student.listening)}</td>
                      <td className="px-6 py-4 text-center">{formatPL(student.speaking)}</td>
                      <td className="px-6 py-4 text-center font-bold text-blue-700 bg-blue-50">{formatPL(student.overall)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
