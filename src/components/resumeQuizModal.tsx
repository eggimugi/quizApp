import { RotateCcw } from "lucide-react";

export const ResumeQuizModal = ({ onResume, onNewQuiz }: { onResume: () => void; onNewQuiz: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Resume Quiz?</h2>
          <p className="text-gray-600 mt-2">
            You have an unfinished quiz. Would you like to continue or start a new one?
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={onResume}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Resume Quiz
          </button>
          <button
            onClick={onNewQuiz}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};