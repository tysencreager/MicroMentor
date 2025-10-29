import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle, XCircle, Clock, Shield, User, Mail, Briefcase,
  GraduationCap, Star, AlertCircle, FileText, ExternalLink,
  ThumbsUp, ThumbsDown, Eye, MessageSquare
} from "lucide-react";

interface MentorApplication {
  id: string;
  userId: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  currentTitle: string;
  currentCompany: string;
  workEmail: string;
  linkedinProfile?: string;
  yearsExperience: number;
  expertise: string[];
  industries: string[];
  education: {
    degree: string;
    institution: string;
    year: number;
    field: string;
  };
  workHistory: Array<{
    title: string;
    company: string;
    years: string;
    description: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: number;
    credentialId?: string;
  }>;
  bio: string;
  mentoringExperience?: string;
  mentoringMotivation: string;
  availabilityHours: number;
  preferredCategories: string[];
  references: Array<{
    name: string;
    title: string;
    company: string;
    email: string;
    relationship: string;
  }>;
  workEmailVerified: boolean;
  linkedinVerified: boolean;
  backgroundCheckStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  referencesContacted: boolean;
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  // Fetch all applications - You'll need to add this endpoint
  const { data: applications = [], isLoading } = useQuery<MentorApplication[]>({
    queryKey: ["/api/admin/applications"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      return apiRequest(`/api/mentors/application/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, adminNotes: notes }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
      setDialogOpen(false);
      setSelectedApplication(null);
      setAdminNotes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    },
  });

  const handleAction = (application: MentorApplication, type: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setActionType(type);
    setAdminNotes(application.adminNotes || "");
    setDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedApplication || !actionType) return;

    const status = actionType === 'approve' ? 'approved' : 'rejected';
    updateStatusMutation.mutate({
      id: selectedApplication.id,
      status,
      notes: adminNotes,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
      under_review: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Under Review" },
      approved: { color: "bg-green-100 text-green-800 border-green-200", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
    };

    const variant = variants[status] || variants.pending;
    return (
      <Badge className={`${variant.color} border`}>
        {variant.label}
      </Badge>
    );
  };

  const filterApplications = (status?: string) => {
    if (!status) return applications;
    return applications.filter(app => app.status === status);
  };

  const pendingCount = filterApplications('pending').length;
  const underReviewCount = filterApplications('under_review').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground font-display">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Mentor Application Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <p className="text-sm font-medium">{user.firstName || user.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Applications</p>
                  <p className="text-3xl font-display font-semibold">{applications.length}</p>
                </div>
                <FileText className="w-8 h-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated border-yellow-200 bg-yellow-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-800 mb-1">Pending Review</p>
                  <p className="text-3xl font-display font-semibold text-yellow-900">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800 mb-1">Under Review</p>
                  <p className="text-3xl font-display font-semibold text-blue-900">{underReviewCount}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-600/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 mb-1">Approved</p>
                  <p className="text-3xl font-display font-semibold text-green-900">
                    {filterApplications('approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Applications</CardTitle>
            <CardDescription>Review and manage mentor applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="pending">
                  Pending {pendingCount > 0 && `(${pendingCount})`}
                </TabsTrigger>
                <TabsTrigger value="under_review">
                  Under Review {underReviewCount > 0 && `(${underReviewCount})`}
                </TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              {(['pending', 'under_review', 'approved', 'rejected'] as const).map((status) => (
                <TabsContent key={status} value={status} className="space-y-4">
                  {filterApplications(status).length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">No {status.replace('_', ' ')} applications</p>
                    </div>
                  ) : (
                    filterApplications(status).map((app) => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        onAction={handleAction}
                        setSelectedApplication={setSelectedApplication}
                      />
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Application
            </DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <>
                  {selectedApplication.currentTitle} at {selectedApplication.currentCompany}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-notes">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={actionType === 'reject' ? "Explain why this application was rejected..." : "Add any notes about this approval..."}
                rows={4}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={updateStatusMutation.isPending}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {updateStatusMutation.isPending ? 'Processing...' : `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      {selectedApplication && !dialogOpen && (
        <ApplicationDetailsDialog
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}

// Application Card Component
function ApplicationCard({
  application,
  onAction,
  setSelectedApplication
}: {
  application: MentorApplication;
  onAction: (app: MentorApplication, type: 'approve' | 'reject') => void;
  setSelectedApplication: (app: MentorApplication) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{application.currentTitle}</h3>
                <p className="text-sm text-muted-foreground">{application.currentCompany}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Experience</p>
                <p className="font-medium">{application.yearsExperience} years</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Availability</p>
                <p className="font-medium">{application.availabilityHours} hrs/week</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground mb-1">Expertise</p>
                <div className="flex flex-wrap gap-1">
                  {application.expertise.slice(0, 2).map((exp) => (
                    <Badge key={exp} variant="outline" className="text-xs">
                      {exp}
                    </Badge>
                  ))}
                  {application.expertise.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{application.expertise.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {new Date(application.createdAt).toLocaleDateString()}
            </Badge>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedApplication(application)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              {application.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onAction(application, 'approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAction(application, 'reject')}
                    variant="destructive"
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Application Details Dialog Component
function ApplicationDetailsDialog({
  application,
  onClose
}: {
  application: MentorApplication;
  onClose: () => void;
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Professional Info */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-3">Professional Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Title</p>
                <p className="font-medium">{application.currentTitle}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Company</p>
                <p className="font-medium">{application.currentCompany}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Work Email</p>
                <p className="font-medium">{application.workEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Experience</p>
                <p className="font-medium">{application.yearsExperience} years</p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-3">Education</h3>
            <p className="text-sm">
              <strong>{application.education.degree}</strong> in {application.education.field}
              <br />
              {application.education.institution}, {application.education.year}
            </p>
          </div>

          {/* Bio */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-3">Bio</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{application.bio}</p>
          </div>

          {/* Motivation */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-3">Mentoring Motivation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{application.mentoringMotivation}</p>
          </div>

          {/* Work History */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-3">Work History</h3>
            <div className="space-y-3">
              {application.workHistory.map((work, idx) => (
                <div key={idx} className="border-l-2 border-primary pl-4">
                  <p className="font-medium">{work.title} at {work.company}</p>
                  <p className="text-xs text-muted-foreground mb-1">{work.years}</p>
                  <p className="text-sm text-muted-foreground">{work.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* References */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-3">References</h3>
            <div className="space-y-2">
              {application.references.map((ref, idx) => (
                <div key={idx} className="text-sm p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">{ref.name}</p>
                  <p className="text-muted-foreground">{ref.title} at {ref.company}</p>
                  <p className="text-xs text-muted-foreground">{ref.email} • {ref.relationship}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
