import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  User, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, 
  Briefcase, GraduationCap, Users, Clock, Star, 
  FileText, Shield, Linkedin, Mail, Phone, Plus, X 
} from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
}

interface MentorApplicationProps {
  user: User;
  onLogout: () => void;
}

// Form validation schema
const mentorApplicationSchema = z.object({
  // Professional Information
  currentTitle: z.string().min(2, "Current title is required"),
  currentCompany: z.string().min(2, "Current company is required"),
  workEmail: z.string().email("Valid work email is required"),
  linkedinProfile: z.string().url("Valid LinkedIn URL is required").optional().or(z.literal("")),
  yearsExperience: z.number().min(1, "Minimum 1 year of experience required"),
  expertise: z.array(z.string()).min(1, "Select at least one area of expertise"),
  industries: z.array(z.string()).min(1, "Select at least one industry"),
  
  // Education
  education: z.object({
    degree: z.string().min(2, "Degree is required"),
    institution: z.string().min(2, "Institution is required"),
    year: z.number().min(1980).max(new Date().getFullYear()),
    field: z.string().min(2, "Field of study is required"),
  }),
  
  // Work History
  workHistory: z.array(z.object({
    title: z.string().min(2, "Job title is required"),
    company: z.string().min(2, "Company is required"),
    years: z.string().min(2, "Years is required"),
    description: z.string().min(10, "Job description is required"),
  })).min(1, "Add at least one work experience"),
  
  // Certifications (optional)
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    year: z.number(),
    credentialId: z.string().optional(),
  })).optional(),
  
  // Mentoring Information
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  mentoringExperience: z.string().optional(),
  mentoringMotivation: z.string().min(30, "Please explain your motivation"),
  availabilityHours: z.number().min(1).max(20, "Availability must be between 1-20 hours per week"),
  preferredCategories: z.array(z.string()).min(1, "Select at least one category"),
  
  // References
  references: z.array(z.object({
    name: z.string().min(2, "Reference name is required"),
    title: z.string().min(2, "Reference title is required"),
    company: z.string().min(2, "Reference company is required"),
    email: z.string().email("Valid email is required"),
    relationship: z.string().min(2, "Relationship is required"),
  })).min(2, "Please provide at least 2 references"),
});

type MentorApplicationForm = z.infer<typeof mentorApplicationSchema>;

const expertiseOptions = [
  "Software Engineering", "Product Management", "Data Science", "Machine Learning",
  "Cybersecurity", "DevOps", "Mobile Development", "Web Development",
  "Leadership", "Management", "Strategy", "Marketing", "Sales", "Finance",
  "Operations", "Human Resources", "Legal", "Consulting", "Entrepreneurship"
];

const industryOptions = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Media", "Government", "Non-profit", "Consulting", "Energy",
  "Transportation", "Real Estate", "Entertainment", "Aerospace"
];

const categoryOptions = [
  "career", "confidence", "leadership", "technical", "personal"
];

