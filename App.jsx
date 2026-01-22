import React, { useState } from 'react';
import { AlertCircle, CheckCircle, TrendingUp, MessageSquare, Mic, Eye, Brain } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-10 h-10 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">AI Interview Coach</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Analyze your interview performance with AI-powered insights on content, speech patterns, and body language.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
              <input
                type="text"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
              <input
                type="text"
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                placeholder="e.g., Tech Startup, Fortune 500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
              <select
                name="interviewType"
                value={formData.interviewType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="HR">HR</option>
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Interview Question</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter the interview question you were asked..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer (Transcribed)</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Paste your transcribed answer here..."
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="bg-indigo-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Mic className="w-5 h-5 text-indigo-600" />
              Speech & Voice Metrics
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Average Pause Duration (seconds)</label>
                <input
                  type="number"
                  step="0.1"
                  name="pauseSeconds"
                  value={formData.pauseSeconds}
                  onChange={handleChange}
                  placeholder="e.g., 1.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speaking Speed (WPM)</label>
                <input
                  type="number"
                  name="wpm"
                  value={formData.wpm}
                  onChange={handleChange}
                  placeholder="e.g., 140"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filler Words Count</label>
                <input
                  type="number"
                  name="fillerCount"
                  value={formData.fillerCount}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voice Confidence Score (0-1)</label>
                <input
                  type="number"
                  step="0.01"
                  name="confidenceScore"
                  value={formData.confidenceScore}
                  onChange={handleChange}
                  placeholder="e.g., 0.75"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              Facial Expression & Body Language
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eye Contact Score (0-1)</label>
                <input
                  type="number"
                  step="0.01"
                  name="eyeContact"
                  value={formData.eyeContact}
                  onChange={handleChange}
                  placeholder="e.g., 0.65"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Smile Frequency</label>
                <input
                  type="number"
                  name="smileFreq"
                  value={formData.smileFreq}
                  onChange={handleChange}
                  placeholder="e.g., 4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nervous Gestures Detected</label>
                <input
                  type="text"
                  name="gestures"
                  value={formData.gestures}
                  onChange={handleChange}
                  placeholder="e.g., Hand fidgeting, none, minimal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emotion Distribution</label>
                <input
                  type="text"
                  name="emotionDistribution"
                  value={formData.emotionDistribution}
                  onChange={handleChange}
                  placeholder="e.g., neutral 60%, happy 30%, anxious 10%"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <button
            onClick={analyzeInterview}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Analyze My Interview Performance
          </button>
        </div>

        {analysis && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Interview Performance Report</h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Overall Performance Summary</h3>
              <p className="text-gray-700">{analysis.summary}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Content Quality
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Relevance:</span>
                    <span className="font-semibold">{analysis.contentScores.relevance}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clarity:</span>
                    <span className="font-semibold">{analysis.contentScores.clarity}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Depth:</span>
                    <span className="font-semibold">{analysis.contentScores.depth}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional:</span>
                    <span className="font-semibold">{analysis.contentScores.professional}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conciseness:</span>
                    <span className="font-semibold">{analysis.contentScores.conciseness}/10</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-indigo-600" />
                  Speech Confidence
                </h4>
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-indigo-600">{analysis.speechAnalysis.level}</div>
                  <div className="text-sm text-gray-600">Confidence Level</div>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {analysis.speechAnalysis.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  Body Language
                </h4>
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-green-600">{analysis.nonVerbalAnalysis.impression}</div>
                  <div className="text-sm text-gray-600">Overall Impression</div>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {analysis.nonVerbalAnalysis.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-orange-600 font-bold">→</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Actionable Improvement Tips
              </h3>
              <ul className="space-y-3">
                {analysis.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Improved Sample Answer</h3>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{analysis.improvedAnswer}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}