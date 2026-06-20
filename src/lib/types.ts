export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  category: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  case_study_url?: string;
  tech_stack: string[];
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  client_name?: string;
  duration?: string;
  role?: string;
  results?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url?: string;
  meta_description?: string;
  read_time: number;
  published: boolean;
  featured: boolean;
  tags: string[];
  views: number;
  created_at: string;
  updated_at: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  project_type?: string;
  budget?: string;
  message: string;
  status: "unread" | "read" | "replied";
  ip_address?: string;
  created_at: string;
};

export type Setting = {
  id: string;
  key: string;
  value: string;
  updated_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  ip_address?: string;
  created_at: string;
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};