export default function MentorApplication({ user, onLogout }: MentorApplicationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  
  const form = useForm<MentorApplicationForm>({
    resolver: zodResolver(mentorApplicationSchema),
    defaultValues: {
      workEmail: user.email || "",
      expertise: [],
      industries: [],
      workHistory: [{ title: "", company: "", years: "", description: "" }],
      certifications: [],
      preferredCategories: [],
      references: [
        { name: "", title: "", company: "", email: "", relationship: "" },
        { name: "", title: "", company: "", email: "", relationship: "" }
      ]
    }
  });
  
  const { fields: workHistoryFields, append: appendWorkHistory, remove: removeWorkHistory } = useFieldArray({
    control: form.control,
    name: "workHistory"
  });
  
  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
    control: form.control,
    name: "certifications"
  });
  
  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({
    control: form.control,
    name: "references"
  });
  
  const submitApplication = useMutation({
    mutationFn: async (data: MentorApplicationForm) => {
      const response = await apiRequest("POST", "/api/mentors/apply", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "Thank you for applying. We'll review your application and get back to you within 5-7 business days."
      });
      onComplete();
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting application",
        description: error.message,
        variant: "destructive"
      });
    },
  });
  
  const steps = [
    { id: "professional", title: "Professional Info", icon: Briefcase },
    { id: "education", title: "Education & Experience", icon: GraduationCap },
    { id: "mentoring", title: "Mentoring Details", icon: Users },
    { id: "references", title: "References", icon: Shield },
    { id: "review", title: "Review & Submit", icon: CheckCircle }
  ];
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  const nextStep = async () => {
    const stepFields = getStepFields(currentStep);
    const isStepValid = await form.trigger(stepFields);
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  const getStepFields = (step: number): (keyof MentorApplicationForm)[] => {
    switch (step) {
      case 0: return ['currentTitle', 'currentCompany', 'workEmail', 'linkedinProfile', 'yearsExperience', 'expertise', 'industries'];
      case 1: return ['education', 'workHistory'];
      case 2: return ['bio', 'mentoringExperience', 'mentoringMotivation', 'availabilityHours', 'preferredCategories'];
      case 3: return ['references'];
      default: return [];
    }
  };
  
  const onSubmit = (data: MentorApplicationForm) => {
    submitApplication.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Become a Mentor</h1>
                <p className="text-sm text-muted-foreground">
                  Help shape the next generation of professionals
                </p>
              </div>
            </div>
            <Badge variant="secondary">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-primary text-primary-foreground' :
                    isActive ? 'bg-primary/20 text-primary border-2 border-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium text-center ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step Content */}
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Professional Information
                  </CardTitle>
                  <CardDescription>
                    Tell us about your current role and professional background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Job Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Senior Software Engineer" {...field} data-testid="input-current-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="currentCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Company *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Google, Microsoft" {...field} data-testid="input-current-company" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="workEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="your.name@company.com" 
                              {...field} 
                              data-testid="input-work-email"
                            />
                          </FormControl>
                          <FormDescription>
                            We'll verify this matches your company domain
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="linkedinProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://linkedin.com/in/yourprofile" 
                              {...field} 
                              data-testid="input-linkedin"
                            />
                          </FormControl>
                          <FormDescription>
                            Optional but recommended for verification
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="yearsExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Professional Experience *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="50" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-years-experience"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expertise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Areas of Expertise *</FormLabel>
                        <FormDescription>
                          Select all that apply
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {expertiseOptions.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox 
                                checked={field.value?.includes(option)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, option]);
                                  } else {
                                    field.onChange(field.value?.filter(v => v !== option));
                                  }
                                }}
                                data-testid={`checkbox-expertise-${option.toLowerCase().replace(/\s+/g, '-')}`}
                              />
                              <Label className="text-sm">{option}</Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="industries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industries *</FormLabel>
                        <FormDescription>
                          Select industries you have experience in
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {industryOptions.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox 
                                checked={field.value?.includes(option)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, option]);
                                  } else {
                                    field.onChange(field.value?.filter(v => v !== option));
                                  }
                                }}
                                data-testid={`checkbox-industry-${option.toLowerCase().replace(/\s+/g, '-')}`}
                              />
                              <Label className="text-sm">{option}</Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
            
            {/* Step 2: Education & Experience */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education & Experience
                  </CardTitle>
                  <CardDescription>
                    Share your educational background and work history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Education */}
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="education.degree"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Degree *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Bachelor of Science" {...field} data-testid="input-degree" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="education.institution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Stanford University" {...field} data-testid="input-institution" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="education.year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Graduation Year *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1980" 
                                max={new Date().getFullYear()} 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                                data-testid="input-graduation-year"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="education.field"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field of Study *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Computer Science" {...field} data-testid="input-field-of-study" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Work History */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Work History</h3>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => appendWorkHistory({ title: "", company: "", years: "", description: "" })}
                        data-testid="button-add-work-history"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                    
                    {workHistoryFields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4 mb-4 relative">
                        {workHistoryFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWorkHistory(index)}
                            className="absolute top-2 right-2"
                            data-testid={`button-remove-work-history-${index}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name={`workHistory.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title *</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid={`input-work-title-${index}`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`workHistory.${index}.company`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company *</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid={`input-work-company-${index}`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="mb-4">
                          <FormField
                            control={form.control}
                            name={`workHistory.${index}.years`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 2020-2023 or 2020-Present" {...field} data-testid={`input-work-years-${index}`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`workHistory.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Description *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your key responsibilities and achievements..."
                                  rows={3}
                                  {...field} 
                                  data-testid={`textarea-work-description-${index}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 3: Mentoring Details */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Mentoring Details
                  </CardTitle>
                  <CardDescription>
                    Tell us about your mentoring approach and availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Bio *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write a compelling bio that highlights your expertise and what makes you a great mentor..."
                            rows={5}
                            {...field} 
                            data-testid="textarea-bio"
                          />
                        </FormControl>
                        <FormDescription>
                          This will be shown to potential mentees (minimum 50 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mentoringExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Mentoring Experience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe any formal or informal mentoring experience you've had..."
                            rows={3}
                            {...field} 
                            data-testid="textarea-mentoring-experience"
                          />
                        </FormControl>
                        <FormDescription>
                          Optional - include formal programs, team leadership, or informal mentoring
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mentoringMotivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why do you want to be a mentor? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your motivation for mentoring and what you hope to achieve..."
                            rows={4}
                            {...field} 
                            data-testid="textarea-mentoring-motivation"
                          />
                        </FormControl>
                        <FormDescription>
                          Help us understand your commitment and passion for mentoring
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="availabilityHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Availability (hours) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="20" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-availability-hours"
                          />
                        </FormControl>
                        <FormDescription>
                          How many hours per week can you dedicate to mentoring? (1-20 hours)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferredCategories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Mentoring Categories *</FormLabel>
                        <FormDescription>
                          Select the areas where you'd like to provide guidance
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {categoryOptions.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox 
                                checked={field.value?.includes(option)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, option]);
                                  } else {
                                    field.onChange(field.value?.filter(v => v !== option));
                                  }
                                }}
                                data-testid={`checkbox-category-${option}`}
                              />
                              <Label className="text-sm capitalize">{option}</Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
            
            {/* Step 4: References */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Professional References
                  </CardTitle>
                  <CardDescription>
                    Provide references who can vouch for your professional expertise and character
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Please provide at least 2 professional references. We may contact them as part of our verification process.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => appendReference({ name: "", title: "", company: "", email: "", relationship: "" })}
                      data-testid="button-add-reference"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Reference
                    </Button>
                  </div>
                  
                  {referenceFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-6 relative">
                      {referenceFields.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReference(index)}
                          className="absolute top-2 right-2"
                          data-testid={`button-remove-reference-${index}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <h4 className="font-medium mb-4">Reference {index + 1}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`references.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid={`input-reference-name-${index}`} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`references.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid={`input-reference-title-${index}`} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`references.${index}.company`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid={`input-reference-company-${index}`} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`references.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} data-testid={`input-reference-email-${index}`} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name={`references.${index}.relationship`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Former Manager, Colleague, Direct Report" {...field} data-testid={`input-reference-relationship-${index}`} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            {/* Step 5: Review & Submit */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Review & Submit
                  </CardTitle>
                  <CardDescription>
                    Please review your application before submitting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Application Summary</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Professional Info</h4>
                        <p className="text-sm text-muted-foreground">
                          {form.watch('currentTitle')} at {form.watch('currentCompany')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {form.watch('yearsExperience')} years experience
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-1">
                          {form.watch('expertise')?.slice(0, 3).map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {(form.watch('expertise')?.length || 0) > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(form.watch('expertise')?.length || 0) - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Availability</h4>
                        <p className="text-sm text-muted-foreground">
                          {form.watch('availabilityHours')} hours per week
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">References</h4>
                        <p className="text-sm text-muted-foreground">
                          {form.watch('references')?.length || 0} professional references provided
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        We'll review your application within 5-7 business days
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        We may contact your references for verification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        You'll receive an email update on your application status
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        If approved, you'll gain access to the mentor dashboard
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep} 
                disabled={currentStep === 0}
                data-testid="button-previous"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={submitApplication.isPending}
                  data-testid="button-submit-application"
                >
                  {submitApplication.isPending ? 'Submitting...' : 'Submit Application'}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}