import { useState } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../firebase';
import { collection, addDoc, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { Download, Upload, Plus } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generateTemplate = () => {
    // 1. Create a workbook
    const wb = XLSX.utils.book_new();

    // 2. Students Sheet
    const studentsData = [
      ["Name", "Class"],
      ["Ali bin Abu", "1 Amanah"],
      ["Siti binti Amin", "1 Amanah"],
    ];
    const studentsWs = XLSX.utils.aoa_to_sheet(studentsData);
    XLSX.utils.book_append_sheet(wb, studentsWs, "Students");

    // 3. Learning Standards Sheet
    const standardsData = [
      ["Skill", "Standard_Code", "Description"],
      ["Reading", "2.1.1", "Read simple sentences"],
      ["Writing", "4.1.2", "Write basic paragraphs"],
      ["Listening", "1.1.1", "Listen and respond to instructions"],
      ["Speaking", "2.1.2", "Speak clearly with proper pronunciation"],
    ];
    const standardsWs = XLSX.utils.aoa_to_sheet(standardsData);
    XLSX.utils.book_append_sheet(wb, standardsWs, "Learning Standards");

    // 4. Save file
    XLSX.writeFile(wb, "PBD_Tracker_Template.xlsx");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage('');
    
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      
      const batch = writeBatch(db);
      
      // Import Students
      if (wb.SheetNames.includes("Students")) {
        const studentsSheet = wb.Sheets["Students"];
        const students = XLSX.utils.sheet_to_json(studentsSheet);
        
        students.forEach((student) => {
          if (student.Name && student.Class) {
            const studentRef = doc(collection(db, 'students'));
            batch.set(studentRef, {
              name: student.Name,
              className: student.Class
            });
          }
        });
      }

      // Import Learning Standards
      if (wb.SheetNames.includes("Learning Standards")) {
        const standardsSheet = wb.Sheets["Learning Standards"];
        const standards = XLSX.utils.sheet_to_json(standardsSheet);
        
        standards.forEach((std) => {
          if (std.Skill && std.Standard_Code) {
            const stdRef = doc(collection(db, 'learning_standards'));
            batch.set(stdRef, {
              skill: std.Skill.toLowerCase(), // reading, writing, etc.
              code: String(std.Standard_Code),
              description: std.Description || ""
            });
          }
        });
      }

      await batch.commit();
      setMessage('Data successfully imported!');
    } catch (error) {
      console.error("Import failed:", error);
      setMessage('Failed to import data. Please ensure you are using the correct template format.');
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings & Data Management</h1>
      
      {message && (
        <div className={`p-4 rounded-md mb-6 ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Excel Import / Export</h2>
        <p className="text-gray-600 mb-6">
          To quickly add your students and learning standards, download the standardized template, fill it in, and upload it back here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={generateTemplate}
            className="flex items-center justify-center bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Template
          </button>
          
          <label className="flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium cursor-pointer transition-colors">
            <Upload className="w-5 h-5 mr-2" />
            {loading ? 'Importing...' : 'Upload Data'}
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={loading}
            />
          </label>
        </div>
      </div>

    </div>
  );
};

export default Settings;
