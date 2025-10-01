import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PortfolioProject, FeaturedProject, Testimonial, PianoSample, LivePerformance } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const portfolioProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid URL"),
  technologies: z.string().min(1, "Technologies are required"),
  year: z.string().min(1, "Year is required"),
  featured: z.boolean().default(false),
  clientResults: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  order: z.string().default("0"),
});

const featuredProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid URL"),
  icon: z.string().min(1, "Icon class is required"),
  iconColor: z.string().min(1, "Icon color is required"),
  features: z.string().min(1, "Features are required"),
  technologies: z.string().min(1, "Technologies are required"),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  demoType: z.string().optional(),
  order: z.string().default("0"),
});

const adminCredentialsSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  content: z.string().min(1, "Content is required"),
  rating: z.string().default("5"),
  image: z.string().url().optional().or(z.literal("")),
  order: z.string().default("0"),
  isActive: z.boolean().default(true),
});

const pianoSampleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  audioUrl: z.string().url("Must be a valid audio URL"),
  duration: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  isOriginal: z.boolean().default(false),
  order: z.string().default("0"),
  isActive: z.boolean().default(true),
});

const livePerformanceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  videoUrl: z.string().url("Must be a valid video URL"),
  venue: z.string().min(1, "Venue is required"),
  performanceDate: z.string().optional(),
  order: z.string().default("0"),
  isActive: z.boolean().default(true),
});

