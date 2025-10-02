import { type User, type InsertUser, type ContactMessage, type InsertContactMessage, type PortfolioProject, type InsertPortfolioProject, type FeaturedProject, type InsertFeaturedProject, type SiteSettings, type InsertSiteSettings, type AdminCredentials, type InsertAdminCredentials, type Testimonial, type InsertTestimonial, type PianoSample, type InsertPianoSample, type LivePerformance, type InsertLivePerformance, type Service, type InsertService, type Lead, type InsertLead, type Order, type InsertOrder, type Media, type InsertMedia, type SiteConfig, type InsertSiteConfig, type PageContent, type InsertPageContent, type ThemeConfig, type InsertThemeConfig } from "../shared/schema.js";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Portfolio management
  getPortfolioProjects(): Promise<PortfolioProject[]>;
  createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject>;
  updatePortfolioProject(id: string, project: Partial<InsertPortfolioProject>): Promise<PortfolioProject>;
  deletePortfolioProject(id: string): Promise<void>;
  
  // Featured projects management
  getFeaturedProjects(): Promise<FeaturedProject[]>;
  createFeaturedProject(project: InsertFeaturedProject): Promise<FeaturedProject>;
  updateFeaturedProject(id: string, project: Partial<InsertFeaturedProject>): Promise<FeaturedProject>;
  deleteFeaturedProject(id: string): Promise<void>;
  
  // Site settings
  getSiteSettings(): Promise<SiteSettings[]>;
  updateSiteSettings(key: string, value: any): Promise<SiteSettings>;
  
  // Admin credentials
  getAdminCredentials(): Promise<AdminCredentials | undefined>;
  updateAdminCredentials(credentials: InsertAdminCredentials): Promise<AdminCredentials>;
  
  // Testimonials management
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;
  
  // Piano samples management
  getPianoSamples(): Promise<PianoSample[]>;
  createPianoSample(sample: InsertPianoSample): Promise<PianoSample>;
  updatePianoSample(id: string, sample: Partial<InsertPianoSample>): Promise<PianoSample>;
  deletePianoSample(id: string): Promise<void>;
  
  // Live performances management
  getLivePerformances(): Promise<LivePerformance[]>;
  createLivePerformance(performance: InsertLivePerformance): Promise<LivePerformance>;
  updateLivePerformance(id: string, performance: Partial<InsertLivePerformance>): Promise<LivePerformance>;
  deleteLivePerformance(id: string): Promise<void>;

  // Services management
  getServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  // Leads management
  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead>;
  deleteLead(id: string): Promise<void>;

  // Orders management
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order>;
  deleteOrder(id: string): Promise<void>;

  // Media management
  getMediaFiles(): Promise<Media[]>;
  getMediaFile(id: string): Promise<Media | undefined>;
  createMediaFile(media: InsertMedia): Promise<Media>;
  updateMediaFile(id: string, media: Partial<InsertMedia>): Promise<Media>;
  deleteMediaFile(id: string): Promise<void>;

  // Site configuration management
  getSiteConfigs(): Promise<SiteConfig[]>;
  getSiteConfigsBySection(section: string): Promise<SiteConfig[]>;
  getSiteConfig(id: string): Promise<SiteConfig | undefined>;
  createSiteConfig(config: InsertSiteConfig): Promise<SiteConfig>;
  updateSiteConfig(id: string, config: Partial<InsertSiteConfig>): Promise<SiteConfig>;
  deleteSiteConfig(id: string): Promise<void>;

  // Page content management
  getPageContents(): Promise<PageContent[]>;
  getPageContentsByPage(page: string): Promise<PageContent[]>;
  getPageContent(id: string): Promise<PageContent | undefined>;
  createPageContent(content: InsertPageContent): Promise<PageContent>;
  updatePageContent(id: string, content: Partial<InsertPageContent>): Promise<PageContent>;
  deletePageContent(id: string): Promise<void>;

  // Theme configuration management
  getThemeConfigs(): Promise<ThemeConfig[]>;
  getActiveTheme(): Promise<ThemeConfig | undefined>;
  getThemeConfig(id: string): Promise<ThemeConfig | undefined>;
  createThemeConfig(theme: InsertThemeConfig): Promise<ThemeConfig>;
  updateThemeConfig(id: string, theme: Partial<InsertThemeConfig>): Promise<ThemeConfig>;
  deleteThemeConfig(id: string): Promise<void>;
  setActiveTheme(id: string): Promise<ThemeConfig>;
}

