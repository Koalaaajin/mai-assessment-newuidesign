import React, { useState } from 'react';
import questions from '../data/questions';

const QUESTIONS_PER_PAGE = 10;

/**
 * Questionnaire component renders the paginated MAI survey. Users
 * progress through 10 questions per page (with the final page
 * containing the remaining questions). After the questions are
 * completed, an information form appears to collect the student's
 * identifying details. Once submitted, the `onComplete` callback is
 * invoked with the answers and user info.
 *
 * Props:
 * - onComplete: (answers: number[], info: object) => void
 */
function Questionnaire({ onComplete }) {
  const totalQuestionPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  // currentStep ranges from 0..totalQuestionPages for question pages, and equal to totalQuestionPages for the info form
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [info, setInfo] = useState({ name: '', age: '', school: '', grade: '' });

  const handleAnswer = (questionId, value) => {
    const index = questions.findIndex(q => q.id === questionId);
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
  };

  const handleNext = () => {
    // Do not allow advancing past the info form.
    setCurrentStep(prev => Math.min(prev + 1, totalQuestionPages));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleInfoChange = (field, value) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass results to parent component
    onComplete(answers, info);
  };

  // Determine which questions appear on the current step
  const startIndex = currentStep * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);

  // Check whether the current page is fully answered
  const isPageAnswered = currentQuestions.every((q) => answers[q.id - 1] !== null);

  // Progress bar computation: how many of the 52 questions have been answered
  const totalAnswered = answers.filter((a) => a !== null).length;
  const progressPercent = (totalAnswered / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      {currentStep < totalQuestionPages ? (
        <div>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
              <div
                className="h-2 bg-indigo-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between items-center text-sm text-gray-600">
              <span>第 {startIndex + 1}–{endIndex} 题，共 52 题</span>
              <span>页面 {currentStep + 1} / {totalQuestionPages}</span>
            </div>
          </div>

          <div className="space-y-5">
            {currentQuestions.map((q) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
                <p className="font-medium mb-2 text-gray-800">
                  {q.id}. {q.zh}
                </p>
                <p className="text-sm mb-4 text-gray-600">{q.text}</p>
                <div className="flex space-x-4">
                  {/* True button */}
                  <button
                    type="button"
                    onClick={() => handleAnswer(q.id, 1)}
                    className={`px-4 py-2 rounded border transition-colors focus:outline-none ${
                      answers[q.id - 1] === 1
                        ? 'bg-indigo-500 border-indigo-600 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    True（是）
                  </button>
                  {/* False button */}
                  <button
                    type="button"
                    onClick={() => handleAnswer(q.id, 0)}
                    className={`px-4 py-2 rounded border transition-colors focus:outline-none ${
                      answers[q.id - 1] === 0
                        ? 'bg-indigo-500 border-indigo-600 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    False（否）
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-8">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                上一页
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!isPageAnswered}
              className={`px-4 py-2 rounded text-white transition-colors ${
                isPageAnswered
                  ? 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {currentStep + 1 === totalQuestionPages ? '去填写信息' : '下一页'}
            </button>
          </div>
        </div>
      ) : (
        // Info form
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 shadow-md p-6 rounded-lg space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-800">填写个人信息</h2>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">姓名</label>
            <input
              type="text"
              value={info.name}
              onChange={(e) => handleInfoChange('name', e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">年龄</label>
            <input
              type="number"
              value={info.age}
              onChange={(e) => handleInfoChange('age', e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">学校</label>
            <input
              type="text"
              value={info.school}
              onChange={(e) => handleInfoChange('school', e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">年级</label>
            <input
              type="text"
              value={info.grade}
              onChange={(e) => handleInfoChange('grade', e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              上一页
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            >
              查看结果
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Questionnaire;