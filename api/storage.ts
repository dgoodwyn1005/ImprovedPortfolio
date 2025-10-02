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
      if (error.code === 'PGRST116') return undefined; // Not found
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
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePortfolioProject(id: string, project: Partial<InsertPortfolioProject>): Promise<PortfolioProject> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
    return data || [];
  }

  async createFeaturedProject(project: InsertFeaturedProject): Promise<FeaturedProject> {
    const { data, error } = await supabase
      .from('featured_projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateFeaturedProject(id: string, project: Partial<InsertFeaturedProject>): Promise<FeaturedProject> {
    const { data, error } = await supabase
      .from('featured_projects')
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
    // Try to update first
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
    // Delete existing credentials first
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
    return data || [];
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(insertTestimonial)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTestimonial(id: string, updateData: Partial<InsertTestimonial>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
    return data || [];
  }

  async createPianoSample(insertSample: InsertPianoSample): Promise<PianoSample> {
    const { data, error } = await supabase
      .from('piano_samples')
      .insert(insertSample)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePianoSample(id: string, updateData: Partial<InsertPianoSample>): Promise<PianoSample> {
    const { data, error } = await supabase
      .from('piano_samples')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
    return data || [];
  }

  async createLivePerformance(insertPerformance: InsertLivePerformance): Promise<LivePerformance> {
    const { data, error } = await supabase
      .from('live_performances')
      .insert(insertPerformance)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateLivePerformance(id: string, updateData: Partial<InsertLivePerformance>): Promise<LivePerformance> {
    const { data, error } = await supabase
      .from('live_performances')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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