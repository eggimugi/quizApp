"use client";
import { useState, useEffect } from "react";
import { Question, UserAnswer, QuizProgress, QuizSettings } from "@/types/quiz";
import { LoginForm } from "./login-form";
import { QuizSetup } from "./quizSetup";
import { QuizQuestion } from "./quizQuestion";
import { ResultsPage } from "./resultPage";
import { ResumeQuizModal } from "./resumeQuizModal";
import { shuffleArray } from "@/lib/shuffle";

const QuizApp = () => {
  const [currentPage, setCurrentPage] = useState<
    "login" | "setup" | "quiz" | "results"
  >("login");
  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    amount: 10,
    type: "multiple",
    timeLimit: 300,
  });

  // Function to update user statistics after quiz completion
  const updateUserStats = (quizResult: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    scorePercentage: number;
  }) => {
    const savedStats = localStorage.getItem(`userStats_${username}`);
    const currentStats = savedStats ? JSON.parse(savedStats) : {
      totalQuizzes: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalWrong: 0,
      averageScore: 0,
      bestScore: 0,
      streak: 0
    };

    const newStats = {
      ...currentStats,
      totalQuizzes: currentStats.totalQuizzes + 1,
      totalQuestions: currentStats.totalQuestions + quizResult.totalQuestions,
      totalCorrect: currentStats.totalCorrect + quizResult.correctAnswers,
      totalWrong: currentStats.totalWrong + quizResult.wrongAnswers,
      bestScore: Math.max(currentStats.bestScore, quizResult.scorePercentage),
      averageScore: currentStats.totalQuizzes === 0 
        ? quizResult.scorePercentage 
        : ((currentStats.averageScore * currentStats.totalQuizzes) + quizResult.scorePercentage) / (currentStats.totalQuizzes + 1)
    };

    localStorage.setItem(`userStats_${username}`, JSON.stringify(newStats));
    
    // Optional: Log stats update for debugging
    console.log('User stats updated:', newStats);
  };

  // Initialize app
  useEffect(() => {
    const savedSession = localStorage.getItem("session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (Date.now() < session.expiresAt) {
          setUsername(session.username);
          setCurrentPage("setup");
        } else {
          localStorage.removeItem("session"); // expired
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem("session");
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (currentPage === "quiz" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPage, timeLeft]);

  const handleLogin = (inputUsername: string) => {
    const session = {
      username: inputUsername,
      expiresAt: Date.now() + 1000 * 60 * 30,
    };
    localStorage.setItem("session", JSON.stringify(session));
    setUsername(inputUsername);
    setCurrentPage("setup");
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("quizProgress");
    localStorage.removeItem("session");
    setUsername("");
    setCurrentPage("login");
  };

  const handleStartQuiz = async (
    amount: number,
    type: string,
    timeLimit: number,
    difficulty: string | "",
    category: number | ""
  ) => {
    try {
      const newQuizSettings: QuizSettings = {
        amount,
        type: type as "multiple" | "boolean",
        timeLimit,
      };
      if (difficulty !== "") {
        newQuizSettings.difficulty = difficulty as "easy" | "medium" | "hard";
      }
      if (category !== "") {
        newQuizSettings.category = category;
      }
      setQuizSettings(newQuizSettings);

      let url = `https://opentdb.com/api.php?amount=${amount}&type=${type}`;
      if (difficulty !== "") {
        url += `&difficulty=${difficulty}`;
      }
      if (category !== "") {
        url += `&category=${category}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const processedQuestions = data.results.map((q: Question) => ({
          ...q,
          all_answers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
        }));

        setQuestions(processedQuestions);
        setCurrentQuestionIndex(0);
        setAnswers([]);

        const endTime = Date.now() + timeLimit * 1000;
        setTimeLeft(timeLimit);

        // Save progress
        const progress: QuizProgress = {
          username,
          questions: processedQuestions,
          currentQuestionIndex: 0,
          answers: [],
          endTime,
          quizSettings: newQuizSettings,
          createdAt: Date.now(),
        };
        localStorage.setItem("quizProgress", JSON.stringify(progress));

        setCurrentPage("quiz");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Error loading questions. Please try again.");
    }
  };

  const handleAnswer = (selectedAnswer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    const newAnswer: UserAnswer = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      correct: isCorrect,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Save progress
    const progress: QuizProgress = {
      username,
      questions,
      currentQuestionIndex: currentQuestionIndex + 1,
      answers: updatedAnswers,
      endTime: Date.now() + timeLeft * 1000,
      quizSettings,
      createdAt: Date.now(),
    };
    localStorage.setItem("quizProgress", JSON.stringify(progress));

    // Move to next question or finish quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz(updatedAnswers);
    }
  };

  const handleTimeUp = () => {
    finishQuiz(answers);
  };

  const finishQuiz = (finalAnswers: UserAnswer[]) => {
    // Calculate quiz results
    const correctAnswers = finalAnswers.filter(answer => answer.correct).length;
    const wrongAnswers = finalAnswers.filter(answer => !answer.correct).length;
    const unansweredQuestions = questions.length - finalAnswers.length;
    const totalQuestions = questions.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Prepare quiz result data
    const quizResult = {
      totalQuestions,
      correctAnswers,
      wrongAnswers: wrongAnswers + unansweredQuestions, // Count unanswered as wrong
      scorePercentage
    };

    // Update user statistics
    updateUserStats(quizResult);

    // Clean up and move to results
    localStorage.removeItem("quizProgress");
    setAnswers(finalAnswers);
    setCurrentPage("results");
  };

  const handleRestart = () => {
    localStorage.removeItem("quizProgress");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeLeft(0);
    setCurrentPage("setup");
  };

  const handleResumeQuiz = () => {
    const savedProgress = localStorage.getItem("quizProgress");
    if (savedProgress) {
      try {
        const progress: QuizProgress = JSON.parse(savedProgress);

        // Calculate remaining time
        const now = Date.now();
        const remainingTime = Math.max(
          0,
          Math.floor((progress.endTime - now) / 1000)
        );

        if (remainingTime > 0) {
          setUsername(progress.username);
          setQuestions(progress.questions);
          setCurrentQuestionIndex(progress.currentQuestionIndex);
          setAnswers(progress.answers);
          setTimeLeft(remainingTime);
          setQuizSettings(progress.quizSettings);
          setCurrentPage("quiz");
        } else {
          // Time expired, finish quiz with current answers and update stats
          setUsername(progress.username);
          setQuestions(progress.questions);
          finishQuiz(progress.answers);
        }
      } catch (error) {
        console.error('Error parsing saved progress:', error);
        localStorage.removeItem("quizProgress");
      }
    }
    setShowResumeModal(false);
  };

  const handleNewQuiz = () => {
    localStorage.removeItem("quizProgress");
    setShowResumeModal(false);
  };

  const handleShowResumeModal = () => {
    setShowResumeModal(true);
  };

  return (
    <div className="font-sans">
      {currentPage === "login" && <LoginForm onLogin={handleLogin} />}

      {currentPage === "setup" && (
        <QuizSetup
          username={username}
          onStartQuiz={handleStartQuiz}
          onShowResumeModal={handleShowResumeModal}
          onLogout={handleLogout}
        />
      )}

      {currentPage === "quiz" && questions.length > 0 && (
        <QuizQuestion
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          timeLeft={timeLeft}
          onAnswer={handleAnswer}
        />
      )}

      {currentPage === "results" && (
        <ResultsPage
          questions={questions}
          answers={answers}
          username={username}
          onRestart={handleRestart}
          onLogout={handleLogout}
        />
      )}

      {showResumeModal && (
        <ResumeQuizModal
          onResume={handleResumeQuiz}
          onNewQuiz={handleNewQuiz}
        />
      )}
    </div>
  );
};

export default QuizApp;