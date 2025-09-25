import { Question, UserAnswer } from "@/types/quiz";
import { CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { decodeHtml } from "@/lib/shuffle";

export const ResultsPage = ({
  questions,
  answers,
  username,
  onRestart,
  onLogout,
}: {
  questions: Question[];
  answers: UserAnswer[];
  username: string;
  onRestart: () => void;
  onLogout: () => void;
}) => {
  const totalQuestions = questions.length;
  const answeredQuestions = answers.length;
  const correctAnswers = answers.filter((a) => a.correct).length;
  const wrongAnswers = answeredQuestions - correctAnswers;
  const scorePercentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-emerald-600 p-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 right-24 w-32 h-32 border-8 border-white rounded-full"></div>
        <div className="absolute top-40 right-8 w-20 h-20 border-6 border-white rounded-full"></div>
        <div className="absolute hidden sm:block top-16 left-16 w-48 h-48 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 border-8 border-white rounded-full"></div>
        <div className="absolute bottom-16 left-1/3 w-16 h-16 border-4 border-white rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/3 left-1/2 w-24 h-24 border-6 border-white rounded-full"></div>
      </div>

      <div className="mx-auto relative z-10">
        {/* Header with celebration animation */}
          <div className="mb-16 border-emerald-200">
            <h1 className="text-4xl font-bold bg-emerald-600 bg-clip-text text-white mb-3">
              Quiz Complete! 
            </h1>
            <p className="text-white text-lg font-medium">
              Awesome work, {username}! You have conquered this challenge.
            </p>
            <div className="mt-4 inline-block px-6 py-2 bg-white/20 rounded-md">
              <span className="text-white font-semibold">
                Your Achievement Unlocked
              </span>
            </div>
          </div>

        {/* Enhanced Score Summary with animations */}
        <div className="bg-white/20 rounded-xl shadow-2xl p-8 mb-8 border border-emerald-100">
          <div className="flex items-center gap-3 mb-6 text-white">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Your Performance</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-white/20 rounded-xl border transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">
                {totalQuestions}
              </div>
              <div className="text-white font-medium">Total Questions</div>
            </div>

            <div className="text-center p-6 bg-white/20 rounded-xl border transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">
                {correctAnswers}
              </div>
              <div className="text-white font-medium">Correct</div>
            </div>

            <div className="text-center p-6 bg-white/20 rounded-xl border transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">
                {wrongAnswers}
              </div>
              <div className="text-white font-medium">Wrong</div>
            </div>

            <div className="text-center p-6 bg-white/20 rounded-xl border transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">
                {scorePercentage}%
              </div>
              <div className="text-white   font-medium">Final Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">
                Overall Performance
              </span>
              <span className="text-white font-bold">{scorePercentage}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all duration-1000 ease-out"
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="text-center flex flex-wrap justify-center gap-4">
            <button
              onClick={onRestart}
              className="group bg-emerald-700 text-white px-8 py-3 rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-xl"
            >
              <span className="flex items-center gap-2">Take Another Quiz</span>
            </button>
            <button
              onClick={onLogout}
              className="group bg-transparent border-2 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-xl"
            >
              <span className="flex items-center gap-2">Logout</span>
            </button>
          </div>
        </div>

        {/* Enhanced Detailed Results */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-emerald-100">
          <div className="flex items-center justify-center mb-8">
            <h3 className="text-2xl font-bold text-emerald-800">
              Detailed Review
            </h3>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = answers.find((a) => a.questionIndex === index);
              const isCorrect = userAnswer?.correct;
              const wasAnswered = userAnswer !== undefined;

              return (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                    !wasAnswered
                      ? "border-gray-200 bg-gray-50"
                      : isCorrect
                      ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50"
                      : "border-red-200 bg-gradient-to-r from-red-50 to-pink-50"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full hidden md:flex items-center justify-center flex-shrink-0 shadow-md ${
                        !wasAnswered
                          ? "bg-gradient-to-br from-gray-400 to-gray-500"
                          : isCorrect
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    >
                      {!wasAnswered ? (
                        <span className="text-white font-bold text-sm">
                          {index + 1}
                        </span>
                      ) : isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <XCircle className="w-6 h-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-4 text-lg leading-relaxed">
                        <span className="mr-2">Q{index + 1}.</span>
                        {decodeHtml(question.question)}
                      </h4>

                      {wasAnswered && (
                        <div className="mb-3 p-3 rounded-lg bg-white/70 border-l-4 border-gray-300">
                          <span className="text-sm font-medium text-gray-600">
                            Your answer:{" "}
                          </span>
                          <span
                            className={`font-bold ${
                              isCorrect ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {decodeHtml(userAnswer.selectedAnswer)}
                          </span>
                        </div>
                      )}

                      <div className="p-3 rounded-lg bg-emerald-100/70 border-l-4 border-emerald-400">
                        <span className="text-sm font-medium text-emerald-700">
                          Correct answer:{" "}
                        </span>
                        <span className="font-bold text-emerald-800">
                          {decodeHtml(question.correct_answer)}
                        </span>
                      </div>

                      {!wasAnswered && (
                        <div className="text-sm text-gray-500 mt-3 italic bg-gray-100 p-2 rounded">
                          Not answered - Time ran out
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="text-center mt-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
            <p className="text-white font-medium text-lg">
              {scorePercentage >= 80
                ? "Excellent performance! You're a quiz master!"
                : scorePercentage >= 60
                ? "Good job! Keep practicing to improve!"
                : "Don't give up! Every attempt makes you stronger!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
