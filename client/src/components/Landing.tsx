import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, MessageSquare, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@assets/generated_images/diverse_mentor_group_illustration_ac58206a.png";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

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