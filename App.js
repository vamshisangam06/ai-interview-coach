import React, { useState } from 'react';
import { AlertCircle, CheckCircle, TrendingUp, MessageSquare, Mic, Eye, Brain, Award, Target } from 'lucide-react';

export default function InterviewCoach() {
  const [formData, setFormData] = useState({
    jobRole: '',
    companyType: '',
    interviewType: 'HR',
    difficulty: 'medium',
    question: '',
    answer: '',
    pauseSeconds: '',
    wpm: '',
    fillerCount: '',
    confidenceScore: '',
    eyeContact: '',
    smileFreq: '',
    gestures: '',
    emotionDistribution: ''
  });

  const [analysis, setAnalysis] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const analyzeInterview = () => {
    const contentScores = analyzeContent(formData.answer, formData.question);
    const speechAnalysis = analyzeSpeech(
      parseFloat(formData.pauseSeconds),
      parseInt(formData.wpm),
      parseInt(formData.fillerCount),
      parseFloat(formData.confidenceScore)
    );
    const nonVerbalAnalysis = analyzeNonVerbal(
      parseFloat(formData.eyeContact),
      parseInt(formData.smileFreq),
      formData.gestures,
      formData.emotionDistribution
    );
    const feedback = generateFeedback(contentScores, speechAnalysis, nonVerbalAnalysis, formData);
    setAnalysis(feedback);
  };

  const analyzeContent = (answer, question) => {
    const wordCount = answer.trim().split(/\s+/).length;
    const relevance = answer.length > 50 ? Math.min(10, 5 + Math.floor(wordCount / 20)) : 4;
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const clarity = sentences.length > 2 ? Math.min(10, 6 + sentences.length / 2) : 5;
    const hasExamples = /example|instance|experience|situation|time when/i.test(answer);
    const depth = hasExamples ? 8 : 6;
    const hasFillerPhrases = /um|uh|like|you know|kind of|sort of/i.test(answer);
    const professional = hasFillerPhrases ? 6 : 8;
    const conciseness = wordCount > 300 ? 6 : wordCount < 50 ? 5 : 8;
    return { relevance, clarity, depth, professional, conciseness };
  };

  const analyzeSpeech = (pause, wpm, fillers, confidence) => {
    let level = 'Medium';
    let insights = [];
    
    if (pause > 2) {
      insights.push('Long pauses suggest uncertainty or difficulty organizing thoughts');
      level = 'Low';
    } else if (pause < 0.5) {
      insights.push('Very short pauses indicate good fluency and preparation');
    }
    
    if (wpm < 120) {
      insights.push('Slow speaking pace may indicate nervousness or over-thinking');
    } else if (wpm > 160) {
      insights.push('Fast speaking pace suggests nervousness or rushing');
    } else {
      insights.push('Speaking pace is well-balanced and professional');
    }
    
    if (fillers > 10) {
      insights.push('High filler word usage reduces professional impression');
      level = 'Low';
    } else if (fillers < 3) {
      insights.push('Minimal filler words demonstrate strong communication skills');
    }
    
    if (confidence < 0.5) {
      level = 'Low';
      insights.push('Voice analysis indicates low confidence levels');
    } else if (confidence > 0.75) {
      level = 'High';
      insights.push('Strong vocal confidence detected');
    }
    
    return { level, insights };
  };

  const analyzeNonVerbal = (eyeContact, smile, gestures, emotions) => {
    let insights = [];
    let impression = 'Moderate';
    
    if (eyeContact > 0.7) {
      insights.push('Excellent eye contact shows engagement and confidence');
      impression = 'Strong';
    } else if (eyeContact < 0.4) {
      insights.push('Limited eye contact may suggest nervousness or discomfort');
      impression = 'Needs improvement';
    }
    
    if (smile > 3) {
      insights.push('Appropriate smiling creates a friendly, approachable impression');
    } else if (smile === 0) {
      insights.push('No smiling detected - consider showing more warmth');
    }
    
    if (gestures.toLowerCase().includes('excessive') || gestures.toLowerCase().includes('fidgeting')) {
      insights.push('Nervous gestures detected - focus on calming techniques');
      impression = 'Needs improvement';
    } else if (gestures.toLowerCase().includes('minimal') || gestures.toLowerCase().includes('none')) {
      insights.push('Natural, controlled body language observed');
    }
    
    return { insights, impression };
  };

  const generateFeedback = (content, speech, nonVerbal, data) => {
    const avgContent = (content.relevance + content.clarity + content.depth + content.professional + content.conciseness) / 5;
    
    const strengths = [];
    if (content.relevance >= 8) strengths.push('Strong answer relevance to the question');
    if (content.depth >= 8) strengths.push('Good use of examples and detailed explanations');
    if (speech.level === 'High') strengths.push('Confident vocal delivery');
    if (parseFloat(data.eyeContact) > 0.7) strengths.push('Excellent eye contact and engagement');
    if (parseInt(data.fillerCount) < 3) strengths.push('Minimal use of filler words');
    
    const improvements = [];
    if (content.relevance < 6) improvements.push('Answer could be more directly relevant to the question');
    if (content.depth < 6) improvements.push('Include more specific examples and details');
    if (parseInt(data.fillerCount) > 10) improvements.push('Reduce filler words (um, uh, like)');
    if (parseFloat(data.pauseSeconds) > 2) improvements.push('Work on reducing long pauses');
    if (parseFloat(data.eyeContact) < 0.4) improvements.push('Maintain better eye contact with the interviewer');
    
    const tips = [];
    tips.push('Use the STAR method (Situation, Task, Action, Result) to structure behavioral answers');
    if (parseInt(data.fillerCount) > 5) {
      tips.push('Practice pausing silently instead of using filler words - silence is more professional');
    }
    if (parseFloat(data.wpm) > 160) {
      tips.push('Take deep breaths and consciously slow down your speaking pace');
    }
    if (parseFloat(data.eyeContact) < 0.5) {
      tips.push('Practice the 50/70 rule: maintain eye contact 50% while speaking, 70% while listening');
    }
    tips.push('Record yourself practicing and review for areas of improvement');
    
    return {
      summary: generateSummary(avgContent, speech.level, nonVerbal.impression),
      contentScores: content,
      speechAnalysis: speech,
      nonVerbalAnalysis: nonVerbal,
      strengths,
      improvements,
      tips,
      improvedAnswer: generateImprovedAnswer(data.question, data.answer)
    };
  };

  const generateSummary = (contentScore, speechLevel, nonVerbalImpression) => {
    if (contentScore >= 8 && speechLevel === 'High') {
      return 'Excellent performance! You demonstrated strong content knowledge, confident delivery, and professional presence. With minor refinements, you\'re well-positioned for success.';
    } else if (contentScore >= 6 && speechLevel !== 'Low') {
      return 'Good performance overall. Your answer showed solid understanding with room for enhancement in delivery and structure. Focus on the improvement areas to elevate your interview presence.';
    } else {
      return 'Your interview shows potential with several areas for growth. Focus on structured preparation, practice your delivery, and work on building confidence through mock interviews.';
    }
  };

  const generateImprovedAnswer = (question, originalAnswer) => {
    return `When answering "${question}", consider this structure:\n\n"That's a great question. In my previous role at [Company], I encountered a similar situation where [Situation]. I was responsible for [Task]. I approached this by [Action - specific steps you took]. As a result, [Result - quantifiable outcome]. This experience taught me [Key learning], which I believe would be valuable in this role because [Connection to job]."\n\nKey improvements:\n• Opens with confidence\n• Follows STAR structure\n• Includes specific examples\n• Quantifies results\n• Connects to the role`;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getLevelColor = (level) => {
    if (level === 'High') return 'bg-green-500';
    if (level === 'Medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-8 border border-indigo-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-600 p-3 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">AI Interview Coach</h1>
              <p className="text-gray-600 mt-1">Advanced performance analysis with actionable insights</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="mt-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Role</label>
                <input
                  type="text"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Type</label>
                <input
                  type="text"
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  placeholder="e.g., Tech Startup"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Interview Type</label>
                <select
                  name="interviewType"
                  value={formData.interviewType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="HR">HR</option>
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Interview Question</label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Enter the interview question..."
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Answer (Transcribed)</label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Paste your answer here..."
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Speech Metrics */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5 text-indigo-600" />
                Speech & Voice Metrics
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pause Duration (sec)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="pauseSeconds"
                    value={formData.pauseSeconds}
                    onChange={handleChange}
                    placeholder="e.g., 1.5"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Speaking Speed (WPM)</label>
                  <input
                    type="number"
                    name="wpm"
                    value={formData.wpm}
                    onChange={handleChange}
                    placeholder="e.g., 140"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Filler Words Count</label>
                  <input
                    type="number"
                    name="fillerCount"
                    value={formData.fillerCount}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confidence Score (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="confidenceScore"
                    value={formData.confidenceScore}
                    onChange={handleChange}
                    placeholder="e.g., 0.75"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Body Language Metrics */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                Facial Expression & Body Language
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Eye Contact Score (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="eyeContact"
                    value={formData.eyeContact}
                    onChange={handleChange}
                    placeholder="e.g., 0.65"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Smile Frequency</label>
                  <input
                    type="number"
                    name="smileFreq"
                    value={formData.smileFreq}
                    onChange={handleChange}
                    placeholder="e.g., 4"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nervous Gestures</label>
                  <input
                    type="text"
                    name="gestures"
                    value={formData.gestures}
                    onChange={handleChange}
                    placeholder="e.g., minimal, none"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Emotion Distribution</label>
                  <input
                    type="text"
                    name="emotionDistribution"
                    value={formData.emotionDistribution}
                    onChange={handleChange}
                    placeholder="e.g., neutral 60%, happy 30%"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={analyzeInterview}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <TrendingUp className="w-6 h-6" />
              Analyze My Interview Performance
            </button>
          </div>
        </div>

        {/* Results Section */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-indigo-600">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-xl">
                  <Award className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Overall Performance Summary</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{analysis.summary}</p>
                </div>
              </div>
            </div>

            {/* Score Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Content Quality */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">Content Quality</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(analysis.contentScores).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-700 capitalize">{key}:</span>
                      <span className={`px-4 py-1.5 rounded-lg font-bold text-lg ${getScoreColor(value)}`}>
                        {value}/10
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speech Confidence */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-100">
                <div className="flex items-center gap-3 mb-6">
                  <Mic className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-900">Speech Confidence</h3>
                </div>
                <div className="text-center mb-6 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                  <div className={`inline-block px-6 py-3 rounded-xl text-white font-bold text-2xl ${getLevelColor(analysis.speechAnalysis.level)}`}>
                    {analysis.speechAnalysis.level}
                  </div>
                  <p className="text-gray-600 mt-2 font-medium">Confidence Level</p>
                </div>
                <div className="space-y-3">
                  {analysis.speechAnalysis.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                      <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body Language */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Body Language</h3>
                </div>
                <div className="text-center mb-6 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-2xl font-bold text-green-700">{analysis.nonVerbalAnalysis.impression}</div>
                  <p className="text-gray-600 mt-2 font-medium">Overall Impression</p>
                </div>
                <div className="space-y-3">
                  {analysis.nonVerbalAnalysis.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Strengths</h3>
                </div>
                {analysis.strengths.length > 0 ? (
                  <ul className="space-y-3">
                    {analysis.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 leading-relaxed">{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Keep practicing to build your strengths!</p>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-500">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-7 h-7 text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Areas for Improvement</h3>
                </div>
                {analysis.improvements.length > 0 ? (
                  <ul className="space-y-3">
                    {analysis.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 leading-relaxed">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Great job! No major areas for improvement detected.</p>
                )}
              </div>
            </div>

            {/* Actionable Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-indigo-100">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-7 h-7 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">Actionable Improvement Tips</h3>
              </div>
              <div className="space-y-4">
                {analysis.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-600">
                    <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {idx + 1}
                    </span>
                    <p className="text-gray-800 leading-relaxed pt-1">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Improved Answer */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-purple-600" />
                Improved Sample Answer
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border-2 border-purple-200">
                <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">{analysis.improvedAnswer}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}