import { db } from "./db.js";
import { users, contactMessages, portfolioProjects, featuredProjects, siteSettings, adminCredentials, testimonials, pianoSamples, livePerformances, services, leads, orders, media, siteConfig, pageContent, themeConfig } from "../shared/schema.js";
import { eq, desc, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [contactMessage] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return contactMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  // Portfolio management
  async getPortfolioProjects(): Promise<PortfolioProject[]> {
    return await db
      .select()
      .from(portfolioProjects)
      .orderBy(portfolioProjects.order, desc(portfolioProjects.createdAt));
  }

  async createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject> {
    const [portfolioProject] = await db
      .insert(portfolioProjects)
      .values(project)
      .returning();
    return portfolioProject;
  }

  async updatePortfolioProject(id: string, project: Partial<InsertPortfolioProject>): Promise<PortfolioProject> {
    const [portfolioProject] = await db
      .update(portfolioProjects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(portfolioProjects.id, id))
      .returning();
    return portfolioProject;
  }

  async deletePortfolioProject(id: string): Promise<void> {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  }

  // Featured projects management
  async getFeaturedProjects(): Promise<FeaturedProject[]> {
    return await db
      .select()
      .from(featuredProjects)
      .orderBy(featuredProjects.order, desc(featuredProjects.createdAt));
  }

  async createFeaturedProject(project: InsertFeaturedProject): Promise<FeaturedProject> {
    const [featuredProject] = await db
      .insert(featuredProjects)
      .values(project)
      .returning();
    return featuredProject;
  }

  async updateFeaturedProject(id: string, project: Partial<InsertFeaturedProject>): Promise<FeaturedProject> {
    const [featuredProject] = await db
      .update(featuredProjects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(featuredProjects.id, id))
      .returning();
    return featuredProject;
  }

  async deleteFeaturedProject(id: string): Promise<void> {
    await db.delete(featuredProjects).where(eq(featuredProjects.id, id));
  }

  // Site settings
  async getSiteSettings(): Promise<SiteSettings[]> {
    return await db.select().from(siteSettings);
  }

  async updateSiteSettings(key: string, value: any): Promise<SiteSettings> {
    const [setting] = await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() }
      })
      .returning();
    return setting;
  }

  // Admin credentials
  async getAdminCredentials(): Promise<AdminCredentials | undefined> {
    const [credentials] = await db.select().from(adminCredentials).limit(1);
    return credentials || undefined;
  }

  async updateAdminCredentials(credentials: InsertAdminCredentials): Promise<AdminCredentials> {
    // Delete existing credentials first
    await db.delete(adminCredentials);
    
    const [newCredentials] = await db
      .insert(adminCredentials)
      .values(credentials)
      .returning();
    return newCredentials;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(desc(testimonials.order), desc(testimonials.createdAt));
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async updateTestimonial(id: string, updateData: Partial<InsertTestimonial>): Promise<Testimonial> {
    const [testimonial] = await db
      .update(testimonials)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }

  async deleteTestimonial(id: string): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  // Piano samples management
  async getPianoSamples(): Promise<PianoSample[]> {
    return await db
      .select()
      .from(pianoSamples)
      .where(eq(pianoSamples.isActive, true))
      .orderBy(pianoSamples.order, desc(pianoSamples.createdAt));
  }

  async createPianoSample(insertSample: InsertPianoSample): Promise<PianoSample> {
    const [sample] = await db
      .insert(pianoSamples)
      .values(insertSample)
      .returning();
    return sample;
  }

  async updatePianoSample(id: string, updateData: Partial<InsertPianoSample>): Promise<PianoSample> {
    const [sample] = await db
      .update(pianoSamples)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(pianoSamples.id, id))
      .returning();
    return sample;
  }

  async deletePianoSample(id: string): Promise<void> {
    await db.delete(pianoSamples).where(eq(pianoSamples.id, id));
  }

  // Live performances management
  async getLivePerformances(): Promise<LivePerformance[]> {
    return await db
      .select()
      .from(livePerformances)
      .where(eq(livePerformances.isActive, true))
      .orderBy(livePerformances.order, desc(livePerformances.createdAt));
  }

  async createLivePerformance(insertPerformance: InsertLivePerformance): Promise<LivePerformance> {
    const [performance] = await db
      .insert(livePerformances)
      .values(insertPerformance)
      .returning();
    return performance;
  }

  async updateLivePerformance(id: string, updateData: Partial<InsertLivePerformance>): Promise<LivePerformance> {
    const [performance] = await db
      .update(livePerformances)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(livePerformances.id, id))
      .returning();
    return performance;
  }

  async deleteLivePerformance(id: string): Promise<void> {
    await db.delete(livePerformances).where(eq(livePerformances.id, id));
  }

  // Services management
  async getServices(): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.isPublished, true))
      .orderBy(services.order, desc(services.createdAt));
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.category, category))
      .orderBy(services.order, desc(services.createdAt));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(insertService)
      .returning();
    return service;
  }

  async updateService(id: string, updateData: Partial<InsertService>): Promise<Service> {
    const [service] = await db
      .update(services)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Leads management
  async getLeads(): Promise<Lead[]> {
    return await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async updateLead(id: string, updateData: Partial<InsertLead>): Promise<Lead> {
    const [lead] = await db
      .update(leads)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async deleteLead(id: string): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  // Orders management
  async getOrders(): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateOrder(id: string, updateData: Partial<InsertOrder>): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async deleteOrder(id: string): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id));
  }

  // Media management
  async getMediaFiles(): Promise<Media[]> {
    return await db
      .select()
      .from(media)
      .orderBy(desc(media.createdAt));
  }

  async getMediaFile(id: string): Promise<Media | undefined> {
    const [mediaFile] = await db.select().from(media).where(eq(media.id, id));
    return mediaFile || undefined;
  }

  async createMediaFile(insertMedia: InsertMedia): Promise<Media> {
    const [mediaFile] = await db
      .insert(media)
      .values(insertMedia)
      .returning();
    return mediaFile;
  }

  async updateMediaFile(id: string, updateData: Partial<InsertMedia>): Promise<Media> {
    const [mediaFile] = await db
      .update(media)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(media.id, id))
      .returning();
    return mediaFile;
  }

  async deleteMediaFile(id: string): Promise<void> {
    await db.delete(media).where(eq(media.id, id));
  }

  // Site configuration management
  async getSiteConfigs(): Promise<SiteConfig[]> {
    return await db
      .select()
      .from(siteConfig)
      .where(eq(siteConfig.isActive, true))
      .orderBy(siteConfig.section, siteConfig.key);
  }

  async getSiteConfigsBySection(section: string): Promise<SiteConfig[]> {
    return await db
      .select()
      .from(siteConfig)
      .where(and(eq(siteConfig.section, section), eq(siteConfig.isActive, true)))
      .orderBy(siteConfig.key);
  }

  async getSiteConfig(id: string): Promise<SiteConfig | undefined> {
    const [config] = await db.select().from(siteConfig).where(eq(siteConfig.id, id));
    return config || undefined;
  }

  async createSiteConfig(insertConfig: InsertSiteConfig): Promise<SiteConfig> {
    const [config] = await db
      .insert(siteConfig)
      .values(insertConfig)
      .returning();
    return config;
  }

  async updateSiteConfig(id: string, updateData: Partial<InsertSiteConfig>): Promise<SiteConfig> {
    const [config] = await db
      .update(siteConfig)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(siteConfig.id, id))
      .returning();
    return config;
  }

  async deleteSiteConfig(id: string): Promise<void> {
    await db.delete(siteConfig).where(eq(siteConfig.id, id));
  }

  // Page content management
  async getPageContents(): Promise<PageContent[]> {
    return await db
      .select()
      .from(pageContent)
      .where(eq(pageContent.isVisible, true))
      .orderBy(pageContent.page, pageContent.section, pageContent.sortOrder);
  }

  async getPageContentsByPage(page: string): Promise<PageContent[]> {
    return await db
      .select()
      .from(pageContent)
      .where(and(eq(pageContent.page, page), eq(pageContent.isVisible, true)))
      .orderBy(pageContent.section, pageContent.sortOrder);
  }

  async getPageContent(id: string): Promise<PageContent | undefined> {
    const [content] = await db.select().from(pageContent).where(eq(pageContent.id, id));
    return content || undefined;
  }

  async createPageContent(insertContent: InsertPageContent): Promise<PageContent> {
    const [content] = await db
      .insert(pageContent)
      .values(insertContent)
      .returning();
    return content;
  }

  async updatePageContent(id: string, updateData: Partial<InsertPageContent>): Promise<PageContent> {
    const [content] = await db
      .update(pageContent)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(pageContent.id, id))
      .returning();
    return content;
  }

  async deletePageContent(id: string): Promise<void> {
    await db.delete(pageContent).where(eq(pageContent.id, id));
  }

  // Theme configuration management
  async getThemeConfigs(): Promise<ThemeConfig[]> {
    return await db
      .select()
      .from(themeConfig)
      .orderBy(desc(themeConfig.isDefault), desc(themeConfig.createdAt));
  }

  async getActiveTheme(): Promise<ThemeConfig | undefined> {
    const [theme] = await db.select().from(themeConfig).where(eq(themeConfig.isActive, true));
    return theme || undefined;
  }

  async getThemeConfig(id: string): Promise<ThemeConfig | undefined> {
    const [theme] = await db.select().from(themeConfig).where(eq(themeConfig.id, id));
    return theme || undefined;
  }

  async createThemeConfig(insertTheme: InsertThemeConfig): Promise<ThemeConfig> {
    const [theme] = await db
      .insert(themeConfig)
      .values(insertTheme)
      .returning();
    return theme;
  }

  async updateThemeConfig(id: string, updateData: Partial<InsertThemeConfig>): Promise<ThemeConfig> {
    const [theme] = await db
      .update(themeConfig)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(themeConfig.id, id))
      .returning();
    return theme;
  }

  async deleteThemeConfig(id: string): Promise<void> {
    await db.delete(themeConfig).where(eq(themeConfig.id, id));
  }

  async setActiveTheme(id: string): Promise<ThemeConfig> {
    // First, deactivate all themes
    await db.update(themeConfig).set({ isActive: false });
    
    // Then activate the selected theme
    const [theme] = await db
      .update(themeConfig)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(themeConfig.id, id))
      .returning();
    return theme;
  }
}

export const storage = new DatabaseStorage();