type LoginData = z.infer<typeof loginSchema>;
type PortfolioProjectData = z.infer<typeof portfolioProjectSchema>;
type FeaturedProjectData = z.infer<typeof featuredProjectSchema>;
type AdminCredentialsData = z.infer<typeof adminCredentialsSchema>;
type TestimonialData = z.infer<typeof testimonialSchema>;
type PianoSampleData = z.infer<typeof pianoSampleSchema>;
type LivePerformanceData = z.infer<typeof livePerformanceSchema>;

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"portfolio" | "featured" | "testimonials" | "piano-samples" | "live-performances" | "credentials" | "site-customization">("portfolio");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [currentCredentials, setCurrentCredentials] = useState<LoginData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const portfolioForm = useForm<PortfolioProjectData>({
    resolver: zodResolver(portfolioProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      technologies: "",
      year: new Date().getFullYear().toString(),
      featured: false,
      clientResults: "",
      websiteUrl: "",
      order: "0",
    },
  });

  const credentialsForm = useForm<AdminCredentialsData>({
    resolver: zodResolver(adminCredentialsSchema),
    defaultValues: { username: "", password: "" },
  });

  const testimonialForm = useForm<TestimonialData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      role: "",
      company: "",
      content: "",
      rating: "5",
      image: "",
      order: "0",
      isActive: true,
    },
  });

  const pianoSampleForm = useForm<PianoSampleData>({
    resolver: zodResolver(pianoSampleSchema),
    defaultValues: {
      title: "",
      description: "",
      audioUrl: "",
      duration: "",
      category: "wedding",
      isOriginal: false,
      order: "0",
      isActive: true,
    },
  });

  const livePerformanceForm = useForm<LivePerformanceData>({
    resolver: zodResolver(livePerformanceSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      venue: "",
      performanceDate: "",
      order: "0",
      isActive: true,
    },
  });

  const featuredForm = useForm<FeaturedProjectData>({
    resolver: zodResolver(featuredProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      icon: "fas fa-code",
      iconColor: "from-blue-500 to-blue-600",
      features: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      demoType: "",
      order: "0",
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return apiRequest("POST", "/api/admin/login", data);
    },
    onSuccess: (response, variables) => {
      setIsLoggedIn(true);
      setCurrentCredentials(variables);  // Store credentials for authenticated requests
      toast({ title: "Login successful" });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Data fetching
  const { data: portfolioProjects = [] } = useQuery<PortfolioProject[]>({
    queryKey: ["/api/admin/portfolio"],
    enabled: isLoggedIn,
  });

  const { data: featuredProjects = [] } = useQuery<FeaturedProject[]>({
    queryKey: ["/api/admin/featured"],
    enabled: isLoggedIn,
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    enabled: isLoggedIn,
  });

  const { data: pianoSamples = [] } = useQuery<PianoSample[]>({
    queryKey: ["/api/piano-samples"],
    enabled: isLoggedIn,
  });

  const { data: livePerformances = [] } = useQuery<LivePerformance[]>({
    queryKey: ["/api/live-performances"],
    enabled: isLoggedIn,
  });

  // Portfolio mutations
  const createPortfolioMutation = useMutation({
    mutationFn: async (data: PortfolioProjectData) => {
      const payload = {
        ...data,
        technologies: data.technologies.split(',').map(t => t.trim()),
      };
      return apiRequest("POST", "/api/admin/portfolio", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] });
      portfolioForm.reset();
      toast({ title: "Portfolio project created" });
    },
  });

  const updatePortfolioMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PortfolioProjectData }) => {
      const payload = {
        ...data,
        technologies: data.technologies.split(',').map(t => t.trim()),
      };
      return apiRequest("PUT", `/api/admin/portfolio/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] });
      setEditingItem(null);
      portfolioForm.reset();
      toast({ title: "Portfolio project updated" });
    },
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/portfolio/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] });
      toast({ title: "Portfolio project deleted" });
    },
  });

  // Featured project mutations
  const createFeaturedMutation = useMutation({
    mutationFn: async (data: FeaturedProjectData) => {
      const payload = {
        ...data,
        features: data.features.split(',').map(f => f.trim()),
        technologies: data.technologies.split(',').map(t => t.trim()),
      };
      return apiRequest("POST", "/api/admin/featured", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/featured"] });
      featuredForm.reset();
      toast({ title: "Featured project created" });
    },
  });

  const updateFeaturedMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FeaturedProjectData }) => {
      const payload = {
        ...data,
        features: data.features.split(',').map(f => f.trim()),
        technologies: data.technologies.split(',').map(t => t.trim()),
      };
      return apiRequest("PUT", `/api/admin/featured/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/featured"] });
      setEditingItem(null);
      featuredForm.reset();
      toast({ title: "Featured project updated" });
    },
  });

  const deleteFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/featured/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/featured"] });
      toast({ title: "Featured project deleted" });
    },
  });

  // Testimonials mutations
  const createTestimonialMutation = useMutation({
    mutationFn: async (data: TestimonialData) => {
      if (!currentCredentials) throw new Error("Not authenticated");
      return apiRequest("POST", "/api/admin/testimonials", { ...data, ...currentCredentials });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      testimonialForm.reset();
      toast({ title: "Testimonial created" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TestimonialData }) => {
      if (!currentCredentials) throw new Error("Not authenticated");
      return apiRequest("PUT", `/api/admin/testimonials/${id}`, { ...data, ...currentCredentials });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setEditingItem(null);
      testimonialForm.reset();
      toast({ title: "Testimonial updated" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!currentCredentials) throw new Error("Not authenticated");
      return apiRequest("DELETE", `/api/admin/testimonials/${id}`, currentCredentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial deleted" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Piano samples mutations
  const createPianoSampleMutation = useMutation({
    mutationFn: async (data: PianoSampleData) => {
      if (!currentCredentials) throw new Error("Not authenticated");
      return apiRequest("POST", "/api/admin/piano-samples", { ...data, ...currentCredentials });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/piano-samples"] });
      pianoSampleForm.reset();
      toast({ title: "Piano sample created" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create piano sample",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePianoSampleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PianoSampleData }) => {
      if (!currentCredentials) throw new Error("Not authenticated");
      return apiRequest("PUT", `/api/admin/piano-samples/${id}`, { ...data, ...currentCredentials });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/piano-samples"] });
      setEditingItem(null);
      pianoSampleForm.reset();
      toast({ title: "Piano sample updated" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update piano sample",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePianoSampleMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!currentCredentials) throw new Error("Not authenticated");
      return apiRequest("DELETE", `/api/admin/piano-samples/${id}`, currentCredentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/piano-samples"] });
      toast({ title: "Piano sample deleted" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete piano sample",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Live performances mutations
  const createLivePerformanceMutation = useMutation({
    mutationFn: async (data: LivePerformanceData) => {
      if (!currentCredentials) throw new Error("Not authenticated");
      return apiRequest("POST", "/api/admin/live-performances", { ...data, ...currentCredentials });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/live-performances"] });
      livePerformanceForm.reset();
      toast({ title: "Live performance created" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create live performance",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateLivePerformanceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LivePerformanceData }) => {
      if (!currentCredentials) throw new Error("Not authenticated");
      return apiRequest("PUT", `/api/admin/live-performances/${id}`, { ...data, ...currentCredentials });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/live-performances"] });
      setEditingItem(null);
      livePerformanceForm.reset();
      toast({ title: "Live performance updated" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update live performance",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteLivePerformanceMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!currentCredentials) throw new Error("Not authenticated");
      return apiRequest("DELETE", `/api/admin/live-performances/${id}`, currentCredentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/live-performances"] });
      toast({ title: "Live performance deleted" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete live performance",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Admin credentials queries and mutations
  const { data: adminCredentials } = useQuery({
    queryKey: ["/api/admin/credentials"],
    enabled: isLoggedIn,
  });

  const updateCredentialsMutation = useMutation({
    mutationFn: async (data: AdminCredentialsData) => {
      return apiRequest("PUT", "/api/admin/credentials", data);
    },
    onSuccess: () => {
      credentialsForm.reset();
      toast({ title: "Admin credentials updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update credentials",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentCredentials(null);
    setActiveTab("portfolio");
    setEditingItem(null);
    loginForm.reset();
  };

  const onCredentialsSubmit = (data: AdminCredentialsData) => {
    updateCredentialsMutation.mutate(data);
  };

  const onPortfolioSubmit = (data: PortfolioProjectData) => {
    if (editingItem) {
      updatePortfolioMutation.mutate({ id: editingItem, data });
    } else {
      createPortfolioMutation.mutate(data);
    }
  };

  const onFeaturedSubmit = (data: FeaturedProjectData) => {
    if (editingItem) {
      updateFeaturedMutation.mutate({ id: editingItem, data });
    } else {
      createFeaturedMutation.mutate(data);
    }
  };

  const onTestimonialSubmit = (data: TestimonialData) => {
    if (editingItem) {
      updateTestimonialMutation.mutate({ id: editingItem, data });
    } else {
      createTestimonialMutation.mutate(data);
    }
  };

  const onPianoSampleSubmit = (data: PianoSampleData) => {
    if (editingItem) {
      updatePianoSampleMutation.mutate({ id: editingItem, data });
    } else {
      createPianoSampleMutation.mutate(data);
    }
  };

  const editPortfolioProject = (project: PortfolioProject) => {
    setEditingItem(project.id);
    portfolioForm.reset({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies.join(', '),
      year: project.year,
      featured: project.featured,
      clientResults: project.clientResults || "",
      websiteUrl: project.websiteUrl || "",
      order: project.order || "0",
    });
  };

  const editFeaturedProject = (project: FeaturedProject) => {
    setEditingItem(project.id);
    featuredForm.reset({
      title: project.title,
      description: project.description,
      image: project.image,
      icon: project.icon,
      iconColor: project.iconColor,
      features: project.features.join(', '),
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      demoType: project.demoType || "",
      order: project.order || "0",
    });
  };

  const editTestimonial = (testimonial: Testimonial) => {
    setEditingItem(testimonial.id);
    testimonialForm.reset({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image || "",
      order: testimonial.order || "0",
      isActive: testimonial.isActive !== false,
    });
  };

  const editPianoSample = (sample: PianoSample) => {
    setEditingItem(sample.id);
    pianoSampleForm.reset({
      title: sample.title,
      description: sample.description,
      audioUrl: sample.audioUrl,
      duration: sample.duration || "",
      category: sample.category,
  isOriginal: !!sample.isOriginal,
      order: sample.order || "0",
      isActive: sample.isActive !== false,
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-gold-400 mb-6 text-center">Admin Login</h1>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Username</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="bg-gray-700 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-gold-500 hover:bg-gold-600 text-gray-900"
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gold-400">Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-gray-300 border-gray-600 hover:bg-gray-800"
          >
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "portfolio"
                    ? "border-gold-400 text-gold-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Portfolio Projects
              </button>
              <button
                onClick={() => setActiveTab("featured")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "featured"
                    ? "border-gold-400 text-gold-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Featured Projects
              </button>
              <button
                onClick={() => setActiveTab("testimonials")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "testimonials"
                    ? "border-gold-400 text-gold-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Testimonials
              </button>
              <button
                onClick={() => setActiveTab("piano-samples")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "piano-samples"
                    ? "border-gold-400 text-gold-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Piano Samples
              </button>
              <button
                onClick={() => setActiveTab("live-performances")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "live-performances"
                    ? "border-gold-400 text-gold-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Live Performances
              </button>
              <button
                onClick={() => setActiveTab("credentials")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "credentials"
                    ? "border-gold-400 text-gold-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Login Settings
              </button>
              <a
                href="/admin/site-customization"
                className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-400 hover:text-gray-300 hover:border-gold-400 transition-all duration-200"
              >
                🎨 Site Customization
              </a>
            </nav>
          </div>
        </div>

        {activeTab === "portfolio" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Portfolio Form */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingItem ? "Edit Portfolio Project" : "Add Portfolio Project"}
              </h2>
              <Form {...portfolioForm}>
                <form onSubmit={portfolioForm.handleSubmit(onPortfolioSubmit)} className="space-y-4">
                  <FormField
                    control={portfolioForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={portfolioForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-gray-700 border-gray-600 text-white" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={portfolioForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={portfolioForm.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Technologies (comma-separated)</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={portfolioForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Year</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={portfolioForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Order</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={portfolioForm.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 mt-8">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="text-white">Featured</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={portfolioForm.control}
                    name="clientResults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Client Results (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={portfolioForm.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Website URL (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" placeholder="https://example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      disabled={createPortfolioMutation.isPending || updatePortfolioMutation.isPending}
                      className="bg-gold-500 hover:bg-gold-600 text-gray-900"
                    >
                      {editingItem ? "Update" : "Create"}
                    </Button>
                    {editingItem && (
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          portfolioForm.reset();
                        }}
                        variant="outline"
                        className="text-gray-300 border-gray-600"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>

            {/* Portfolio List */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Portfolio Projects</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {portfolioProjects.map((project) => (
                  <div key={project.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{project.title}</h3>
                        <p className="text-gray-300 text-sm">{project.year} • {project.technologies.join(', ')}</p>
                        {project.websiteUrl && (
                          <a 
                            href={project.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gold-400 text-xs hover:underline block mt-1"
                          >
                            🔗 Visit Website
                          </a>
                        )}
                        {project.featured && (
                          <span className="inline-block bg-gold-500 text-gray-900 text-xs px-2 py-1 rounded mt-2">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => editPortfolioProject(project)}
                          size="sm"
                          variant="outline"
                          className="text-gray-300 border-gray-600"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deletePortfolioMutation.mutate(project.id)}
                          size="sm"
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "featured" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Featured Form */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingItem ? "Edit Featured Project" : "Add Featured Project"}
              </h2>
              <Form {...featuredForm}>
                <form onSubmit={featuredForm.handleSubmit(onFeaturedSubmit)} className="space-y-4">
                  <FormField
                    control={featuredForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={featuredForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-gray-700 border-gray-600 text-white" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={featuredForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={featuredForm.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Icon Class</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={featuredForm.control}
                      name="iconColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Icon Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="from-blue-500 to-blue-600">Blue</SelectItem>
                              <SelectItem value="from-purple-500 to-purple-600">Purple</SelectItem>
                              <SelectItem value="from-red-500 to-red-600">Red</SelectItem>
                              <SelectItem value="from-green-500 to-green-600">Green</SelectItem>
                              <SelectItem value="from-gold-500 to-gold-600">Gold</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={featuredForm.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Features (comma-separated)</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-gray-700 border-gray-600 text-white" rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={featuredForm.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Technologies (comma-separated)</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={featuredForm.control}
                      name="githubUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">GitHub URL</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={featuredForm.control}
                      name="liveUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Live URL</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={featuredForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Order</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={featuredForm.control}
                    name="demoType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Demo Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select demo type..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="demo">Live Demo</SelectItem>
                            <SelectItem value="download">Download</SelectItem>
                            <SelectItem value="game">Play Game</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      disabled={createFeaturedMutation.isPending || updateFeaturedMutation.isPending}
                      className="bg-gold-500 hover:bg-gold-600 text-gray-900"
                    >
                      {editingItem ? "Update" : "Create"}
                    </Button>
                    {editingItem && (
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          featuredForm.reset();
                        }}
                        variant="outline"
                        className="text-gray-300 border-gray-600"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>

            {/* Featured List */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Featured Projects</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{project.title}</h3>
                        <p className="text-gray-300 text-sm">{project.technologies.join(', ')}</p>
                        <p className="text-gray-400 text-xs mt-1">Order: {project.order}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => editFeaturedProject(project)}
                          size="sm"
                          variant="outline"
                          className="text-gray-300 border-gray-600"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteFeaturedMutation.mutate(project.id)}
                          size="sm"
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "testimonials" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Testimonial Form */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingItem ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <Form {...testimonialForm}>
                <form onSubmit={testimonialForm.handleSubmit(onTestimonialSubmit)} className="space-y-4">
                  <FormField
                    control={testimonialForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={testimonialForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Role</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={testimonialForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Company</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={testimonialForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Content</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-gray-700 border-gray-600 text-white" rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={testimonialForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Rating</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5 Stars</SelectItem>
                                <SelectItem value="4">4 Stars</SelectItem>
                                <SelectItem value="3">3 Stars</SelectItem>
                                <SelectItem value="2">2 Stars</SelectItem>
                                <SelectItem value="1">1 Star</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={testimonialForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Order</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={testimonialForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 mt-8">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="text-white">Active</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={testimonialForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Image URL (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" placeholder="https://example.com/image.jpg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
                      className="bg-gold-500 hover:bg-gold-600 text-gray-900"
                    >
                      {editingItem ? "Update Testimonial" : "Add Testimonial"}
                    </Button>
                    {editingItem && (
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          testimonialForm.reset();
                        }}
                        variant="outline"
                        className="text-gray-300 border-gray-600 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>

            {/* Testimonials List */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Testimonials</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gold-400">{testimonial.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => editTestimonial(testimonial)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deleteTestimonialMutation.mutate(testimonial.id)}
                          disabled={deleteTestimonialMutation.isPending}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{testimonial.role} at {testimonial.company}</p>
                    <p className="text-gray-400 text-sm mt-2">{testimonial.content.slice(0, 100)}...</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gold-400">Rating: {testimonial.rating}/5</span>
                      <span className={`text-sm ${testimonial.isActive ? 'text-green-400' : 'text-red-400'}`}>
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "piano-samples" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Piano Sample Form */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingItem ? "Edit Piano Sample" : "Add Piano Sample"}
              </h2>
              <Form {...pianoSampleForm}>
                <form onSubmit={pianoSampleForm.handleSubmit(onPianoSampleSubmit)} className="space-y-4">
                  <FormField
                    control={pianoSampleForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={pianoSampleForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-gray-700 border-gray-600 text-white" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={pianoSampleForm.control}
                    name="audioUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Audio URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" placeholder="https://example.com/audio.mp3" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={pianoSampleForm.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Duration (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" placeholder="3:45" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pianoSampleForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="wedding">Wedding</SelectItem>
                              <SelectItem value="worship">Worship</SelectItem>
                              <SelectItem value="classical">Classical</SelectItem>
                              <SelectItem value="original">Original</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={pianoSampleForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Order</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pianoSampleForm.control}
                      name="isOriginal"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 mt-8">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="text-white">Self-Made</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pianoSampleForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 mt-8">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="text-white">Active</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={createPianoSampleMutation.isPending || updatePianoSampleMutation.isPending}
                      className="bg-gold-500 hover:bg-gold-600 text-gray-900"
                    >
                      {editingItem ? "Update Sample" : "Add Sample"}
                    </Button>
                    {editingItem && (
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          pianoSampleForm.reset();
                        }}
                        variant="outline"
                        className="text-gray-300 border-gray-600 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>

            {/* Piano Samples List */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Piano Samples ({pianoSamples.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pianoSamples.map((sample) => (
                  <div key={sample.id} className="p-4 border border-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-white">{sample.title}</h3>
                        <p className="text-sm text-gray-400">Category: {sample.category}</p>
                        {sample.duration && <p className="text-sm text-gray-400">Duration: {sample.duration}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => editPianoSample(sample)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deletePianoSampleMutation.mutate(sample.id)}
                          disabled={deletePianoSampleMutation.isPending}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{sample.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className={`${sample.isOriginal ? 'text-gold-400' : 'text-blue-400'}`}>
                        {sample.isOriginal ? '🎹 Self-Made Recording' : '🎵 Performance Sample'}
                      </span>
                      <span className={`${sample.isActive ? 'text-green-400' : 'text-red-400'}`}>
                        {sample.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "live-performances" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Live Performance Form */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingItem ? "Edit Live Performance" : "Add Live Performance"}
              </h2>
              <Form {...livePerformanceForm}>
                <form onSubmit={livePerformanceForm.handleSubmit((data) => {
                  if (editingItem) {
                    updateLivePerformanceMutation.mutate({ id: editingItem, data });
                  } else {
                    createLivePerformanceMutation.mutate(data);
                  }
                })} className="space-y-4">
                  <FormField
                    control={livePerformanceForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={livePerformanceForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-gray-700 border-gray-600 text-white" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={livePerformanceForm.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Video URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" placeholder="https://youtube.com/watch?v=..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={livePerformanceForm.control}
                      name="venue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Venue</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" placeholder="Church, Event Hall, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={livePerformanceForm.control}
                      name="performanceDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Performance Date (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" placeholder="2024-01-15" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={livePerformanceForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Order</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={livePerformanceForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 mt-8">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="text-white">Active</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={createLivePerformanceMutation.isPending || updateLivePerformanceMutation.isPending}
                      className="bg-gold-500 hover:bg-gold-600 text-gray-900"
                    >
                      {editingItem ? "Update Performance" : "Add Performance"}
                    </Button>
                    {editingItem && (
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          livePerformanceForm.reset();
                        }}
                        variant="outline"
                        className="text-white border-gray-600"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>

            {/* Live Performances List */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Live Performances</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {livePerformances.map((performance) => (
                  <div key={performance.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-white">
                          <a 
                            href={performance.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-gold-400 transition-colors"
                          >
                            {performance.title}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-400">
                          {performance.venue}
                          {performance.performanceDate && ` • ${performance.performanceDate}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingItem(performance.id);
                            livePerformanceForm.reset({
                              title: performance.title,
                              description: performance.description,
                              videoUrl: performance.videoUrl,
                              venue: performance.venue,
                              performanceDate: performance.performanceDate || "",
                              order: String(performance.order ?? '0'),
                              isActive: !!performance.isActive,
                            });
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deleteLivePerformanceMutation.mutate(performance.id)}
                          disabled={deleteLivePerformanceMutation.isPending}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{performance.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-purple-400">🎬 Live Performance</span>
                      <span className={`${performance.isActive ? 'text-green-400' : 'text-red-400'}`}>
                        {performance.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "credentials" && (
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Admin Login Settings</h2>
              <p className="text-gray-300 mb-6 text-sm">
                Change your admin username and password. You'll need to log in again after updating.
              </p>
              <Form {...credentialsForm}>
                <form onSubmit={credentialsForm.handleSubmit(onCredentialsSubmit)} className="space-y-4">
                  <FormField
                    control={credentialsForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">New Username</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={credentialsForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">New Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" className="bg-gray-700 border-gray-600 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={updateCredentialsMutation.isPending}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-gray-900"
                  >
                    {updateCredentialsMutation.isPending ? "Updating..." : "Update Login Credentials"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}