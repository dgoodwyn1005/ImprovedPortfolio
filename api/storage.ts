// api/storage.ts
import { supabase } from "./db.js";
import type { 
  User, 
  InsertUser, 
  ContactMessage, 
  InsertContactMessage, 
  PortfolioProject, 
  InsertPortfolioProject, 
  FeaturedProject, 
  InsertFeaturedProject, 
  SiteSettings, 
  InsertSiteSettings, 
  AdminCredentials, 
  InsertAdminCredentials, 
  Testimonial, 
  InsertTestimonial, 
  PianoSample, 
  InsertPianoSample, 
  LivePerformance, 
  InsertLivePerformance, 
  Service, 
  InsertService, 
  Lead, 
  InsertLead, 
  Order, 
  InsertOrder, 
  Media, 
  InsertMedia, 
  SiteConfig, 
  InsertSiteConfig, 
  PageContent, 
  InsertPageContent, 
  ThemeConfig, 
  InsertThemeConfig 
} from "../shared/schema.js";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  getPortfolioProjects(): Promise<PortfolioProject[]>;
  createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject>;
  updatePortfolioProject(id: string, project: Partial<InsertPortfolioProject>): Promise<PortfolioProject>;
  deletePortfolioProject(id: string): Promise<void>;
  
  getFeaturedProjects(): Promise<FeaturedProject[]>;
  createFeaturedProject(project: InsertFeaturedProject): Promise<FeaturedProject>;
  updateFeaturedProject(id: string, project: Partial<InsertFeaturedProject>): Promise<FeaturedProject>;
  deleteFeaturedProject(id: string): Promise<void>;
  
  getSiteSettings(): Promise<SiteSettings[]>;
  updateSiteSettings(key: string, value: any): Promise<SiteSettings>;
  
  getAdminCredentials(): Promise<AdminCredentials | undefined>;
  updateAdminCredentials(credentials: InsertAdminCredentials): Promise<AdminCredentials>;
  
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;
  
  getPianoSamples(): Promise<PianoSample[]>;
  createPianoSample(sample: InsertPianoSample): Promise<PianoSample>;
  updatePianoSample(id: string, sample: Partial<InsertPianoSample>): Promise<PianoSample>;
  deletePianoSample(id: string): Promise<void>;
  
  getLivePerformances(): Promise<LivePerformance[]>;
  createLivePerformance(performance: InsertLivePerformance): Promise<LivePerformance>;
  updateLivePerformance(id: string, performance: Partial<InsertLivePerformance>): Promise<LivePerformance>;
  deleteLivePerformance(id: string): Promise<void>;

  getServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead>;
  deleteLead(id: string): Promise<void>;

  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order>;
  deleteOrder(id: string): Promise<void>;

  getMediaFiles(): Promise<Media[]>;
  getMediaFile(id: string): Promise<Media | undefined>;
  createMediaFile(media: InsertMedia): Promise<Media>;
  updateMediaFile(id: string, media: Partial<InsertMedia>): Promise<Media>;
  deleteMediaFile(id: string): Promise<void>;

  getSiteConfigs(): Promise<SiteConfig[]>;
  getSiteConfigsBySection(section: string): Promise<SiteConfig[]>;
  getSiteConfig(id: string): Promise<SiteConfig | undefined>;
  createSiteConfig(config: InsertSiteConfig): Promise<SiteConfig>;
  updateSiteConfig(id: string, config: Partial<InsertSiteConfig>): Promise<SiteConfig>;
  deleteSiteConfig(id: string): Promise<void>;

  getPageContents(): Promise<PageContent[]>;
  getPageContentsByPage(page: string): Promise<PageContent[]>;
  getPageContent(id: string): Promise<PageContent | undefined>;
  createPageContent(content: InsertPageContent): Promise<PageContent>;
  updatePageContent(id: string, content: Partial<InsertPageContent>): Promise<PageContent>;
  deletePageContent(id: string): Promise<void>;

  getThemeConfigs(): Promise<ThemeConfig[]>;
  getActiveTheme(): Promise<ThemeConfig | undefined>;
  getThemeConfig(id: string): Promise<ThemeConfig | undefined>;
  createThemeConfig(theme: InsertThemeConfig): Promise<ThemeConfig>;
  updateThemeConfig(id: string, theme: Partial<InsertThemeConfig>): Promise<ThemeConfig>;
  deleteThemeConfig(id: string): Promise<void>;
  setActiveTheme(id: string): Promise<ThemeConfig>;
}

