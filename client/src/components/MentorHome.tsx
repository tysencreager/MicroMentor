import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Clock, CheckCircle, Star, Heart, Users, TrendingUp, Award, Send, SkipForward } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

interface MentorHomeProps {
  user: User;
  onLogout: () => void;
}

const mockPendingQuestions = [
  {
    id: "1",
    text: "How do I negotiate salary as a first-generation professional without seeming ungrateful? I've been at my company for 2 years and I know I'm underpaid compared to market rates, but I don't want to seem demanding.",
    category: "career",
    menteeProfile: {
      background: "First-generation college graduate, 2 years experience",
      industry: "Software Development"
    },
    createdAt: "2024-01-15T10:30:00Z",
    isPublic: false
  },
  {
    id: "2",
    text: "I feel like I don't belong in tech leadership meetings. Everyone else seems so confident and I'm always second-guessing myself. How do I build the confidence to speak up and contribute?",
    category: "confidence",
    menteeProfile: {
      background: "Mid-level engineer transitioning to leadership",
      industry: "Technology"
    },
    createdAt: "2024-01-14T14:15:00Z",
    isPublic: true
  },
  {
    id: "3",
    text: "What's the best way to find a sponsor at work? I've heard having a sponsor is crucial for advancement, but I don't know how to approach someone or what to ask for.",
    category: "leadership",
    menteeProfile: {
      background: "5 years experience, looking to advance",
      industry: "Consulting"
    },
    createdAt: "2024-01-13T09:20:00Z",
    isPublic: false
  }
];

const mockAnsweredQuestions = [
  {
    id: "4",
    text: "How do I network effectively when I'm naturally introverted?",
    category: "personal",
    answer: "Start small! Focus on quality over quantity. Attend smaller events where you can have deeper conversations. LinkedIn is your friend - engage with posts meaningfully. Remember, many successful leaders are introverts. Your listening skills and thoughtful responses are actually networking superpowers.",
    answeredAt: "2024-01-12T16:45:00Z",
    feedback: "helpful",
    isPublic: true
  }
];

export default function MentorHome({ user, onLogout }: MentorHomeProps) {
  const [activeTab, setActiveTab] = useState("queue");
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const handleAnswerQuestion = (questionId: string) => {
    if (!response.trim()) {
      toast({
        title: "Response required",
        description: "Please write your response before submitting.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Remove mock functionality - submit to backend
    console.log('Answering question:', { questionId, response });
    toast({
      title: "Response sent!",
      description: "Your mentorship advice has been delivered. The mentee will receive AI-enhanced insights along with your response."
    });
    setResponse("");
    setCurrentQuestionId(null);
  };

  const handleSkipQuestion = (questionId: string) => {
    // TODO: Remove mock functionality
    console.log('Skipping question:', questionId);
    toast({
      title: "Question skipped",
      description: "This question will be offered to other mentors."
    });
    setCurrentQuestionId(null);
  };

  const weeklyCapacity = 5;
  const questionsAnswered = 2;
  const progressPercentage = (questionsAnswered / weeklyCapacity) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">MicroMentor</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, Mentor {user.firstName || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <Star className="w-3 h-3 mr-1" />
                Verified Mentor
              </Badge>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.profileImageUrl} />
                <AvatarFallback>
                  {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogout}
                data-testid="button-logout"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Weekly Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">Weekly Impact Goal</h3>
                <p className="text-sm text-muted-foreground">
                  {questionsAnswered} of {weeklyCapacity} questions answered
                </p>
              </div>
              <Badge variant={questionsAnswered >= weeklyCapacity ? "default" : "secondary"}>
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">47</div>
              <div className="text-sm text-muted-foreground">Mentees Helped</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Helpful Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">2.5h</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="queue" data-testid="tab-queue">
              <MessageSquare className="w-4 h-4 mr-2" />
              Question Queue ({mockPendingQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="answered" data-testid="tab-answered">
              <CheckCircle className="w-4 h-4 mr-2" />
              Answered
            </TabsTrigger>
            <TabsTrigger value="impact" data-testid="tab-impact">
              <Award className="w-4 h-4 mr-2" />
              Impact
            </TabsTrigger>
          </TabsList>

          {/* Question Queue Tab */}
          <TabsContent value="queue" className="space-y-4">
            {mockPendingQuestions.map((question) => (
              <Card key={question.id} className="hover-elevate">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {question.category}
                        </Badge>
                        {question.isPublic && (
                          <Badge variant="secondary" className="text-xs">
                            Public
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(question.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="font-medium mb-2" data-testid={`text-question-${question.id}`}>
                      {question.text}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Background:</strong> {question.menteeProfile.background}</p>
                      <p><strong>Industry:</strong> {question.menteeProfile.industry}</p>
                    </div>
                  </div>
                  
                  {currentQuestionId === question.id ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Share your wisdom and experience. Be specific and actionable - your response will be enhanced with AI-generated takeaways and action steps..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        rows={5}
                        data-testid={`textarea-response-${question.id}`}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleAnswerQuestion(question.id)}
                          className="flex-1"
                          data-testid={`button-submit-${question.id}`}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Response
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentQuestionId(null)}
                          data-testid={`button-cancel-${question.id}`}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setCurrentQuestionId(question.id)}
                        className="flex-1"
                        data-testid={`button-answer-${question.id}`}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Answer Question
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleSkipQuestion(question.id)}
                        data-testid={`button-skip-${question.id}`}
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {mockPendingQuestions.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/50" />
                  <h3 className="font-medium">No questions in queue</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Great job! You've answered all pending questions. New questions from mentees will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Answered Tab */}
          <TabsContent value="answered" className="space-y-4">
            {mockAnsweredQuestions.map((question) => (
              <Card key={question.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Answered
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {question.category}
                        </Badge>
                        {question.isPublic && (
                          <Badge variant="secondary" className="text-xs">
                            Public
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Answered on {new Date(question.answeredAt).toLocaleDateString()}
                      </p>
                    </div>
                    {question.feedback === 'helpful' && (
                      <Badge variant="default">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Helpful
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-2">{question.text}</p>
                    </div>
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <p className="text-sm">{question.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Your Mentorship Impact
                  </CardTitle>
                  <CardDescription>
                    See how you're making a difference in people's lives
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">47</div>
                      <div className="text-sm text-muted-foreground">Lives Impacted</div>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">156</div>
                      <div className="text-sm text-muted-foreground">Action Items Created</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Recent Achievements
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Badge>🎯</Badge>
                        <div>
                          <p className="font-medium text-sm">Career Catalyst</p>
                          <p className="text-xs text-muted-foreground">Helped 10+ mentees with career decisions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Badge>⭐</Badge>
                        <div>
                          <p className="font-medium text-sm">Confidence Builder</p>
                          <p className="text-xs text-muted-foreground">94% helpful rating this month</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Badge>🚀</Badge>
                        <div>
                          <p className="font-medium text-sm">Quick Responder</p>
                          <p className="text-xs text-muted-foreground">Average response time under 3 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}