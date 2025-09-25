import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, Clock, AlertCircle, Shield, 
  FileText, User, Mail, Briefcase, Star
} from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
}

interface MentorVerificationDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function MentorVerificationDashboard({ user, onLogout }: MentorVerificationDashboardProps) {
  // Fetch user's mentor application
  const { data: application, isLoading } = useQuery({
    queryKey: ["/api/mentors/application"],
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          title: 'Application Under Review',
          description: 'We\'re reviewing your application. This typically takes 5-7 business days.'
        };
      case 'under_review':
        return {
          icon: Shield,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          title: 'Background Check in Progress',
          description: 'We\'re conducting verification checks and may contact your references.'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          title: 'Application Approved!',
          description: 'Congratulations! You\'re now a verified mentor. Welcome to MicroMentor!'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          title: 'Application Not Approved',
          description: 'Unfortunately, we weren\'t able to approve your application at this time.'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          title: 'Application Status Unknown',
          description: 'Please contact support for assistance.'
        };
    }
  };

  const getVerificationProgress = (application: any) => {
    let progress = 0;
    const checks = [
      application?.workEmailVerified,
      application?.linkedinVerified,
      application?.backgroundCheckStatus === 'completed',
      application?.referencesContacted
    ];
    
    progress = (checks.filter(Boolean).length / checks.length) * 100;
    return Math.round(progress);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto animate-pulse">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading your application status...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground/50" />
            <h3 className="font-medium">No Application Found</h3>
            <p className="text-muted-foreground text-sm">
              We couldn't find a mentor application for your account.
            </p>
            <Button onClick={onLogout} variant="outline">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(application.status);
  const StatusIcon = statusInfo.icon;
  const verificationProgress = getVerificationProgress(application);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Mentor Application</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user.firstName || user.email}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} data-testid="button-logout">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Status Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusInfo.color} border`}>
                <StatusIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-xl mb-2">{statusInfo.title}</h2>
                <p className="text-muted-foreground mb-4">{statusInfo.description}</p>
                
                {application.status === 'under_review' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Verification Progress</span>
                      <span className="text-sm text-muted-foreground">{verificationProgress}%</span>
                    </div>
                    <Progress value={verificationProgress} className="h-2" />
                  </div>
                )}
                
                {application.status === 'rejected' && application.rejectionReason && (
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Reason for Decision:</h4>
                    <p className="text-sm text-muted-foreground">{application.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Professional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium">Position:</span>
                <p className="text-sm text-muted-foreground">
                  {application.currentTitle} at {application.currentCompany}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Experience:</span>
                <p className="text-sm text-muted-foreground">
                  {application.yearsExperience} years
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Expertise:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {application.expertise?.slice(0, 3).map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {application.expertise?.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{application.expertise.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Work Email</span>
                {application.workEmailVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-600" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">LinkedIn Profile</span>
                {application.linkedinVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-600" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Background Check</span>
                {application.backgroundCheckStatus === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : application.backgroundCheckStatus === 'in_progress' ? (
                  <Clock className="w-4 h-4 text-yellow-600" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">References</span>
                {application.referencesContacted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-600" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Timeline */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Application Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">Application Submitted</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {application.status !== 'pending' && (
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  application.status === 'under_review' ? 'bg-blue-100 text-blue-600' :
                  application.status === 'approved' ? 'bg-green-100 text-green-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <StatusIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {application.status === 'under_review' ? 'Review Started' :
                     application.status === 'approved' ? 'Application Approved' :
                     'Application Decision'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {application.reviewedAt ? 
                      new Date(application.reviewedAt).toLocaleDateString() :
                      'In progress'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium mb-2">Questions about your application?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our team is here to help. We typically respond within 24 hours.
            </p>
            <Button variant="outline" size="sm" data-testid="button-contact-support">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}