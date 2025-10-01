import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: text("service"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioProjects = pgTable("portfolio_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  technologies: text("technologies").array().notNull(),
  year: text("year").notNull(),
  featured: boolean("featured").default(false).notNull(),
  clientResults: text("client_results"),
  websiteUrl: text("website_url"),
  order: text("order").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const featuredProjects = pgTable("featured_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  icon: text("icon").notNull(),
  iconColor: text("icon_color").notNull(),
  features: text("features").array().notNull(),
  technologies: text("technologies").array().notNull(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  demoType: text("demo_type"), // 'demo', 'download', 'game'
  order: text("order").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adminCredentials = pgTable("admin_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  content: text("content").notNull(),
  rating: text("rating").notNull().default("5"),
  image: text("image"),
  order: text("order").default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pianoSamples = pgTable("piano_samples", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  audioUrl: text("audio_url").notNull(),
  duration: text("duration"), // e.g., "3:45"
  category: text("category").notNull(), // "wedding", "worship", "classical", "original"
  isOriginal: boolean("is_original").default(false), // self-made recordings
  order: text("order").default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const livePerformances = pgTable("live_performances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  venue: text("venue").notNull(),
  performanceDate: text("performance_date"),
  order: text("order").default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'computer', 'music', 'basketball'
  description: text("description").notNull(),
  inclusions: text("inclusions").array().notNull().default([]),
  priceType: text("price_type").notNull(), // 'fixed', 'hourly', 'tiered', 'project'
  basePrice: text("base_price"),
  hourlyRate: text("hourly_rate"),
  tiers: jsonb("tiers").default([]),
  isFeatured: boolean("is_featured").default(false),
  isPublished: boolean("is_published").default(true),
  order: text("order").default("0"),
  slug: text("slug").notNull().unique(),
  turnaround: text("turnaround"),
  cta: text("cta").default("Get Started"),
  acceptInstantCheckout: boolean("accept_instant_checkout").default(false),
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  serviceIds: text("service_ids").array().notNull().default([]),
  price: text("price").notNull(),
  compareAtPrice: text("compare_at_price"),
  isPublished: boolean("is_published").default(true),
  order: text("order").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service"),
  budget: text("budget"),
  timeline: text("timeline"),
  message: text("message").notNull(),
  source: text("source").default("contact_form"), // 'hire_me_modal', 'contact_form', etc
  type: text("type").default("project"), // 'project', 'call', 'payment'
  status: text("status").default("new"), // 'new', 'qualified', 'proposal_sent', 'won', 'lost'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stripeSessionId: text("stripe_session_id").unique(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  amount: text("amount").notNull(),
  currency: text("currency").default("usd"),
  productName: text("product_name").notNull(),
  status: text("status").default("pending"), // 'pending', 'paid', 'failed', 'refunded'
  projectStatus: text("project_status").default("not_started"), // 'not_started', 'in_progress', 'completed', 'delivered'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const media = pgTable("media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  size: text("size").notNull(), // in bytes
  altText: text("alt_text"),
  tags: text("tags").array().default([]),
  category: text("category"), // 'image', 'video', 'audio', 'document'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  service: true,
  message: true,
});

export const insertPortfolioProjectSchema = createInsertSchema(portfolioProjects).pick({
  title: true,
  description: true,
  image: true,
  technologies: true,
  year: true,
  featured: true,
  clientResults: true,
  websiteUrl: true,
  order: true,
});

export const insertFeaturedProjectSchema = createInsertSchema(featuredProjects).pick({
  title: true,
  description: true,
  image: true,
  icon: true,
  iconColor: true,
  features: true,
  technologies: true,
  githubUrl: true,
  liveUrl: true,
  demoType: true,
  order: true,
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
});

export const insertAdminCredentialsSchema = createInsertSchema(adminCredentials).pick({
  username: true,
  password: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  role: true,
  company: true,
  content: true,
  rating: true,
  image: true,
  order: true,
  isActive: true,
});

export const insertPianoSampleSchema = createInsertSchema(pianoSamples).pick({
  title: true,
  description: true,
  audioUrl: true,
  duration: true,
  category: true,
  isOriginal: true,
  order: true,
  isActive: true,
});

export const insertLivePerformanceSchema = createInsertSchema(livePerformances).pick({
  title: true,
  description: true,
  videoUrl: true,
  venue: true,
  performanceDate: true,
  order: true,
  isActive: true,
});

export const insertServiceSchema = createInsertSchema(services).pick({
  title: true,
  category: true,
  description: true,
  inclusions: true,
  priceType: true,
  basePrice: true,
  hourlyRate: true,
  tiers: true,
  isFeatured: true,
  isPublished: true,
  order: true,
  slug: true,
  turnaround: true,
  cta: true,
  acceptInstantCheckout: true,
  stripeProductId: true,
  stripePriceId: true,
});

export const insertPackageSchema = createInsertSchema(packages).pick({
  title: true,
  serviceIds: true,
  price: true,
  compareAtPrice: true,
  isPublished: true,
  order: true,
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  email: true,
  phone: true,
  service: true,
  budget: true,
  timeline: true,
  message: true,
  source: true,
  type: true,
  status: true,
  notes: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  stripeSessionId: true,
  customerEmail: true,
  customerName: true,
  amount: true,
  currency: true,
  productName: true,
  status: true,
  projectStatus: true,
  notes: true,
});

export const insertMediaSchema = createInsertSchema(media).pick({
  filename: true,
  originalName: true,
  url: true,
  mimeType: true,
  size: true,
  altText: true,
  tags: true,
  category: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertPortfolioProject = z.infer<typeof insertPortfolioProjectSchema>;
export type FeaturedProject = typeof featuredProjects.$inferSelect;
export type InsertFeaturedProject = z.infer<typeof insertFeaturedProjectSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type AdminCredentials = typeof adminCredentials.$inferSelect;
export type InsertAdminCredentials = z.infer<typeof insertAdminCredentialsSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type PianoSample = typeof pianoSamples.$inferSelect;
export type InsertPianoSample = z.infer<typeof insertPianoSampleSchema>;
export type LivePerformance = typeof livePerformances.$inferSelect;
export type InsertLivePerformance = z.infer<typeof insertLivePerformanceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;

// Site Configuration Table - For advanced customization
export const siteConfig = pgTable("site_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: varchar("section").notNull(), // 'hero', 'about', 'services', 'colors', 'features'
  key: varchar("key").notNull(), // specific setting name
  value: jsonb("value").notNull(), // flexible value storage
  type: varchar("type").notNull().default("text"), // 'text', 'color', 'boolean', 'number', 'array', 'object'
  description: varchar("description"), // admin-friendly description
  category: varchar("category"), // grouping for admin UI
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Page Content Management Table
export const pageContent = pgTable("page_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  page: varchar("page").notNull(), // 'home', 'about', 'ai', 'music', 'basketball'
  section: varchar("section").notNull(), // 'hero', 'features', 'pricing', etc.
  contentKey: varchar("content_key").notNull(), // specific content identifier
  title: varchar("title"),
  subtitle: varchar("subtitle"),
  description: text("description"),
  buttonText: varchar("button_text"),
  buttonLink: varchar("button_link"),
  imageUrl: varchar("image_url"),
  backgroundColor: varchar("background_color"),
  textColor: varchar("text_color"),
  isVisible: boolean("is_visible").default(true),
  sortOrder: integer("sort_order").default(0),
  metadata: jsonb("metadata"), // additional flexible data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Theme Configuration Table
export const themeConfig = pgTable("theme_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // 'default', 'dark', 'light', 'custom'
  colors: jsonb("colors").notNull(), // all color variables
  fonts: jsonb("fonts"), // font configurations
  spacing: jsonb("spacing"), // spacing configurations
  isActive: boolean("is_active").default(false),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteConfigSchema = createInsertSchema(siteConfig).pick({
  section: true,
  key: true,
  value: true,
  type: true,
  description: true,
  category: true,
  isActive: true,
});

export const insertPageContentSchema = createInsertSchema(pageContent).pick({
  page: true,
  section: true,
  contentKey: true,
  title: true,
  subtitle: true,
  description: true,
  buttonText: true,
  buttonLink: true,
  imageUrl: true,
  backgroundColor: true,
  textColor: true,
  isVisible: true,
  sortOrder: true,
  metadata: true,
});

export const insertThemeConfigSchema = createInsertSchema(themeConfig).pick({
  name: true,
  colors: true,
  fonts: true,
  spacing: true,
  isActive: true,
  isDefault: true,
});

export type SiteConfig = typeof siteConfig.$inferSelect;
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;
export type PageContent = typeof pageContent.$inferSelect;
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type ThemeConfig = typeof themeConfig.$inferSelect;
export type InsertThemeConfig = z.infer<typeof insertThemeConfigSchema>;
