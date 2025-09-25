import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Mic, MicOff, Send, BookOpen, TrendingUp, Clock, CheckCircle, Star, Heart, Users, Loader2, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import femaleMentorAvatar from "@assets/generated_images/female_mentor_avatar_portrait_bc221e33.png";
import maleMentorAvatar from "@assets/generated_images/male_mentor_avatar_portrait_a3d54ed8.png";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

interface MenteeHomeProps {
  user: User;
  onLogout: () => void;
}

const mockQuestions = [
  {
    id: "1",
    text: "How do I negotiate salary as a first-generation professional without seeming ungrateful?",
    category: "career",
    status: "answered",
    isPublic: false,
    createdAt: "2024-01-15T10:30:00Z",
    mentor: {
      name: "Sarah Chen",
      title: "Senior Engineering Manager",
      avatar: femaleMentorAvatar
    },
    answer: "Salary negotiation is a skill, not greed! Start by researching market rates, then frame it as wanting to contribute your best work. I recommend saying something like 'Based on my research and the value I bring, I'd like to discuss compensation that reflects market standards for this role.'",
    aiInsights: {
      keyTakeaways: ["Research is your foundation", "Frame as value creation", "Practice the conversation"],
      actionSteps: [
        "Use Glassdoor and PayScale to research salary ranges",
        "Document your achievements and impact",
        "Practice with a friend or mentor before the real conversation"
      ]
    }
  },
  {
    id: "2",
    text: "I feel like I don't belong in tech leadership meetings. How do I build confidence to speak up?",
    category: "confidence",
    status: "pending",
    isPublic: true,
    createdAt: "2024-01-14T14:15:00Z"
  }
];

const mockSuggestedMentors = [
  {
    id: "1",
    name: "Marcus Johnson",
    title: "VP of Engineering",
    company: "TechCorp",
    expertise: ["Leadership", "Career Growth"],
    bio: "15+ years leading diverse engineering teams",
    avatar: maleMentorAvatar,
    responseRate: 95,
    avgResponseTime: "2 hours"
  },
  {
    id: "2",
    name: "Sarah Chen",
    title: "Senior Engineering Manager",
    company: "InnovateNow",
    expertise: ["Technical Skills", "Confidence"],
    bio: "Helping underrepresented professionals thrive in tech",
    avatar: femaleMentorAvatar,
    responseRate: 98,
    avgResponseTime: "1 hour"
  }
];

