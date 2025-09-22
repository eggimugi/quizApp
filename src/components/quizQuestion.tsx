import { Question } from "@/types/quiz";
import { Clock } from "lucide-react";
import { shuffleArray, decodeHtml, formatTime } from "@/lib/shuffle";

export const QuizQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  onAnswer,
}: {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: number;
  onAnswer: (answer: string) => void;
}) => {
  if (!question.all_answers) {
    question.all_answers = shuffleArray([
      question.correct_answer,
      ...question.incorrect_answers,
    ]);
  }

  // Calculate progress percentage
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-emerald-600 relative">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-8 pointer-events-none">
        <div className="absolute top-8 right-12 w-8 h-8 border-5 rounded-full"></div>
        <div className="absolute hidden sm:block top-20 right-32 w-16 h-16 border-5 rounded-full"></div>
        <div className="absolute hidden xs:block top-32 right-8 w-24 h-24 border-5 rounded-full"></div>
        <div className="absolute top-6 left-6 w-44 h-44 border-5 rounded-full"></div>
        <div className="absolute top-40 left-32 w-12 h-12 border-5 rounded-full"></div>
        <div className="absolute bottom-16 right-24 w-32 h-32 border-5 rounded-full"></div>
        <div className="absolute bottom-32 right-6 w-20 h-20 border-5 rounded-full"></div>
        <div className="absolute bottom-8 left-1/4 w-14 h-14 border-5 rounded-full"></div>
        <div className="absolute bottom-24 left-1/2 w-10 h-10 border-5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-6 h-6 border-5 rounded-full"></div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="">
          {/* Progress Bar Container */}
          <div className="w-full bg-gray-200 h-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-center items-center mt-3">
            <span className="text-white font-medium">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="px-16 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col sm:flex-row sm:items-center space-x-4">
            <div className="text-sm hidden sm:block text-white">
              Category: {decodeHtml(question.category)}
            </div>
            <div className="text-sm text-white">
              Difficulty:{" "}
              <span
                className={`font-medium capitalize text-white ${question.difficulty}`}
              >
                {question.difficulty}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg font-bold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex flex-col items-center py-8 px-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8 leading-relaxed">
          {decodeHtml(question.question)}
        </h2>

        <div className="grid gap-4">
          {question.all_answers?.map((answer, index) => (
            <button
              key={index}
              onClick={() => onAnswer(answer)}
              className="text-left p-4 border-2 sm:min-w-xl md:min-w-2xl lg:min-w-4xl bg-white rounded-xl hover:border-emerald-500 hover:bg-emerald-400 transition-all duration-200 group hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-100 group-hover:bg-emerald-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 group-hover:text-white transition-all duration-200 flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-gray-800 text-lg group-hover:text-white">
                  {decodeHtml(answer)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
