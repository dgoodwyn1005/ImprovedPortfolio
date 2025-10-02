import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { 
  insertContactMessageSchema, 
  insertPortfolioProjectSchema, 
  insertFeaturedProjectSchema,
  insertUserSchema,
  insertAdminCredentialsSchema,
  insertTestimonialSchema,
  insertPianoSampleSchema,
  insertLivePerformanceSchema,
  insertServiceSchema,
  insertLeadSchema,
  insertOrderSchema,
  insertMediaSchema,
  insertSiteConfigSchema,
  insertPageContentSchema,
  insertThemeConfigSchema
} from "../shared/schema.js";
import { z } from "zod";
import { verifySupabaseToken } from './supabase.js';

// Simple admin authentication middleware for login
const authenticateAdminLogin = async (req: any, res: any, next: any) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(401).json({ error: "Username and password required" });
  }
  
  try {
    const credentials = await storage.getAdminCredentials();
    
    // If no credentials exist, create default ones
    if (!credentials) {
      await storage.updateAdminCredentials({ username: "admin", password: "admin123" });
      if (username === "admin" && password === "admin123") {
        req.user = { id: "admin", username: "admin", isAdmin: true };
        // Set session
        req.session.user = req.user;
        next();
        return;
      }
    }
    
    // Check against stored credentials
    if (credentials && username === credentials.username && password === credentials.password) {
      req.user = { id: credentials.id, username: credentials.username, isAdmin: true };
      // Set session
      req.session.user = req.user;
      next();
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Session-based admin authentication middleware
const requireAdminSession = async (req: any, res: any, next: any) => {
  // 1) Session-based admin
  if (req.session && req.session.user && req.session.user.isAdmin) {
    req.user = req.session.user;
    next();
    return;
  }

  // 2) Supabase Bearer token (Authorization: Bearer <token>)
  const auth = req.headers['authorization'] || req.headers['Authorization'] || '';
  const token = typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) {
    try {
      const user = await verifySupabaseToken(token);
      if (user && (user?.app_metadata?.role === 'admin' || user?.user_metadata?.isAdmin)) {
        req.user = { id: user.id, username: user.email, isAdmin: true };
        next();
        return;
      }
    } catch (e) {
      console.warn('[requireAdminSession] Supabase token verification failed', e && (e as any).message ? (e as any).message : e);
    }
  }

  res.status(401).json({ error: "Admin session or admin Supabase token required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Mount Reusable API endpoints (Supabase + Stripe helpers)
  // Note: Contact form now uses Formspree integration
  // No backend contact routes needed

  // Admin login endpoint
  app.post("/api/admin/login", authenticateAdminLogin, async (req: any, res) => {
    res.json({ success: true, user: req.user });
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }
      res.json({ success: true });
    });
  });

  // Check admin session
  app.get("/api/admin/session", (req: any, res) => {
    if (req.session && req.session.user && req.session.user.isAdmin) {
      res.json({ isAuthenticated: true, user: req.session.user });
    } else {
      res.json({ isAuthenticated: false });
    }
  });

  // Portfolio management endpoints
  app.get("/api/admin/portfolio", async (req, res) => {
    try {
      const projects = await storage.getPortfolioProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio projects" });
    }
  });

  app.post("/api/admin/portfolio", async (req, res) => {
    try {
      const validatedData = insertPortfolioProjectSchema.parse(req.body);
      const project = await storage.createPortfolioProject(validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create portfolio project" });
      }
    }
  });

  app.put("/api/admin/portfolio/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPortfolioProjectSchema.parse(req.body);
      const project = await storage.updatePortfolioProject(id, validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update portfolio project" });
      }
    }
  });

  app.delete("/api/admin/portfolio/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePortfolioProject(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete portfolio project" });
    }
  });

  // Featured projects management endpoints
  app.get("/api/admin/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured projects" });
    }
  });

  app.post("/api/admin/featured", async (req, res) => {
    try {
      const validatedData = insertFeaturedProjectSchema.parse(req.body);
      const project = await storage.createFeaturedProject(validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create featured project" });
      }
    }
  });

  app.put("/api/admin/featured/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertFeaturedProjectSchema.parse(req.body);
      const project = await storage.updateFeaturedProject(id, validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update featured project" });
      }
    }
  });

  app.delete("/api/admin/featured/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteFeaturedProject(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete featured project" });
    }
  });

  // Admin credentials management
  app.get("/api/admin/credentials", async (req, res) => {
    try {
      const credentials = await storage.getAdminCredentials();
      if (!credentials) {
        // Return default if none exist
        res.json({ username: "admin", hasPassword: true });
      } else {
        res.json({ username: credentials.username, hasPassword: true });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin credentials" });
    }
  });

  app.put("/api/admin/credentials", async (req, res) => {
    try {
      const validatedData = insertAdminCredentialsSchema.parse(req.body);
      const credentials = await storage.updateAdminCredentials(validatedData);
      res.json({ success: true, username: credentials.username });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error updating admin credentials:", error);
        res.status(500).json({ error: "Failed to update admin credentials" });
      }
    }
  });

  // Public endpoints for displaying projects
  app.get("/api/portfolio", async (req, res) => {
    try {
      const projects = await storage.getPortfolioProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio projects" });
    }
  });

  app.get("/api/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured projects" });
    }
  });

  // Get testimonials (public endpoint)
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Create testimonial (admin only)
  app.post("/api/admin/testimonials", requireAdminSession, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      
      res.status(201).json({ 
        message: "Testimonial created successfully", 
        testimonial 
      });
    } catch (error) {
      console.error("Error creating testimonial:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid testimonial data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  // Update testimonial (admin only)
  app.put("/api/admin/testimonials/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertTestimonialSchema.partial().parse(req.body);
      
      const testimonial = await storage.updateTestimonial(id, updateData);
      
      res.json({ 
        message: "Testimonial updated successfully", 
        testimonial 
      });
    } catch (error) {
      console.error("Error updating testimonial:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid testimonial data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  // Delete testimonial (admin only)
  app.delete("/api/admin/testimonials/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTestimonial(id);
      
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Piano samples endpoints
  
  // Get piano samples (public endpoint)
  app.get("/api/piano-samples", async (req, res) => {
    try {
      const samples = await storage.getPianoSamples();
      res.json(samples);
    } catch (error) {
      console.error("Error fetching piano samples:", error);
      res.status(500).json({ error: "Failed to fetch piano samples" });
    }
  });

  // Create piano sample (admin only)
  app.post("/api/admin/piano-samples", requireAdminSession, async (req, res) => {
    try {
      const validatedData = insertPianoSampleSchema.parse(req.body);
      const sample = await storage.createPianoSample(validatedData);
      
      res.status(201).json({ 
        message: "Piano sample created successfully", 
        sample 
      });
    } catch (error) {
      console.error("Error creating piano sample:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid piano sample data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create piano sample" });
    }
  });

  // Update piano sample (admin only)
  app.put("/api/admin/piano-samples/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertPianoSampleSchema.partial().parse(req.body);
      
      const sample = await storage.updatePianoSample(id, updateData);
      
      res.json({ 
        message: "Piano sample updated successfully", 
        sample 
      });
    } catch (error) {
      console.error("Error updating piano sample:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid piano sample data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update piano sample" });
    }
  });

  // Delete piano sample (admin only)
  app.delete("/api/admin/piano-samples/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePianoSample(id);
      
      res.json({ message: "Piano sample deleted successfully" });
    } catch (error) {
      console.error("Error deleting piano sample:", error);
      res.status(500).json({ error: "Failed to delete piano sample" });
    }
  });

  // Get live performances (public endpoint)
  app.get("/api/live-performances", async (req, res) => {
    try {
      const performances = await storage.getLivePerformances();
      res.json(performances);
    } catch (error) {
      console.error("Error fetching live performances:", error);
      res.status(500).json({ error: "Failed to fetch live performances" });
    }
  });

  // Create live performance (admin only)
  app.post("/api/admin/live-performances", requireAdminSession, async (req, res) => {
    try {
      const validatedData = insertLivePerformanceSchema.parse(req.body);
      const performance = await storage.createLivePerformance(validatedData);
      
      res.status(201).json({ 
        message: "Live performance created successfully", 
        performance 
      });
    } catch (error) {
      console.error("Error creating live performance:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid live performance data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create live performance" });
    }
  });

  // Update live performance (admin only)
  app.put("/api/admin/live-performances/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertLivePerformanceSchema.partial().parse(req.body);
      
      const performance = await storage.updateLivePerformance(id, updateData);
      
      res.json({ 
        message: "Live performance updated successfully", 
        performance 
      });
    } catch (error) {
      console.error("Error updating live performance:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid live performance data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update live performance" });
    }
  });

  // Delete live performance (admin only)
  app.delete("/api/admin/live-performances/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLivePerformance(id);
      
      res.json({ message: "Live performance deleted successfully" });
    } catch (error) {
      console.error("Error deleting live performance:", error);
      res.status(500).json({ error: "Failed to delete live performance" });
    }
  });

  // Services management endpoints

  // Get all services (public)
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Get services by category (public)
  app.get("/api/services/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const services = await storage.getServicesByCategory(category);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services by category:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Admin services endpoints
  app.get("/api/admin/services", requireAdminSession, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching admin services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", requireAdminSession, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json({ message: "Service created successfully", service });
    } catch (error) {
      console.error("Error creating service:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid service data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/admin/services/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, updateData);
      res.json({ message: "Service updated successfully", service });
    } catch (error) {
      console.error("Error updating service:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid service data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteService(id);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Leads management endpoints

  // Create lead (public - from contact forms)
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.status(201).json({ message: "Lead created successfully", lead });
    } catch (error) {
      console.error("Error creating lead:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid lead data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  // Admin leads endpoints
  app.get("/api/admin/leads", requireAdminSession, async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/admin/leads/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.put("/api/admin/leads/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertLeadSchema.partial().parse(req.body);
      const lead = await storage.updateLead(id, updateData);
      res.json({ message: "Lead updated successfully", lead });
    } catch (error) {
      console.error("Error updating lead:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid lead data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  app.delete("/api/admin/leads/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLead(id);
      res.json({ message: "Lead deleted successfully" });
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // Orders management endpoints (admin only)
  app.get("/api/admin/orders", requireAdminSession, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/admin/orders", requireAdminSession, async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.put("/api/admin/orders/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(id, updateData);
      res.json({ message: "Order updated successfully", order });
    } catch (error) {
      console.error("Error updating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.delete("/api/admin/orders/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteOrder(id);
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // Media management endpoints (admin only)
  app.get("/api/admin/media", requireAdminSession, async (req, res) => {
    try {
      const mediaFiles = await storage.getMediaFiles();
      res.json(mediaFiles);
    } catch (error) {
      console.error("Error fetching media files:", error);
      res.status(500).json({ error: "Failed to fetch media files" });
    }
  });

  app.post("/api/admin/media", requireAdminSession, async (req, res) => {
    try {
      const validatedData = insertMediaSchema.parse(req.body);
      const mediaFile = await storage.createMediaFile(validatedData);
      res.status(201).json({ message: "Media file created successfully", mediaFile });
    } catch (error) {
      console.error("Error creating media file:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid media data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create media file" });
    }
  });

  app.put("/api/admin/media/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertMediaSchema.partial().parse(req.body);
      const mediaFile = await storage.updateMediaFile(id, updateData);
      res.json({ message: "Media file updated successfully", mediaFile });
    } catch (error) {
      console.error("Error updating media file:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid media data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update media file" });
    }
  });

  app.delete("/api/admin/media/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMediaFile(id);
      res.json({ message: "Media file deleted successfully" });
    } catch (error) {
      console.error("Error deleting media file:", error);
      res.status(500).json({ error: "Failed to delete media file" });
    }
  });

  // Site Configuration Management Endpoints

  // Get all site configurations (admin only)
  app.get("/api/admin/site-config", requireAdminSession, async (req, res) => {
    try {
      const configs = await storage.getSiteConfigs();
      res.json(configs);
    } catch (error) {
      console.error("Error fetching site configurations:", error);
      res.status(500).json({ error: "Failed to fetch site configurations" });
    }
  });

  // Get site configurations by section (admin only)
  app.get("/api/admin/site-config/section/:section", requireAdminSession, async (req, res) => {
    try {
      const { section } = req.params;
      const configs = await storage.getSiteConfigsBySection(section);
      res.json(configs);
    } catch (error) {
      console.error("Error fetching site configurations by section:", error);
      res.status(500).json({ error: "Failed to fetch site configurations" });
    }
  });

  // Create site configuration (admin only)
  app.post("/api/admin/site-config", requireAdminSession, async (req, res) => {
    try {
      const validatedData = insertSiteConfigSchema.parse(req.body);
      const config = await storage.createSiteConfig(validatedData);
      res.status(201).json({ message: "Site configuration created successfully", config });
    } catch (error) {
      console.error("Error creating site configuration:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid configuration data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create site configuration" });
    }
  });

  // Update site configuration (admin only)
  app.put("/api/admin/site-config/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertSiteConfigSchema.partial().parse(req.body);
      const config = await storage.updateSiteConfig(id, updateData);
      res.json({ message: "Site configuration updated successfully", config });
    } catch (error) {
      console.error("Error updating site configuration:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid configuration data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update site configuration" });
    }
  });

  // Delete site configuration (admin only)
  app.delete("/api/admin/site-config/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSiteConfig(id);
      res.json({ message: "Site configuration deleted successfully" });
    } catch (error) {
      console.error("Error deleting site configuration:", error);
      res.status(500).json({ error: "Failed to delete site configuration" });
    }
  });

  // Page Content Management Endpoints

  // Get all page contents (admin only)
  app.get("/api/admin/page-content", requireAdminSession, async (req, res) => {
    try {
      const contents = await storage.getPageContents();
      res.json(contents);
    } catch (error) {
      console.error("Error fetching page contents:", error);
      res.status(500).json({ error: "Failed to fetch page contents" });
    }
  });

  // Get page contents by page (admin only)
  app.get("/api/admin/page-content/page/:page", requireAdminSession, async (req, res) => {
    try {
      const { page } = req.params;
      const contents = await storage.getPageContentsByPage(page);
      res.json(contents);
    } catch (error) {
      console.error("Error fetching page contents by page:", error);
      res.status(500).json({ error: "Failed to fetch page contents" });
    }
  });

  // Public endpoint for page content (for dynamic loading)
  app.get("/api/page-content/:page", async (req, res) => {
    try {
      const { page } = req.params;
      const contents = await storage.getPageContentsByPage(page);
      res.json(contents);
    } catch (error) {
      console.error("Error fetching page contents:", error);
      res.status(500).json({ error: "Failed to fetch page contents" });
    }
  });

  // Create page content (admin only)
  app.post("/api/admin/page-content", requireAdminSession, async (req, res) => {
    try {
      const validatedData = insertPageContentSchema.parse(req.body);
      const content = await storage.createPageContent(validatedData);
      res.status(201).json({ message: "Page content created successfully", content });
    } catch (error) {
      console.error("Error creating page content:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid content data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create page content" });
    }
  });

  // Update page content (admin only)
  app.put("/api/admin/page-content/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertPageContentSchema.partial().parse(req.body);
      const content = await storage.updatePageContent(id, updateData);
      res.json({ message: "Page content updated successfully", content });
    } catch (error) {
      console.error("Error updating page content:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid content data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update page content" });
    }
  });

  // Delete page content (admin only)
  app.delete("/api/admin/page-content/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePageContent(id);
      res.json({ message: "Page content deleted successfully" });
    } catch (error) {
      console.error("Error deleting page content:", error);
      res.status(500).json({ error: "Failed to delete page content" });
    }
  });

  // Theme Configuration Management Endpoints

  // Get all theme configurations (admin only)
  app.get("/api/admin/themes", requireAdminSession, async (req, res) => {
    try {
      const themes = await storage.getThemeConfigs();
      res.json(themes);
    } catch (error) {
      console.error("Error fetching themes:", error);
      res.status(500).json({ error: "Failed to fetch themes" });
    }
  });

  // Get active theme (public)
  app.get("/api/theme/active", async (req, res) => {
    try {
      const theme = await storage.getActiveTheme();
      res.json(theme || { colors: {}, fonts: {}, spacing: {} });
    } catch (error) {
      console.error("Error fetching active theme:", error);
      res.status(500).json({ error: "Failed to fetch active theme" });
    }
  });

  // Create theme configuration (admin only)
  app.post("/api/admin/themes", requireAdminSession, async (req, res) => {
    try {
      const validatedData = insertThemeConfigSchema.parse(req.body);
      const theme = await storage.createThemeConfig(validatedData);
      res.status(201).json({ message: "Theme created successfully", theme });
    } catch (error) {
      console.error("Error creating theme:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid theme data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create theme" });
    }
  });

  // Update theme configuration (admin only)
  app.put("/api/admin/themes/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertThemeConfigSchema.partial().parse(req.body);
      const theme = await storage.updateThemeConfig(id, updateData);
      res.json({ message: "Theme updated successfully", theme });
    } catch (error) {
      console.error("Error updating theme:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid theme data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update theme" });
    }
  });

  // Set active theme (admin only)
  app.post("/api/admin/themes/:id/activate", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const theme = await storage.setActiveTheme(id);
      res.json({ message: "Theme activated successfully", theme });
    } catch (error) {
      console.error("Error activating theme:", error);
      res.status(500).json({ error: "Failed to activate theme" });
    }
  });

  // Delete theme configuration (admin only)
  app.delete("/api/admin/themes/:id", requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteThemeConfig(id);
      res.json({ message: "Theme deleted successfully" });
    } catch (error) {
      console.error("Error deleting theme:", error);
      res.status(500).json({ error: "Failed to delete theme" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
