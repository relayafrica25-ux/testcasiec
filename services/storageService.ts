import axios from 'axios';
import { Article, LoanApplication, ContactInquiry, NewsletterSubscription, TickerItem, CarouselItem, TeamMember, Campaign } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const ARTICLES_KEY = 'casiec_articles';
const APPLICATIONS_KEY = 'casiec_applications';
const INQUIRIES_KEY = 'casiec_inquiries';
const NEWSLETTER_KEY = 'casiec_newsletter';
const TICKER_KEY = 'casiec_ticker_manual';
const USERS_KEY = 'casiec_admin_users';
const CAROUSEL_KEY = 'casiec_carousel_items';
const TEAM_KEY = 'casiec_team_members';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('casiec_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('casiec_refresh_token');

      // If no refresh token, don't even try to refresh - just reject the 401
      if (!refreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use axios directly to avoid interceptor interference during refresh
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const { access_token, refresh_token: new_refresh_token } = response.data;
        localStorage.setItem('casiec_token', access_token);
        if (new_refresh_token) {
          localStorage.setItem('casiec_refresh_token', new_refresh_token);
        }

        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);
        isRefreshing = false;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        // Clear tokens on definitive failure
        localStorage.removeItem('casiec_token');
        localStorage.removeItem('casiec_refresh_token');

        // Only redirect if we are not already on the home/login page to avoid loops
        if (!window.location.hash.includes('home') && !window.location.pathname.includes('login')) {
          window.location.hash = 'home';
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Utility for phone normalization
export const normalizePhoneNumber = (phone: string) => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  if (!cleaned.startsWith('234')) {
    cleaned = '234' + cleaned;
  }
  return '+' + cleaned;
};

export const storageService = {
  // Articles
  getArticles: async (): Promise<Article[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/article`);
      return response.data.map((item: any) => ({
        id: item.id,
        title: item.headline,
        excerpt: item.summary,
        category: item.category,
        readTime: item.readTime || '5 min read',
        author: item.author || 'CASIEC Editorial',
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        imageGradient: item.imageGradient || 'from-gray-900 to-black',
        imageUrl: item.image,
        content: item.content
      }));
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      return [];
    }
  },

  saveArticle: async (article: Article, file?: File | null) => {
    try {
      const isUpdate = article.id && !article.id.startsWith('temp-');
      const url = isUpdate ? `${API_BASE_URL}/article/${article.id}` : `${API_BASE_URL}/article`;

      if (file) {
        // Multipart Upload
        const formData = new FormData();
        formData.append('headline', article.title);
        formData.append('summary', article.excerpt);
        formData.append('category', article.category);
        formData.append('readTime', article.readTime);
        formData.append('author', article.author);
        formData.append('imageGradient', article.imageGradient);
        if (article.content) formData.append('content', article.content);

        // Use key 'image' for the file part as requested
        formData.append('image', file);

        if (isUpdate) {
          await api.patch(url, formData);
        } else {
          await api.post(url, formData);
        }
      } else {
        // Standard JSON Payload
        const payload = {
          headline: article.title,
          summary: article.excerpt,
          category: article.category,
          image: article.imageUrl, // Existing string
          readTime: article.readTime,
          author: article.author,
          imageGradient: article.imageGradient,
          content: article.content
        };
        if (isUpdate) {
          await api.patch(url, payload);
        } else {
          await api.post(url, payload);
        }
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      throw error;
    }
  },

  deleteArticle: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/article/${id}`);
    } catch (error) {
      console.error('Failed to delete article:', error);
      throw error;
    }
  },

  getTeamMembers: async (): Promise<TeamMember[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/team`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      return [];
    }
  },

  saveTeamMember: async (member: TeamMember, file?: File | null) => {
    try {
      const isUpdate = member.id && !member.id.startsWith('temp-');
      const url = isUpdate ? `${API_BASE_URL}/team/${member.id}` : `${API_BASE_URL}/team`;

      if (file) {
        const formData = new FormData();
        formData.append('name', member.name);
        formData.append('role', member.role);
        formData.append('bio', member.bio);
        formData.append('specialization', member.specialization);
        if (member.linkedin) formData.append('linkedin', member.linkedin);
        if (member.twitter) formData.append('twitter', member.twitter);
        if (member.email) formData.append('email', member.email);
        formData.append('imageGradient', member.imageGradient || 'from-blue-600 to-indigo-900');

        // Append raw file
        formData.append('image', file);

        if (isUpdate) {
          await api.patch(url, formData);
        } else {
          await api.post(url, formData);
        }
      } else {
        const { id, ...payload } = member;
        if (isUpdate) {
          await api.patch(url, payload);
        } else {
          await api.post(url, payload);
        }
      }
    } catch (error) {
      console.error('Failed to save team member:', error);
      throw error;
    }
  },

  deleteTeamMember: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/team/${id}`);
    } catch (error) {
      console.error('Failed to delete team member:', error);
      throw error;
    }
  },

  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/campaign`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      return [];
    }
  },

  saveCampaign: async (campaign: Partial<Campaign>, imageFile?: File | null) => {
    try {
      const isUpdate = campaign.id && !campaign.id.startsWith('temp-');
      const url = isUpdate ? `${API_BASE_URL}/campaign/${campaign.id}` : `${API_BASE_URL}/campaign`;

      if (imageFile) {
        const formData = new FormData();
        formData.append('headline', campaign.headline || '');
        formData.append('summary', campaign.summary || '');
        formData.append('contextType', campaign.contextType || 'advert');
        formData.append('tag', campaign.tag || 'Active');
        if (campaign.url) formData.append('url', campaign.url);

        // Append raw file. DO NOT include string 'image' field in this payload.
        formData.append('image', imageFile);

        if (isUpdate) {
          await api.patch(url, formData);
        } else {
          await api.post(url, formData);
        }
      } else {
        // Pure JSON for text updates
        const { id, ...payload } = campaign;
        if (isUpdate) {
          await api.patch(url, payload);
        } else {
          await api.post(url, payload);
        }
      }
    } catch (error) {
      console.error('Failed to save campaign:', error);
      throw error;
    }
  },

  deleteCampaign: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/campaign/${id}`);
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      throw error;
    }
  },

  getCarouselItems: async (): Promise<CarouselItem[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/carousel`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch carousel items:', error);
      return [];
    }
  },

  saveCarouselItem: async (item: CarouselItem) => {
    try {
      if (item.id && !item.id.startsWith('temp-')) {
        await api.patch(`${API_BASE_URL}/carousel/${item.id}`, item);
      } else {
        const { id, ...payload } = item;
        await api.post(`${API_BASE_URL}/carousel`, payload);
      }
    } catch (error) {
      console.error('Failed to save carousel item:', error);
      throw error;
    }
  },

  deleteCarouselItem: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/carousel/${id}`);
    } catch (error) {
      console.error('Failed to delete carousel item:', error);
      throw error;
    }
  },

  // Applications
  getApplications: async (): Promise<LoanApplication[]> => {
    try {
      const [financeRes, supportRes] = await Promise.all([
        api.get(`${API_BASE_URL}/finance`),
        api.get(`${API_BASE_URL}/support`)
      ]);

      const financeApps = financeRes.data.map((app: any) => ({
        id: app.id,
        date: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        type: 'financial',
        loanType: app.financialProduct,
        businessName: app.businessName,
        cacNumber: app.regNumber,
        industry: app.industryFocus,
        fullName: app.fullName,
        role: app.designatedRole,
        email: app.email,
        phone: app.phone,
        description: app.requirement,
        status: app.status || 'Pending'
      }));

      const supportApps = supportRes.data.map((app: any) => ({
        id: app.id,
        date: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        type: 'business_support',
        serviceType: app.advisoryPillars,
        businessName: app.businessName,
        cacNumber: app.regNumber,
        industry: app.industryFocus,
        fullName: app.fullName,
        role: app.designatedRole,
        email: app.email,
        phone: app.phone,
        description: app.requirement,
        status: app.status || 'Pending'
      }));

      return [...financeApps, ...supportApps].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      return [];
    }
  },

  saveApplication: async (app: LoanApplication) => {
    const endpoint = app.type === 'financial' ? 'finance' : 'support';
    const payload = {
      fullName: app.fullName,
      email: app.email,
      phone: normalizePhoneNumber(app.phone),
      designatedRole: app.role,
      businessName: app.businessName,
      isRegistered: app.cacNumber ? true : false,
      regNumber: app.cacNumber,
      industryFocus: app.industry,
      requirement: app.description,
      [app.type === 'financial' ? 'financialProduct' : 'advisoryPillars']: app.loanType || app.serviceType
    };
    try {
      await api.post(`${API_BASE_URL}/${endpoint}`, payload);
    } catch (error) {
      console.error(`Failed to save ${app.type} application:`, error);
      throw error;
    }
  },

  updateApplicationStatus: async (id: string, status: LoanApplication['status']) => {
    // We determine the correct endpoint by fetching the application first or by convention
    // Since we don't have a single "application" table in backend yet, we might need to try both or add it.
    // For now, let's assume we can try to patch both or add a generic application module.
    try {
      // Try finance first - send status in lowercase
      await api.patch(`${API_BASE_URL}/finance/${id}`, { status: status.toLowerCase() });
    } catch (e) {
      try {
        // Try support if finance fails - send status in lowercase
        await api.patch(`${API_BASE_URL}/support/${id}`, { status: status.toLowerCase() });
      } catch (err) {
        console.error('Failed to update application status:', err);
      }
    }
  },

  deleteApplication: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/finance/${id}`);
    } catch (e) {
      try {
        await api.delete(`${API_BASE_URL}/support/${id}`);
      } catch (err) {
        console.error('Failed to delete application:', err);
      }
    }
  },

  // Inquiries
  getInquiries: async (): Promise<ContactInquiry[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/contact`);
      return response.data.map((item: any) => ({
        id: item.id,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        fullName: item.fullName || 'Anonymous',
        email: item.email,
        subject: item.subject || 'Newsletter/General',
        message: item.message || 'No message provided',
        status: item.status || 'Unread',
        opened: item.opened || false
      }));
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      return [];
    }
  },

  saveInquiry: async (inquiry: ContactInquiry) => {
    try {
      await api.post(`${API_BASE_URL}/contact`, {
        email: inquiry.email.toLowerCase(),
        fullName: inquiry.fullName,
        subject: inquiry.subject,
        message: inquiry.message,
        phone: inquiry.phone ? normalizePhoneNumber(inquiry.phone) : undefined
      });
      return { success: true };
    } catch (error: any) {
      console.error('Failed to save inquiry:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send inquiry',
        statusCode: error.response?.status
      };
    }
  },

  updateInquiryStatus: async (id: string, status: ContactInquiry['status']) => {
    try {
      await api.patch(`${API_BASE_URL}/contact/${id}`, { status });
    } catch (error) {
      console.error('Failed to update inquiry status:', error);
    }
  },

  updateContactOpened: async (id: string) => {
    try {
      await api.put(`${API_BASE_URL}/contact/${id}/opened`);
    } catch (error) {
      console.error('Failed to update contact opened status:', error);
    }
  },

  deleteInquiry: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/contact/${id}`);
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
    }
  },

  getManualTickerItems: async (): Promise<TickerItem[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/ticker`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch ticker items:', error);
      return [];
    }
  },

  saveTickerItem: async (item: TickerItem) => {
    try {
      await api.post(`${API_BASE_URL}/ticker`, {
        text: item.text,
        category: item.category,
        isManual: item.isManual
      });
    } catch (error) {
      console.error('Failed to save ticker item:', error);
      throw error;
    }
  },

  deleteTickerItem: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/ticker/${id}`);
    } catch (error) {
      console.error('Failed to delete ticker item:', error);
      throw error;
    }
  },

  // Newsletter Subscriptions
  getNewsletterSubscriptions: async (): Promise<NewsletterSubscription[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/contact`);
      // Filter for newsletter-style inquiries or create a separate endpoint in future
      return response.data.filter((i: any) => !i.subject);
    } catch (error) {
      console.error('Failed to fetch newsletter subscriptions:', error);
      return [];
    }
  },

  saveNewsletterSubscription: async (email: string): Promise<{ success: boolean; message?: string; statusCode?: number }> => {
    try {
      await api.post(`${API_BASE_URL}/contact`, { email: email.toLowerCase() });
      return { success: true };
    } catch (error) {
      console.error('Failed to save newsletter subscription:', error);
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const message = error.response?.data?.message || 'Failed to subscribe';
        return { success: false, message, statusCode };
      }
      return { success: false, message: 'An unexpected error occurred' };
    }
  },

  // Auth
  openAccessLogin: async () => {
    try {
      // Use specific open-access credentials if backend supports it
      // or a generic staff account that is permitted for simulation
      const response = await api.post(`${API_BASE_URL}/auth/login`, {
        email: 'staff@casiecfinancials.com', // Demo/Staff access
        password: 'open-access-sim'
      });

      if (response.data.access_token) {
        localStorage.setItem('casiec_token', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('casiec_refresh_token', response.data.refresh_token);
        }
        return { success: true };
      }

      // If login returns success but no token, we might need 2FA (handle accordingly)
      return { success: true, data: response.data, requiresOTP: true };
    } catch (error) {
      console.error('Open Access login failed:', error);
      // Fallback for demo environments without real backend response
      return { success: false, message: 'Institutional link Failure' };
    }
  },

  loginStep1: async (emailOrUsername: string, password: string) => {
    console.log(emailOrUsername, password);
    try {
      const response = await api.post(`${API_BASE_URL}/auth/login`, {
        email: emailOrUsername,
        password: password
      });
      // Backend returns message and email if successful
      return { success: true, data: response.data, requiresOTP: true };
    } catch (error) {
      console.error('Login Step 1 failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        return { success: false, message: error.response.data.message || 'Authentication failed' };
      }
      return { success: false, message: 'Institutional link Failure' };
    }
  },

  verify2FA: async (email: string, code: string) => {
    try {
      const response = await api.post(`${API_BASE_URL}/auth/verify-2fa`, {
        email: email.toLowerCase(),
        code: code
      });

      if (response.data.access_token) {
        localStorage.setItem('casiec_token', response.data.access_token);

        // Store refresh token if provided
        if (response.data.refresh_token) {
          localStorage.setItem('casiec_refresh_token', response.data.refresh_token);
        }

        return { success: true, data: response.data };
      }
      return { success: false, message: 'Invalid Verification response' };
    } catch (error) {
      console.error('2FA verification failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        return { success: false, message: error.response.data.message || 'Verification failed' };
      }
      return { success: false, message: 'Link synchronization error' };
    }
  },

  logout: async () => {
    try {
      // Call backend logout endpoint if available
      await api.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout endpoint failed:', error);
      // Continue with local logout even if backend call fails
    } finally {
      // Clear all tokens from localStorage
      localStorage.removeItem('casiec_token');
      localStorage.removeItem('casiec_refresh_token');
    }
  }
};