export class DatabaseStorage implements IStorage {
  // ==================== USER MANAGEMENT ====================
  
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ==================== CONTACT MESSAGES ====================
  
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(insertMessage)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // ==================== PORTFOLIO PROJECTS ====================
  
  async getPortfolioProjects(): Promise<PortfolioProject[]> {
    // Return mock data if Supabase is not available
    if (!supabase) {
      return [
        {
          id: "1",
          title: "Client Website Redesign",
          description: "Complete website redesign for a local business, improving user experience and increasing conversion rates by 40%.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
          technologies: ["React", "TypeScript", "Tailwind CSS", "Vercel"],
          year: "2024",
          featured: true,
          clientResults: "+40% Conversion",
          websiteUrl: "https://example.com",
          order: "1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "E-Learning Platform",
          description: "Custom e-learning platform with video streaming, progress tracking, and interactive quizzes for an educational institution.",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
          technologies: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
          year: "2024",
          featured: false,
          clientResults: "500+ Students",
          websiteUrl: "https://example.com",
          order: "2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Restaurant Management System",
          description: "Full-featured restaurant management system with online ordering, inventory tracking, and staff management capabilities.",
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
          technologies: ["Vue.js", "Express", "MongoDB", "Stripe"],
          year: "2023",
          featured: true,
          clientResults: "25% Efficiency Gain",
          websiteUrl: "https://example.com",
          order: "3",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
    }

    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      image: d.image_url || d.image,
      technologies: d.technologies || [],
      year: d.year,
      featured: d.featured || false,
      clientResults: d.client_results,
      websiteUrl: d.website_url || d.project_url,
      order: d.order,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  }

  async createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject> {
    const dbProject = {
      title: project.title,
      description: project.description,
      image_url: project.image,
      technologies: project.technologies,
      year: project.year,
      featured: project.featured || false,
      client_results: project.clientResults || null,
      website_url: project.websiteUrl || null,
      order: typeof project.order === 'string' ? parseInt(project.order) || 0 : project.order || 0,
    };
    
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert(dbProject)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image_url,
      technologies: data.technologies || [],
      year: data.year,
      featured: data.featured || false,
      clientResults: data.client_results,
      websiteUrl: data.website_url,
      order: data.order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updatePortfolioProject(id: string, project: Partial<InsertPortfolioProject>): Promise<PortfolioProject> {
    const dbProject: any = {
      updated_at: new Date().toISOString()
    };
    
    if (project.title !== undefined) dbProject.title = project.title;
    if (project.description !== undefined) dbProject.description = project.description;
    if (project.image !== undefined) dbProject.image_url = project.image;
    if (project.technologies !== undefined) dbProject.technologies = project.technologies;
    if (project.year !== undefined) dbProject.year = project.year;
    if (project.featured !== undefined) dbProject.featured = project.featured;
    if (project.clientResults !== undefined) dbProject.client_results = project.clientResults;
    if (project.websiteUrl !== undefined) dbProject.website_url = project.websiteUrl;
    if (project.order !== undefined) {
      dbProject.order = typeof project.order === 'string' ? parseInt(project.order) || 0 : project.order || 0;
    }
    
    const { data, error } = await supabase
      .from('portfolio_projects')
      .update(dbProject)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image_url,
      technologies: data.technologies || [],
      year: data.year,
      featured: data.featured || false,
      clientResults: data.client_results,
      websiteUrl: data.website_url,
      order: data.order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async deletePortfolioProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== FEATURED PROJECTS ====================
  
  async getFeaturedProjects(): Promise<FeaturedProject[]> {
    const { data, error } = await supabase
      .from('featured_projects')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      image: d.image_url,
      icon: d.icon,
      iconColor: d.icon_color,
      features: d.features || [],
      technologies: d.technologies || [],
      githubUrl: d.github_url,
      liveUrl: d.live_url || d.link,
      demoType: d.demo_type,
      order: d.order,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  }

  async createFeaturedProject(project: InsertFeaturedProject): Promise<FeaturedProject> {
    const dbProject = {
      title: project.title,
      description: project.description,
      image_url: project.image,
      icon: project.icon,
      icon_color: project.iconColor,
      features: project.features,
      technologies: project.technologies,
      github_url: project.githubUrl || null,
      live_url: project.liveUrl || null,
      demo_type: project.demoType || null,
      order: typeof project.order === 'string' ? parseInt(project.order) || 0 : project.order || 0,
    };
    
    const { data, error } = await supabase
      .from('featured_projects')
      .insert(dbProject)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image_url,
      icon: data.icon,
      iconColor: data.icon_color,
      features: data.features || [],
      technologies: data.technologies || [],
      githubUrl: data.github_url,
      liveUrl: data.live_url,
      demoType: data.demo_type,
      order: data.order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updateFeaturedProject(id: string, project: Partial<InsertFeaturedProject>): Promise<FeaturedProject> {
    const dbProject: any = {
      updated_at: new Date().toISOString()
    };
    
    if (project.title !== undefined) dbProject.title = project.title;
    if (project.description !== undefined) dbProject.description = project.description;
    if (project.image !== undefined) dbProject.image_url = project.image;
    if (project.icon !== undefined) dbProject.icon = project.icon;
    if (project.iconColor !== undefined) dbProject.icon_color = project.iconColor;
    if (project.features !== undefined) dbProject.features = project.features;
    if (project.technologies !== undefined) dbProject.technologies = project.technologies;
    if (project.githubUrl !== undefined) dbProject.github_url = project.githubUrl;
    if (project.liveUrl !== undefined) dbProject.live_url = project.liveUrl;
    if (project.demoType !== undefined) dbProject.demo_type = project.demoType;
    if (project.order !== undefined) {
      dbProject.order = typeof project.order === 'string' ? parseInt(project.order) || 0 : project.order || 0;
    }
    
    const { data, error } = await supabase
      .from('featured_projects')
      .update(dbProject)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image_url,
      icon: data.icon,
      iconColor: data.icon_color,
      features: data.features || [],
      technologies: data.technologies || [],
      githubUrl: data.github_url,
      liveUrl: data.live_url,
      demoType: data.demo_type,
      order: data.order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async deleteFeaturedProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('featured_projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== SITE SETTINGS ====================
  
  async getSiteSettings(): Promise<SiteSettings[]> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async updateSiteSettings(key: string, value: any): Promise<SiteSettings> {
    const { data: existing } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();
    
    if (existing) {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('site_settings')
        .insert({ key, value })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }

  // ==================== ADMIN CREDENTIALS ====================
  
  async getAdminCredentials(): Promise<AdminCredentials | undefined> {
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async updateAdminCredentials(credentials: InsertAdminCredentials): Promise<AdminCredentials> {
    await supabase.from('admin_credentials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    const { data, error } = await supabase
      .from('admin_credentials')
      .insert(credentials)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ==================== TESTIMONIALS ====================
  
  async getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      name: d.name || d.client_name,
      role: d.role,
      company: d.company || d.client_company,
      content: d.content,
      rating: String(d.rating),
      image: d.image || d.avatar_url,
      order: d.order,
      isActive: d.is_active,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const dbTestimonial = {
      name: insertTestimonial.name,
      role: insertTestimonial.role,
      company: insertTestimonial.company,
      content: insertTestimonial.content,
      rating: parseInt(insertTestimonial.rating || '5') || 5,  // Add || '5' here
      image: insertTestimonial.image || null,
      is_active: insertTestimonial.isActive !== false,
      order: typeof insertTestimonial.order === 'string' ? parseInt(insertTestimonial.order) || 0 : insertTestimonial.order || 0,
    };
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert(dbTestimonial)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      company: data.company,
      content: data.content,
      rating: String(data.rating),
      image: data.image,
      order: data.order,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updateTestimonial(id: string, updateData: Partial<InsertTestimonial>): Promise<Testimonial> {
    const dbUpdate: any = {
      updated_at: new Date().toISOString()
    };
    
    if (updateData.name !== undefined) dbUpdate.name = updateData.name;
    if (updateData.role !== undefined) dbUpdate.role = updateData.role;
    if (updateData.company !== undefined) dbUpdate.company = updateData.company;
    if (updateData.content !== undefined) dbUpdate.content = updateData.content;
    if (updateData.rating !== undefined) dbUpdate.rating = parseInt(updateData.rating || '5') || 5;
    if (updateData.image !== undefined) dbUpdate.image = updateData.image;
    if (updateData.isActive !== undefined) dbUpdate.is_active = updateData.isActive;
    if (updateData.order !== undefined) {
      dbUpdate.order = typeof updateData.order === 'string' ? parseInt(updateData.order) || 0 : updateData.order || 0;
    }
    
    const { data, error } = await supabase
      .from('testimonials')
      .update(dbUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      company: data.company,
      content: data.content,
      rating: String(data.rating),
      image: data.image,
      order: data.order,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async deleteTestimonial(id: string): Promise<void> {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== PIANO SAMPLES ====================
  
  async getPianoSamples(): Promise<PianoSample[]> {
    const { data, error } = await supabase
      .from('piano_samples')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      audioUrl: d.audio_url,
      duration: d.duration ? String(d.duration) : null,
      category: d.category || d.genre,
      isOriginal: d.is_original || false,
      order: d.order,
      isActive: d.is_active,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  }

  async createPianoSample(insertSample: InsertPianoSample): Promise<PianoSample> {
    const dbSample = {
      title: insertSample.title,
      description: insertSample.description,
      audio_url: insertSample.audioUrl,
      duration: insertSample.duration ? parseInt(insertSample.duration) || null : null,
      category: insertSample.category,
      is_original: insertSample.isOriginal || false,
      is_active: insertSample.isActive !== false,
      order: typeof insertSample.order === 'string' ? parseInt(insertSample.order) || 0 : insertSample.order || 0,
    };
    
    const { data, error } = await supabase
      .from('piano_samples')
      .insert(dbSample)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      audioUrl: data.audio_url,
      duration: data.duration ? String(data.duration) : null,
      category: data.category,
      isOriginal: data.is_original,
      order: data.order,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updatePianoSample(id: string, updateData: Partial<InsertPianoSample>): Promise<PianoSample> {
    const dbUpdate: any = {
      updated_at: new Date().toISOString()
    };
    
    if (updateData.title !== undefined) dbUpdate.title = updateData.title;
    if (updateData.description !== undefined) dbUpdate.description = updateData.description;
    if (updateData.audioUrl !== undefined) dbUpdate.audio_url = updateData.audioUrl;
    if (updateData.duration !== undefined) {
      dbUpdate.duration = updateData.duration ? parseInt(updateData.duration) || null : null;
    }
    if (updateData.category !== undefined) dbUpdate.category = updateData.category;
    if (updateData.isOriginal !== undefined) dbUpdate.is_original = updateData.isOriginal;
    if (updateData.isActive !== undefined) dbUpdate.is_active = updateData.isActive;
    if (updateData.order !== undefined) {
      dbUpdate.order = typeof updateData.order === 'string' ? parseInt(updateData.order) || 0 : updateData.order || 0;
    }
    
    const { data, error } = await supabase
      .from('piano_samples')
      .update(dbUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      audioUrl: data.audio_url,
      duration: data.duration ? String(data.duration) : null,
      category: data.category,
      isOriginal: data.is_original,
      order: data.order,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async deletePianoSample(id: string): Promise<void> {
    const { error } = await supabase
      .from('piano_samples')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== LIVE PERFORMANCES ====================
  
  async getLivePerformances(): Promise<LivePerformance[]> {
    const { data, error } = await supabase
      .from('live_performances')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      videoUrl: d.video_url,
      venue: d.venue,
      performanceDate: d.performance_date ? new Date(d.performance_date).toISOString().split('T')[0] : null,
      order: d.order,
      isActive: d.is_active,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  }

  async createLivePerformance(insertPerformance: InsertLivePerformance): Promise<LivePerformance> {
    const dbPerformance = {
      title: insertPerformance.title,
      description: insertPerformance.description,
      video_url: insertPerformance.videoUrl,
      venue: insertPerformance.venue,
      performance_date: insertPerformance.performanceDate ? new Date(insertPerformance.performanceDate).toISOString() : null,
      is_active: insertPerformance.isActive !== false,
      order: typeof insertPerformance.order === 'string' ? parseInt(insertPerformance.order) || 0 : insertPerformance.order || 0,
    };
    
    const { data, error } = await supabase
      .from('live_performances')
      .insert(dbPerformance)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      videoUrl: data.video_url,
      venue: data.venue,
      performanceDate: data.performance_date ? new Date(data.performance_date).toISOString().split('T')[0] : null,
      order: data.order,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updateLivePerformance(id: string, updateData: Partial<InsertLivePerformance>): Promise<LivePerformance> {
    const dbUpdate: any = {
      updated_at: new Date().toISOString()
    };
    
    if (updateData.title !== undefined) dbUpdate.title = updateData.title;
    if (updateData.description !== undefined) dbUpdate.description = updateData.description;
    if (updateData.videoUrl !== undefined) dbUpdate.video_url = updateData.videoUrl;
    if (updateData.venue !== undefined) dbUpdate.venue = updateData.venue;
    if (updateData.performanceDate !== undefined) {
      dbUpdate.performance_date = updateData.performanceDate ? new Date(updateData.performanceDate).toISOString() : null;
    }
    if (updateData.isActive !== undefined) dbUpdate.is_active = updateData.isActive;
    if (updateData.order !== undefined) {
      dbUpdate.order = typeof updateData.order === 'string' ? parseInt(updateData.order) || 0 : updateData.order || 0;
    }
    
    const { data, error } = await supabase
      .from('live_performances')
      .update(dbUpdate)
      .eq('id', id)
      .select()
      .single();

      if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      videoUrl: data.video_url,
      venue: data.venue,
      performanceDate: data.performance_date ? new Date(data.performance_date).toISOString().split('T')[0] : null,
      order: data.order,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async deleteLivePerformance(id: string): Promise<void> {
    const { error } = await supabase
      .from('live_performances')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== SERVICES ====================
  
  async getServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', category)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getService(id: string): Promise<Service | undefined> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(insertService)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateService(id: string, updateData: Partial<InsertService>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteService(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== LEADS ====================
  
  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert(insertLead)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateLead(id: string, updateData: Partial<InsertLead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== ORDERS ====================
  
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(insertOrder)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateOrder(id: string, updateData: Partial<InsertOrder>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== MEDIA ====================
  
  async getMediaFiles(): Promise<Media[]> {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getMediaFile(id: string): Promise<Media | undefined> {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async createMediaFile(insertMedia: InsertMedia): Promise<Media> {
    const { data, error } = await supabase
      .from('media')
      .insert(insertMedia)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMediaFile(id: string, updateData: Partial<InsertMedia>): Promise<Media> {
    const { data, error } = await supabase
      .from('media')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteMediaFile(id: string): Promise<void> {
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== SITE CONFIGURATION ====================
  
  async getSiteConfigs(): Promise<SiteConfig[]> {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('is_active', true)
      .order('section', { ascending: true })
      .order('key', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async getSiteConfigsBySection(section: string): Promise<SiteConfig[]> {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('section', section)
      .eq('is_active', true)
      .order('key', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async getSiteConfig(id: string): Promise<SiteConfig | undefined> {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async createSiteConfig(insertConfig: InsertSiteConfig): Promise<SiteConfig> {
    const { data, error } = await supabase
      .from('site_config')
      .insert(insertConfig)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateSiteConfig(id: string, updateData: Partial<InsertSiteConfig>): Promise<SiteConfig> {
    const { data, error } = await supabase
      .from('site_config')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteSiteConfig(id: string): Promise<void> {
    const { error } = await supabase
      .from('site_config')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== PAGE CONTENT ====================
  
  async getPageContents(): Promise<PageContent[]> {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('is_visible', true)
      .order('page', { ascending: true })
      .order('section', { ascending: true })
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async getPageContentsByPage(page: string): Promise<PageContent[]> {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page', page)
      .eq('is_visible', true)
      .order('section', { ascending: true })
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async getPageContent(id: string): Promise<PageContent | undefined> {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async createPageContent(insertContent: InsertPageContent): Promise<PageContent> {
    const { data, error } = await supabase
      .from('page_content')
      .insert(insertContent)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePageContent(id: string, updateData: Partial<InsertPageContent>): Promise<PageContent> {
    const { data, error } = await supabase
      .from('page_content')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deletePageContent(id: string): Promise<void> {
    const { error } = await supabase
      .from('page_content')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ==================== THEME CONFIGURATION ====================
  
  async getThemeConfigs(): Promise<ThemeConfig[]> {
    const { data, error } = await supabase
      .from('theme_config')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getActiveTheme(): Promise<ThemeConfig | undefined> {
    const { data, error } = await supabase
      .from('theme_config')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async getThemeConfig(id: string): Promise<ThemeConfig | undefined> {
    const { data, error } = await supabase
      .from('theme_config')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async createThemeConfig(insertTheme: InsertThemeConfig): Promise<ThemeConfig> {
    const { data, error } = await supabase
      .from('theme_config')
      .insert(insertTheme)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateThemeConfig(id: string, updateData: Partial<InsertThemeConfig>): Promise<ThemeConfig> {
    const { data, error } = await supabase
      .from('theme_config')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteThemeConfig(id: string): Promise<void> {
    const { error } = await supabase
      .from('theme_config')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async setActiveTheme(id: string): Promise<ThemeConfig> {
    // First, deactivate all themes
    await supabase
      .from('theme_config')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Then activate the selected theme
    const { data, error } = await supabase
      .from('theme_config')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const storage = new DatabaseStorage();