export default function MenteeHome({ user, onLogout }: MenteeHomeProps) {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState("ask");
  const { toast } = useToast();

  // Fetch user's questions
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery<any[]>({
    queryKey: ["/api/questions/mentee"],
  });

  // Fetch suggested mentors
  const { data: suggestedMentors = [] } = useQuery<any[]>({
    queryKey: ["/api/mentors/active"],
  });

  // Submit question mutation
  const submitQuestionMutation = useMutation({
    mutationFn: async (questionData: { text: string; category: string; isPublic: boolean }) => {
      const response = await apiRequest("POST", "/api/questions", questionData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Question submitted!",
        description: "We're matching you with the perfect mentor. You'll get notified when they respond."
      });
      setQuestion("");
      setCategory("");
      setIsPublic(false);
      // Invalidate questions to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/questions/mentee"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting question",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const handleSubmitQuestion = () => {
    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter your question before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for your question.",
        variant: "destructive"
      });
      return;
    }

    submitQuestionMutation.mutate({
      text: question,
      category,
      isPublic
    });
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // TODO: Remove mock functionality - implement actual voice recording
    console.log(isRecording ? 'Stopping recording' : 'Starting recording');
    toast({
      title: isRecording ? "Recording stopped" : "Recording started",
      description: isRecording ? "Voice input saved" : "Speak your question"
    });
  };

  const handleSaveToLibrary = (questionId: string) => {
    // TODO: Remove mock functionality
    console.log('Saving to library:', questionId);
    toast({
      title: "Saved to library",
      description: "This Q&A has been added to your wisdom library."
    });
  };

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
                  Welcome back, {user.firstName || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/mentor/apply">
                <Button variant="outline" size="sm" data-testid="button-become-mentor">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Become a Mentor
                </Button>
              </Link>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Questions Asked</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">8</div>
              <div className="text-sm text-muted-foreground">Answers Received</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">24</div>
              <div className="text-sm text-muted-foreground">Action Items Completed</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="ask" data-testid="tab-ask">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask
            </TabsTrigger>
            <TabsTrigger value="questions" data-testid="tab-questions">
              <Clock className="w-4 h-4 mr-2" />
              My Questions
            </TabsTrigger>
            <TabsTrigger value="library" data-testid="tab-library">
              <BookOpen className="w-4 h-4 mr-2" />
              Library
            </TabsTrigger>
          </TabsList>

          {/* Ask Tab */}
          <TabsContent value="ask" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  What's on your mind?
                </CardTitle>
                <CardDescription>
                  Ask anything about career growth, confidence, leadership, or personal development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="What's one thing you're stuck on? Be specific - the more context you provide, the better guidance you'll receive..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    className="pr-12"
                    data-testid="input-question"
                  />
                  <Button
                    size="icon"
                    variant={isRecording ? "destructive" : "ghost"}
                    className="absolute bottom-2 right-2"
                    onClick={handleVoiceToggle}
                    data-testid="button-voice"
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  {isRecording && (
                    <div className="absolute top-2 right-12 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full animate-pulse">
                      Recording...
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="career">Career Growth</SelectItem>
                        <SelectItem value="confidence">Confidence</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="technical">Technical Skills</SelectItem>
                        <SelectItem value="personal">Personal Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <Switch 
                      id="public" 
                      checked={isPublic} 
                      onCheckedChange={setIsPublic}
                      data-testid="switch-public"
                    />
                    <Label htmlFor="public" className="text-sm">
                      Make this public (help others learn too)
                    </Label>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitQuestion} 
                  className="w-full" 
                  size="lg"
                  disabled={submitQuestionMutation.isPending}
                  data-testid="button-submit-question"
                >
                  {submitQuestionMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {submitQuestionMutation.isPending ? "Submitting..." : "Submit Question"}
                </Button>
              </CardContent>
            </Card>

            {/* Suggested Mentors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Suggested Mentors
                </CardTitle>
                <CardDescription>
                  Connect with mentors who match your interests and goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedMentors.map((mentor: any) => (
                  <Card key={mentor.id} className="hover-elevate cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={mentor.avatar} />
                          <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{mentor.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {mentor.title} at {mentor.company}
                              </p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current text-yellow-400" />
                                {mentor.responseRate}%
                              </div>
                              <div>Avg: {mentor.avgResponseTime}</div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{mentor.bio}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {(mentor.expertise || []).map((skill: string) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            {isLoadingQuestions ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading your questions...</p>
                </CardContent>
              </Card>
            ) : questions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/50" />
                  <h3 className="font-medium">No questions yet</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Ask your first question to get started on your mentorship journey.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("ask")}
                    data-testid="button-ask-first-question-from-empty"
                  >
                    Ask Your First Question
                  </Button>
                </CardContent>
              </Card>
            ) : (
              questions.map((q: any) => (
              <Card key={q.id} className="hover-elevate">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={q.status === 'answered' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {q.status === 'answered' ? (
                            <><CheckCircle className="w-3 h-3 mr-1" />Answered</>
                          ) : (
                            <><Clock className="w-3 h-3 mr-1" />Pending</>
                          )}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {q.category}
                        </Badge>
                        {q.isPublic && (
                          <Badge variant="secondary" className="text-xs">
                            Public
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-medium mb-4" data-testid={`text-question-${q.id}`}>{q.text}</p>
                  
                  {q.answer && q.mentor && (
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={q.mentor?.user?.profileImageUrl || q.mentor?.avatar} />
                          <AvatarFallback>
                            {(q.mentor?.user?.firstName?.[0] || q.mentor?.name?.[0] || 'M').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {q.mentor?.user?.firstName && q.mentor?.user?.lastName 
                              ? `${q.mentor.user.firstName} ${q.mentor.user.lastName}` 
                              : q.mentor?.name || 'Anonymous Mentor'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {q.mentor?.title || 'Mentor'}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm bg-muted/50 p-3 rounded-lg" data-testid={`text-answer-${q.id}`}>
                        {q.answer?.text || q.answer}
                      </p>
                      
                      {(q.answer?.aiInsights || q.aiInsights) && (
                        <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Key Takeaways
                          </h4>
                          <ul className="text-xs space-y-1">
                            {(q.answer?.aiInsights?.keyTakeaways || q.aiInsights?.keyTakeaways || []).map((takeaway: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-primary" />
                                {takeaway}
                              </li>
                            ))}
                          </ul>
                          
                          <h4 className="font-medium text-sm pt-2">Action Steps</h4>
                          <ol className="text-xs space-y-1">
                            {(q.answer?.aiInsights?.actionSteps || q.aiInsights?.actionSteps || []).map((step: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary font-medium">{idx + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSaveToLibrary(q.id)}
                          data-testid={`button-save-${q.id}`}
                        >
                          <BookOpen className="w-3 h-3 mr-1" />
                          Save to Library
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              ))
            )}
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Your Wisdom Library
                </CardTitle>
                <CardDescription>
                  Your saved insights, action items, and growth milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 space-y-4">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50" />
                  <h3 className="font-medium">Start building your wisdom library</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Save meaningful Q&As, track your progress, and revisit insights that help you grow.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("ask")}
                    data-testid="button-ask-first-question"
                  >
                    Ask Your First Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}