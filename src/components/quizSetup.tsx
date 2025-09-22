"use client";

import { useState, useEffect } from "react";
import { Play, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const QuizSetup = ({
  username,
  onStartQuiz,
  onShowResumeModal,
  onLogout,
}: {
  username: string;
  onStartQuiz: (
    amount: number,
    type: string,
    timeLimit: number,
    difficulty: string | "",
    category: number | ""
  ) => void;
  onShowResumeModal: () => void;
  onLogout: () => void;
}) => {
  const [amount, setAmount] = useState(10);
  const [type, setType] = useState("multiple");
  const [timeLimit, setTimeLimit] = useState(300);
  const [difficulty, setDifficulty] = useState("");
  const [allCategories, setAllCategories] = useState<
    { id: number; name: string }[]
  >([]);
  const [category, setCategory] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalWrong: 0,
    averageScore: 0,
    bestScore: 0,
    streak: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  // Load user statistics from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem(`userStats_${username}`);
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, [username]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("https://opentdb.com/api_category.php");
      const data = await res.json();
      setAllCategories(data.trivia_categories);
    };
    fetchCategories();

    // Check for existing quiz progress
    const progress = localStorage.getItem("quizProgress");
    if (progress) {
      onShowResumeModal();
    }
  }, [onShowResumeModal]);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      await onStartQuiz(amount, type, timeLimit, difficulty, category ?? "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90)
      return { level: "Master", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (percentage >= 80)
      return { level: "Expert", color: "text-purple-600", bg: "bg-purple-100" };
    if (percentage >= 70)
      return { level: "Advanced", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 60)
      return {
        level: "Intermediate",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    return { level: "Beginner", color: "text-gray-600", bg: "bg-gray-100" };
  };

  const performance = getPerformanceLevel(userStats.averageScore);

  return (
    <div className="min-h-screen bg-emerald-600 flex flex-col lg:flex-row justify-between gap-10 font-jakartaSans">
      <div className="flex-1 flex flex-col gap-8 p-16 text-white relative">
        {/* Logo with entrance animation */}
        <div
          className={cn(
            "logo flex items-center gap-2 transition-all duration-1000 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          )}
        >
          <div className="w-6 h-6 bg-white rounded-sm transform transition-transform duration-500 hover:rotate-12 hover:scale-110" />
          <h1 className="text-4xl font-bold">QuizIn</h1>
        </div>

        {/* User Stats Recap */}
        <div className="text-white">
          <h1 className="font-bold text-2xl sm:text-4xl">
            Ready to Challenge Yourself?
          </h1>
          <p className="mb-16">
            Choose your settings and see how many questions you can get right!
          </p>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Your Quiz Journey</h3>
          </div>

          {userStats.totalQuizzes > 0 ? (
            <div className="grid xs:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="text-4xl font-bold">
                  {userStats.totalQuizzes}
                </div>
                <div className="text-sm opacity-80 leading-4">
                  Quizzes <br /> Taken
                </div>
              </div>

              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="text-4xl font-bold">
                  {userStats.totalQuestions}
                </div>
                <div className="text-sm opacity-80 leading-4">
                  Questions Answered
                </div>
              </div>

              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="text-4xl font-bold">
                  {userStats.totalCorrect}
                </div>
                <div className="text-sm opacity-80 leading-4">
                  Correct <br />
                  Answers
                </div>
              </div>

              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="text-4xl font-bold">{userStats.totalWrong}</div>
                <div className="text-sm opacity-80 leading-4">
                  Wrong <br />
                  Answers
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium mb-2">
                Ready for your first quiz?
              </p>
              <p className="opacity-80">
                Start your learning journey with QuizIn!
              </p>
            </div>
          )}

          {/* Performance Level & Stats */}
          {userStats.totalQuizzes > 0 && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold">
                      Performance Level:
                    </span>
                    <div
                      className={`px-3 py-1 rounded-full ${performance.bg} ${performance.color} text-sm font-bold`}
                    >
                      {performance.level}
                    </div>
                  </div>
                  <p className="text-sm opacity-80">
                    Average Score: {userStats.averageScore.toFixed(1)}%
                  </p>
                </div>
                <div className="sm:text-right">
                  <div className="text-lg font-bold">Best Score</div>
                  <div className="text-2xl font-bold text-yellow-300">
                    {userStats.bestScore}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white flex-1 p-16">
        <div className="text-center mb-6">
          <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Play className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-emerald-600 bg-clip-text text-transparent">
            Welcome, {username}!
          </h1>
          <p className="text-emerald-600 mt-2 font-medium">
            Setup your next quiz challenge
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col xs:flex-row justify-between gap-6">
            <div className="w-full">
              <label className="block text-sm font-bold text-emerald-600 mb-2">
                Number of Questions
              </label>
              <select
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-emerald-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600  transition-all duration-200"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block text-sm font-bold text-emerald-600 mb-2">
                Question Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-200"
              >
                <option value="multiple">Multiple Choice</option>
                <option value="boolean">True/False</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-600 mb-2">
              Time Limit
            </label>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-emerald-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600  transition-all duration-200"
            >
              <option value={300}>5 Minutes</option>
              <option value={600}>10 Minutes</option>
              <option value={900}>15 Minutes</option>
              <option value={1200}>20 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-600 mb-2">
              Question Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-3 border-2 border-emerald-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600  transition-all duration-200"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-600 mb-2">
              Question Category
            </label>
            <select
              value={category ?? ""}
              onChange={(e) =>
                setCategory(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full px-4 py-3 border-2 border-emerald-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600  transition-all duration-200"
            >
              <option value="">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className={cn(
                "w-full bg-emerald-600 hover:to-emerald-700 rounded-xl text-white py-4 font-bold text-lg",
                "transition-all duration-300 ease-in-out shadow-lg",
                "hover:scale-105 hover:shadow-xl",
                "active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                loading && "animate-pulse"
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading Questions...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Quiz Adventure
                </span>
              )}
            </button>
            <button
              onClick={onLogout}
              className="group bg-transparent border-2 text-black px-8 py-3 rounded-lg hover:bg-red-700 hover:text-white transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-xl"
            >
              <span className="flex items-center gap-2">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};
