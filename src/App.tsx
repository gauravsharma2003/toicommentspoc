import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, Send, X } from 'lucide-react';

// Types

type CommentType = {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  likes?: number;
  replies: any[];
  isOpinion?: boolean;
  paragraphId?: string;
  reference?: string;
};

type OpinionPollsType = {
  [key: string]: {
    question: string;
    responses: { user: string; option: string; timestamp: Date }[];
  };
};

type ShowOpinionTooltipType = {
  pollId: string;
  response: string;
  paragraphId: string;
} | null;

const InteractiveNewsApp: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [paragraphComments, setParagraphComments] = useState<Record<string, CommentType[]>>({});
  const [commentInput, setCommentInput] = useState<string>('');
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const [bottomSheetView, setBottomSheetView] = useState<'paragraph' | 'overall'>('paragraph');
  const [activeParagraph, setActiveParagraph] = useState<string | null>(null);
  const [focusedParagraph, setFocusedParagraph] = useState<string>('p1');
  const [showPollTooltip, setShowPollTooltip] = useState<string | null>(null);
  const [showOpinionTooltip, setShowOpinionTooltip] = useState<ShowOpinionTooltipType>(null);
  const [opinionPolls, setOpinionPolls] = useState<OpinionPollsType>({
    poll1: { question: "Do you think AI will revolutionize healthcare in the next 5 years?", responses: [] },
    poll2: { question: "Should there be stricter regulations on AI development?", responses: [] },
    commentPoll: { question: "Would you trust an AI system to diagnose your medical condition?", responses: [] }
  });

  const username = "Alex Chen";

  const articleContent = [
    {
      id: 'p1',
      text: "Artificial Intelligence is rapidly transforming the healthcare industry, promising unprecedented improvements in patient care and medical research. From diagnostic imaging to drug discovery, AI technologies are reshaping how we approach medicine."
    },
    {
      id: 'p2', 
      text: "Recent studies show that AI-powered diagnostic tools can detect certain conditions with 95% accuracy, often outperforming human specialists in speed and precision. Machine learning algorithms are particularly effective at identifying patterns in medical imaging that might be missed by the human eye.",
      poll: { id: 'poll1', position: 'end' }
    },
    {
      id: 'p3',
      text: "One of the most promising applications of AI in healthcare is in radiology. Deep learning models trained on millions of medical images can now detect early-stage cancers, fractures, and other abnormalities with remarkable accuracy. This technology is helping radiologists work more efficiently and catch diseases earlier than ever before."
    },
    {
      id: 'p4',
      text: "However, the integration of AI in healthcare raises important questions about data privacy, algorithmic bias, and the potential displacement of healthcare workers. Patient data security becomes even more critical when sensitive medical information is processed by AI systems that may be vulnerable to cyber attacks."
    },
    {
      id: 'p5',
      text: "Drug discovery represents another frontier where AI is making significant strides. Traditional pharmaceutical research can take decades and cost billions of dollars. AI algorithms can now analyze molecular structures and predict drug interactions in a fraction of the time, potentially accelerating the development of life-saving medications."
    },
    {
      id: 'p6',
      text: "Leading hospitals are now implementing AI systems for everything from drug discovery to personalized treatment plans, marking a significant shift in medical practice. These systems can analyze patient histories, genetic information, and current symptoms to recommend tailored treatment approaches.",
      poll: { id: 'poll2', position: 'end' }
    },
    {
      id: 'p7',
      text: "Surgical robotics powered by AI is another area showing tremendous promise. Robotic surgical systems can perform minimally invasive procedures with greater precision than human hands, reducing recovery times and improving patient outcomes. Some systems can even make real-time adjustments during surgery based on tissue analysis."
    },
    {
      id: 'p8',
      text: "Mental health care is also being revolutionized by AI technologies. Natural language processing algorithms can analyze speech patterns and text communications to identify early signs of depression, anxiety, and other mental health conditions. Virtual therapists and chatbots are providing 24/7 support to patients who might otherwise go without help."
    },
    {
      id: 'p9',
      text: "The COVID-19 pandemic has accelerated the adoption of AI in healthcare, with contact tracing apps, diagnostic tools, and vaccine distribution systems all leveraging artificial intelligence. These technologies proved crucial in managing the global health crisis and demonstrated AI's potential for public health management."
    },
    {
      id: 'p10',
      text: "Despite these advances, challenges remain in implementing AI healthcare solutions. Regulatory approval processes, integration with existing medical systems, and training healthcare professionals to work alongside AI tools are all significant hurdles that must be overcome."
    },
    {
      id: 'p11',
      text: "As we move forward, the challenge lies in balancing innovation with ethical considerations, ensuring that AI serves to enhance rather than replace human expertise in healthcare. The future of medicine will likely involve close collaboration between artificial intelligence and human medical professionals, combining the best of both worlds."
    },
    {
      id: 'p12',
      text: "Looking ahead, emerging technologies like quantum computing and advanced neural networks promise to unlock even greater potential for AI in healthcare. From personalized medicine based on individual genetic profiles to real-time health monitoring through wearable devices, the possibilities seem limitless."
    }
  ];

  // Smooth scroll detection without flickering
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isInitialized = false;
    
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        const viewportHeight = window.innerHeight;
        const viewportMiddle = viewportHeight / 2;
        let closestToMiddle: string | null = null;
        let closestDistance = Infinity;

        articleContent.forEach((section) => {
          const element = document.getElementById(`paragraph-${section.id}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementBottom = rect.bottom;
            const elementMiddle = elementTop + (rect.height / 2);
            
            if (elementTop < (viewportHeight + 100) && elementBottom > -100) {
              const distanceToMiddle = Math.abs(elementMiddle - viewportMiddle);
              if (distanceToMiddle < closestDistance) {
                closestDistance = distanceToMiddle;
                closestToMiddle = section.id;
              }
            }
          }
        });
        
        if (isInitialized && closestToMiddle && closestToMiddle !== focusedParagraph) {
          setFocusedParagraph(closestToMiddle);
        } else if (!isInitialized) {
          const firstParagraph = document.getElementById('paragraph-p1');
          if (firstParagraph) {
            const firstRect = firstParagraph.getBoundingClientRect();
            if (firstRect.bottom < 0) {
              if (closestToMiddle) {
                setFocusedParagraph(closestToMiddle);
              }
            }
          }
          isInitialized = true;
        }
      }, 100);
    };

    setTimeout(() => {
      handleScroll();
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [focusedParagraph]);

  const handleOpinionClick = (
    pollId: string,
    option: string,
    questionText: string,
    paragraphId?: string | null,
    isCommentPoll: boolean = false
  ) => {
    setOpinionPolls(prev => ({
      ...prev,
      [pollId]: {
        ...prev[pollId],
        responses: [...prev[pollId].responses, { user: username, option, timestamp: new Date() }]
      }
    }));

    const emoji = option === 'yes' ? '👍' : option === 'no' ? '👎' : '🤷';
    const response = option === 'yes' ? 'Yes' : option === 'no' ? 'No' : 'I don\'t care';
    const opinionText = `${emoji} ${response} - "${questionText}"`;
    
    if (!isCommentPoll && paragraphId) {
      const newComment: CommentType = {
        id: Date.now().toString(),
        text: opinionText,
        username: username,
        timestamp: new Date().toLocaleTimeString(),
        replies: [],
        isOpinion: true,
        paragraphId: paragraphId
      };

      setParagraphComments(prev => ({
        ...prev,
        [paragraphId]: [...(prev[paragraphId] || []), newComment]
      }));

      setShowOpinionTooltip({
        pollId,
        response: opinionText,
        paragraphId
      });

      setTimeout(() => {
        setShowOpinionTooltip(null);
      }, 3000);
    }
    
    if (isCommentPoll) {
      setCommentInput(opinionText);
    }
    
    setShowPollTooltip(null);
  };

  const addParagraphComment = (paragraphId: string | null, commentText: string) => {
    if (!commentText.trim() || !paragraphId) return;

    const newComment: CommentType = {
      id: Date.now().toString(),
      text: commentText,
      username: username,
      timestamp: new Date().toLocaleTimeString(),
      replies: [],
      paragraphId: paragraphId
    };

    setParagraphComments(prev => ({
      ...prev,
      [paragraphId]: [...(prev[paragraphId] || []), newComment]
    }));

    const reference = `📝 Re: Paragraph ${paragraphId.replace('p', '')}`;
    addCommentWithReference(commentText, reference);
  };

  const addCommentWithReference = (text: string, paragraphRef: string = '') => {
    const commentText = paragraphRef ? `${text} ${paragraphRef}` : text;
    const newComment: CommentType = {
      id: Date.now().toString(),
      text: commentText,
      username: username,
      timestamp: new Date().toLocaleTimeString(),
      likes: 0,
      replies: [],
      reference: paragraphRef
    };

    setComments(prev => [newComment, ...prev]);
    setCommentInput('');
  };

  const addMainComment = () => {
    if (!commentInput.trim()) return;
    addCommentWithReference(commentInput);
  };

  const handleParagraphClick = (paragraphId: string) => {
    setActiveParagraph(paragraphId);
    setBottomSheetView('paragraph');
    setShowBottomSheet(true);
  };

  const OpinionPoll: React.FC<{ pollId: string; question: string; paragraphId?: string }> = ({ pollId, question, paragraphId }) => {
    const poll = opinionPolls[pollId];
    const hasResponded = poll.responses.some((r) => r.user === username);
    const isOpen = showPollTooltip === pollId;
    const [tooltipPosition, setTooltipPosition] = useState<{ position: 'top' | 'bottom'; align: 'left' | 'center' | 'right' }>({ position: 'bottom', align: 'center' });

    useEffect(() => {
      if (isOpen) {
        const button = document.querySelector(`[data-poll-id="${pollId}"]`);
        if (button) {
          const rect = button.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const tooltipWidth = 256;
          const tooltipHeight = 120;
          let position: 'top' | 'bottom' = 'bottom';
          let align: 'left' | 'center' | 'right' = 'center';
          const centerX = rect.left + rect.width / 2;
          const leftEdge = centerX - tooltipWidth / 2;
          const rightEdge = centerX + tooltipWidth / 2;
          if (leftEdge < 16) align = 'left';
          else if (rightEdge > viewportWidth - 16) align = 'right';
          if (rect.bottom + tooltipHeight > viewportHeight - 16) position = 'top';
          setTooltipPosition({ position, align });
        }
      }
    }, [isOpen, pollId]);

    const getTooltipClasses = () => {
      const baseClasses = "absolute z-20 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-3 animate-in fade-in duration-200";
      let positionClasses = "";
      let arrowClasses = "";
      if (tooltipPosition.position === 'top') {
        positionClasses = "bottom-6";
        arrowClasses = "absolute -bottom-1 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45";
      } else {
        positionClasses = "top-6";
        arrowClasses = "absolute -top-1 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45";
      }
      if (tooltipPosition.align === 'left') {
        positionClasses += " left-0";
        arrowClasses += " left-4";
      } else if (tooltipPosition.align === 'right') {
        positionClasses += " right-0";
        arrowClasses += " right-4";
      } else {
        positionClasses += " left-1/2 transform -translate-x-1/2";
        arrowClasses += " left-1/2 transform -translate-x-1/2";
      }
      return {
        tooltip: `${baseClasses} ${positionClasses}`,
        arrow: arrowClasses
      };
    };

    const classes = getTooltipClasses();

    return (
      <span className="relative inline-block mx-1">
        <button
          data-poll-id={pollId}
          onClick={() => setShowPollTooltip(isOpen ? null : pollId)}
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-110
            ${hasResponded 
              ? 'bg-green-100 text-green-600 border border-green-300' 
              : 'bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200'
            }`}
        >
          {hasResponded ? '✓' : '?'}
        </button>
        {isOpen && (
          <div className={classes.tooltip}>
            <div className={classes.arrow}></div>
            <p className="text-xs font-medium text-gray-800 mb-3">{question}</p>
            {!hasResponded ? (
              <div className="flex gap-1">
                {[
                  { key: 'yes', label: 'Yes', color: 'bg-green-500 hover:bg-green-600' },
                  { key: 'no', label: 'No', color: 'bg-red-500 hover:bg-red-600' },
                  { key: 'neutral', label: 'Don\'t care', color: 'bg-gray-500 hover:bg-gray-600' }
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => handleOpinionClick(pollId, key, question, paragraphId)}
                    className={`px-2 py-1 rounded-full text-white text-xs font-medium transition-all duration-200 transform hover:scale-105 ${color}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-green-600 font-medium">✓ Thanks for your response!</p>
            )}
          </div>
        )}
        {showOpinionTooltip && showOpinionTooltip.pollId === pollId && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 w-72 bg-green-50 border border-green-200 rounded-xl p-3 animate-in fade-in slide-in-from-top-2 duration-200 max-w-[calc(100vw-2rem)]">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-50 border-l border-t border-green-200 rotate-45"></div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-semibold text-green-800">Opinion recorded!</span>
            </div>
            <p className="text-xs text-green-700 mb-3 break-words">"{showOpinionTooltip.response}"</p>
            <button
              onClick={() => handleParagraphClick(showOpinionTooltip.paragraphId)}
              className="w-full text-xs bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              💬 Add more thoughts
            </button>
          </div>
        )}
      </span>
    );
  };

  const ParagraphWithComments: React.FC<{ section: { id: string; text: string; poll?: { id: string; position: string } } }> = ({ section }) => {
    const commentCount = paragraphComments[section.id]?.length || 0;
    const isFocused = focusedParagraph === section.id;
    return (
      <div
        id={`paragraph-${section.id}`}
        className={`relative my-3 p-3 rounded-lg transition-all duration-300 ease-out ${
          isFocused 
            ? 'bg-gray-50 border border-gray-200 shadow-sm' 
            : 'bg-transparent border border-transparent'
        }`}
      >
        {isFocused && (
          <button
            onClick={() => handleParagraphClick(section.id)}
            className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-all duration-200 transform hover:scale-110 z-10"
          >
            <div className="relative">
              <MessageCircle size={16} className="text-gray-600" />
              {commentCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {commentCount > 9 ? '9+' : commentCount}
                </span>
              )}
            </div>
          </button>
        )}
        <p className={`text-base leading-relaxed transition-colors duration-300 ${
          isFocused ? 'text-gray-900' : 'text-gray-700'
        }`}>
          {section.text}
          {section.poll && (
            <OpinionPoll 
              pollId={section.poll.id}
              question={opinionPolls[section.poll.id].question}
              paragraphId={section.id}
            />
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900">AI in Healthcare: The Future is Now</h1>
        <p className="text-sm text-gray-600 mt-1">Tech News • 12 min read</p>
      </div>
      {/* Article Content */}
      <div className="p-4">
        {articleContent.map((section) => (
          <ParagraphWithComments key={section.id} section={section} />
        ))}
      </div>
      {/* Bottom Sheet for Comments */}
      <AnimatePresence>
        {showBottomSheet && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-30 max-h-[70vh] overflow-hidden"
          >
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBottomSheetView('paragraph')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    bottomSheetView === 'paragraph' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Paragraph
                </button>
                <button
                  onClick={() => setBottomSheetView('overall')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    bottomSheetView === 'overall' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Comments
                </button>
              </div>
              <button onClick={() => setShowBottomSheet(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              {bottomSheetView === 'paragraph' ? (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Comments on Paragraph {activeParagraph?.replace('p', '')}
                  </h3>
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment to this paragraph..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement;
                            if (target.value.trim()) {
                              addParagraphComment(activeParagraph, target.value);
                              target.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                          if (input && input.value.trim()) {
                            addParagraphComment(activeParagraph, input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {(activeParagraph && paragraphComments[activeParagraph]?.length)
                      ? paragraphComments[activeParagraph].map((comment: CommentType) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className={`w-8 h-8 ${comment.isOpinion ? 'bg-gradient-to-br from-yellow-500 to-orange-600' : 'bg-gradient-to-br from-purple-500 to-blue-600'} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                            {comment.isOpinion ? comment.text.charAt(0) : comment.username.charAt(0)}
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-2xl p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-sm text-gray-900">{comment.username}</span>
                              <div className="flex items-center gap-2">
                                {comment.isOpinion && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Opinion</span>
                                )}
                                <span className="text-xs text-gray-500">{comment.timestamp}</span>
                              </div>
                            </div>
                            <p className="text-gray-800 text-sm leading-relaxed">{comment.text}</p>
                          </div>
                        </div>
                      ))
                      : <p className="text-gray-500 text-center py-8">No comments yet for this paragraph</p>
                    }
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">All Comments ({comments.length})</h3>
                  <div className="space-y-3">
                    {comments.map((comment: CommentType) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {comment.username.charAt(0)}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-2xl p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm text-gray-900">{comment.username}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-800 text-sm leading-relaxed">{comment.text}</p>
                          {comment.reference && (
                            <div className="text-xs text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded">
                              {comment.reference}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Comment Section */}
      <div id="comment-section" className="border-t border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments ({comments.length})</h2>
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <p className="text-sm text-gray-700 mb-2">{opinionPolls.commentPoll.question}</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'yes', label: '👍 Yes', color: 'bg-green-500 hover:bg-green-600' },
              { key: 'no', label: '👎 No', color: 'bg-red-500 hover:bg-red-600' },
              { key: 'neutral', label: '🤷 I don\'t care', color: 'bg-gray-500 hover:bg-gray-600' }
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => handleOpinionClick('commentPoll', key, opinionPolls.commentPoll.question, null, true)}
                className={`px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 ${color}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {username.charAt(0)}
            </div>
            <div className="flex-1">
              <textarea
                value={commentInput}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentInput(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={addMainComment}
                  disabled={!commentInput.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105"
                >
                  <Send size={16} />
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {comments.map((comment: CommentType) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {comment.username.charAt(0)}
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm text-gray-900">{comment.username}</span>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{comment.text}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                    <ThumbsUp size={14} />
                    <span className="text-xs">{comment.likes}</span>
                  </button>
                  <button className="text-xs text-gray-500 hover:text-blue-500 transition-colors duration-200">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveNewsApp;
