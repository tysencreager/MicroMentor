import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Users, MessageSquare, Sparkles, ArrowRight, CheckCircle, Briefcase, Code, Stethoscope, DollarSign, Lightbulb, TrendingUp, Clock, Star } from "lucide-react";
import heroImage from "@assets/generated_images/diverse_mentor_group_illustration_ac58206a.png";

export default function Landing() {
  const [selectedCategory, setSelectedCategory] = useState("career");
  const [selectedIndustry, setSelectedIndustry] = useState("tech");
  
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const categories = [
    { id: "career", name: "Career Growth", icon: TrendingUp, description: "Advance your career and leadership skills" },
    { id: "confidence", name: "Confidence", icon: Lightbulb, description: "Build self-assurance and overcome imposter syndrome" },
    { id: "technical", name: "Technical Skills", icon: Code, description: "Develop technical expertise and coding abilities" },
    { id: "leadership", name: "Leadership", icon: Users, description: "Learn to lead teams and drive impact" }
  ];

  const industries = [
    { id: "tech", name: "Technology", icon: Code, mentors: "500+", specialties: ["Software Engineering", "Product Management", "Data Science"] },
    { id: "healthcare", name: "Healthcare", icon: Stethoscope, mentors: "200+", specialties: ["Nursing", "Medical Research", "Healthcare Admin"] },
    { id: "finance", name: "Finance", icon: DollarSign, mentors: "150+", specialties: ["Investment Banking", "Financial Planning", "Fintech"] },
    { id: "business", name: "Business", icon: Briefcase, mentors: "300+", specialties: ["Consulting", "Marketing", "Operations"] }
  ];

  const sampleQAs = [
    {
      id: 1,
      question: "How do I negotiate salary as a first-generation professional without seeming ungrateful?",
      category: "career",
      mentor: { name: "Sarah Chen", title: "Senior Engineering Manager", avatar: "SC" },
      preview: "Salary negotiation is a skill, not greed! Start by researching market rates, then frame it as wanting to contribute your best work...",
      timeAgo: "2 days ago",
      helpful: 24
    },
    {
      id: 2,
      question: "I feel like I don't belong in tech leadership meetings. How do I build confidence to speak up?",
      category: "confidence", 
      mentor: { name: "Marcus Johnson", title: "VP of Engineering", avatar: "MJ" },
      preview: "Imposter syndrome is real, especially for underrepresented folks in tech. Here's what helped me find my voice...",
      timeAgo: "1 week ago",
      helpful: 18
    },
    {
      id: 3,
      question: "What's the best way to transition from individual contributor to tech lead?",
      category: "leadership",
      mentor: { name: "Dr. Priya Patel", title: "CTO", avatar: "PP" },
      preview: "The biggest shift is learning that your success is now measured by your team's success, not just your individual output...",
      timeAgo: "3 days ago",
      helpful: 31
    }
  ];

  const faqs = [
    {
      question: "Is MicroMentor really free?",
      answer: "Yes! MicroMentor is completely free for mentees. Our mission is to make quality mentorship accessible to everyone, especially underrepresented groups who historically lack access to professional networks."
    },
    {
      question: "How long does it take to get an answer?",
      answer: "Most questions receive responses within 24-48 hours. Our mentors are working professionals who answer during their available time, which we respect to maintain the quality of guidance."
    },
    {
      question: "Who are the mentors?",
      answer: "Our mentors are verified professionals from top companies who volunteer their time. Each mentor goes through our vetting process to ensure they can provide valuable, empathetic guidance."
    },
    {
      question: "Can I ask follow-up questions?",
      answer: "Absolutely! After receiving an answer, you can ask clarifying questions or request additional guidance. We encourage ongoing conversations that help you grow."
    },
    {
      question: "Is my information kept private?",
      answer: "Your privacy is our priority. Questions can be asked privately or shared publicly (anonymously) to help others. You control what information you share."
    },
    {
      question: "How do you match me with mentors?",
      answer: "Our AI considers your question topic, industry, career level, and preferences to connect you with mentors who have relevant experience and can provide the most helpful guidance."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Header */}
      <header className="w-full p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl">MicroMentor</span>
          </div>
          <Button onClick={handleLogin} data-testid="button-login">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              <Sparkles className="w-3 h-3 mr-1" />
              Impact-First Mentorship
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Mentorship for{" "}
              <span className="text-primary">everyone</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Connect with real mentors through asynchronous, low-commitment interactions. 
              No scheduling pressure, just genuine guidance when you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleLogin}
                className="text-lg px-8 py-6"
                data-testid="button-hero-join"
              >
                Join as Mentee
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleLogin}
                className="text-lg px-8 py-6"
                data-testid="button-hero-mentor"
              >
                Become a Mentor
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl" />
            <img 
              src={heroImage} 
              alt="Diverse group of mentors" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why MicroMentor works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for underrepresented and under-connected groups who deserve genuine guidance
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover-elevate">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>No Scheduling Pressure</CardTitle>
              <CardDescription>
                Ask questions when inspiration strikes. Get answers when mentors have time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover-elevate">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Inclusive by Design</CardTitle>
              <CardDescription>
                Built specifically for those who lack access to traditional mentorship networks.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover-elevate">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>AI-Enhanced Learning</CardTitle>
              <CardDescription>
                Every mentor reply comes with key takeaways and actionable next steps.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, powerful process
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold">Ask Your Question</h3>
              <p className="text-muted-foreground text-sm">
                Text or voice - whatever feels natural
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold">Get Matched</h3>
              <p className="text-muted-foreground text-sm">
                AI connects you with the perfect mentor
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold">Receive Guidance</h3>
              <p className="text-muted-foreground text-sm">
                Personal advice from real professionals
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold">Take Action</h3>
              <p className="text-muted-foreground text-sm">
                AI-generated action steps help you grow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Mentorship Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find guidance tailored to your specific growth areas
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all hover-elevate ${
                  selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`category-${category.id}`}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Industry Specific Sections */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mentors Across Industries
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with professionals from your field or explore new paths
            </p>
          </div>
          
          <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {industries.map((industry) => {
                const Icon = industry.icon;
                return (
                  <TabsTrigger key={industry.id} value={industry.id} data-testid={`industry-${industry.id}`}>
                    <Icon className="w-4 h-4 mr-2" />
                    {industry.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <TabsContent key={industry.id} value={industry.id}>
                  <Card>
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{industry.name}</h3>
                          <p className="text-muted-foreground">{industry.mentors} active mentors</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        {industry.specialties.map((specialty, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span>{specialty}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <Button onClick={handleLogin} data-testid={`join-${industry.id}`}>
                          Connect with {industry.name} Mentors
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {/* Public Q&A Preview */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Real Questions, Real Guidance
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See the quality of mentorship happening on our platform
          </p>
        </div>
        
        <div className="space-y-6">
          {sampleQAs.map((qa) => (
            <Card key={qa.id} className="hover-elevate">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {qa.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{qa.timeAgo}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-3" data-testid={`sample-question-${qa.id}`}>
                      {qa.question}
                    </h3>
                  </div>
                </div>
                
                <div className="border-l-4 border-primary/20 pl-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {qa.mentor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{qa.mentor.name}</p>
                      <p className="text-xs text-muted-foreground">{qa.mentor.title}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic" data-testid={`sample-answer-${qa.id}`}>
                    {qa.preview}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4" />
                    {qa.helpful} people found this helpful
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogin} data-testid={`read-full-${qa.id}`}>
                    Read Full Answer
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button onClick={handleLogin} size="lg" data-testid="view-all-questions">
            Explore More Q&As
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about MicroMentor
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger 
                  className="text-left text-lg font-medium"
                  data-testid={`faq-question-${index}`}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent 
                  className="text-muted-foreground leading-relaxed"
                  data-testid={`faq-answer-${index}`}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <Button onClick={handleLogin} variant="outline" data-testid="contact-support">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to unlock your potential?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of ambitious individuals who are growing with genuine mentorship. 
              Your first question is just one click away.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleLogin}
              className="text-lg px-8 py-6"
              data-testid="button-cta-join"
            >
              Start Your Growth Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">MicroMentor</span>
          </div>
          <p className="text-muted-foreground">
            Mentorship for the rest of us. Built with care for underrepresented communities.
          </p>
        </div>
      </footer>
    </div>
  );
}