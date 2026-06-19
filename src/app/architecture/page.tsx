"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Network,
  Database,
  GitBranch,
  Shield,
  Zap,
  BarChart3,
  Server,
  ArrowRight,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlogCard } from "@/components/ui/BlogCard";
import { MermaidDiagram } from "@/components/ui/MermaidDiagram";

const tabs = [
  {
    id: "microservices",
    label: "Microservices",
    icon: Layers,
    chart: `graph TD
    A[Client] -->|API Gateway| B[Auth Service]
    A -->|API Gateway| C[User Service]
    A -->|API Gateway| D[Order Service]
    A -->|API Gateway| E[Payment Service]
    B --> F[(Auth DB)]
    C --> G[(User DB)]
    D --> H[(Order DB)]
    E --> I[(Payment DB)]
    D -->|Message Queue| E`,
    caption:
      "Services communicate through an API gateway and async message queues for loose coupling and independent scaling.",
  },
  {
    id: "api",
    label: "API Design",
    icon: Network,
    chart: `sequenceDiagram
    participant C as Client
    participant G as API Gateway
    participant A as Auth Middleware
    participant H as Handler
    participant D as Database

    C->>G: HTTP Request
    G->>A: Validate Token
    A-->>G: Token Valid
    G->>H: Forward Request
    H->>D: Query Data
    D-->>H: Result
    H-->>G: JSON Response
    G-->>C: 200 OK`,
    caption:
      "RESTful API design with middleware layers for authentication, rate limiting, and request validation.",
  },
  {
    id: "database",
    label: "Database",
    icon: Database,
    chart: `erDiagram
    User ||--o{ Order : places
    Order ||--|{ OrderItem : contains
    Product ||--o{ OrderItem : includes
    User {
      int id PK
      string name
      string email
    }
    Order {
      int id PK
      int user_id FK
      datetime created_at
      string status
    }
    OrderItem {
      int id PK
      int order_id FK
      int product_id FK
      int quantity
    }
    Product {
      int id PK
      string name
      float price
    }`,
    caption:
      "Relational schema designed for referential integrity, with indexed foreign keys for query performance.",
  },
  {
    id: "cicd",
    label: "CI/CD",
    icon: GitBranch,
    chart: `graph LR
    A[Push Code] --> B[GitHub]
    B --> C[Run Tests]
    C -->|Pass| D[Build]
    C -->|Fail| E[Notify]
    D --> F[Deploy Staging]
    F --> G[Integration Tests]
    G -->|Pass| H[Deploy Production]
    G -->|Fail| I[Rollback]
    H --> J[Monitor]
    I --> B`,
    caption:
      "Automated pipeline that tests, builds, and deploys code with zero-downtime deployments and instant rollback.",
  },
];

const articles = [
  {
    image: "/images/placeholder.svg",
    category: "System Design",
    title: "Scaling Web Apps with Microservices",
    excerpt: "A practical guide to breaking monoliths into manageable services, handling service discovery, and managing inter-service communication.",
    date: "Feb 2026",
    readTime: "8 min read",
    slug: "scaling-microservices",
  },
  {
    image: "/images/placeholder.svg",
    category: "Performance",
    title: "Database Optimization at Scale",
    excerpt: "Indexing strategies, query optimization, and connection pooling techniques for handling millions of requests per day.",
    date: "Jan 2026",
    readTime: "6 min read",
    slug: "database-optimization",
  },
  {
    image: "/images/placeholder.svg",
    category: "DevOps",
    title: "CI/CD Pipelines for Solo Devs",
    excerpt: "How to set up production-grade CI/CD pipelines even when you're a team of one. Automate testing, building, and deployment.",
    date: "Dec 2025",
    readTime: "5 min read",
    slug: "cicd-solo-devs",
  },
  {
    image: "/images/placeholder.svg",
    category: "Architecture",
    title: "API Gateway Patterns Compared",
    excerpt: "A comparison of gateway strategies — reverse proxy, BFF, and GraphQL federation — and when to use each.",
    date: "Nov 2025",
    readTime: "7 min read",
    slug: "api-gateway-patterns",
  },
  {
    image: "/images/placeholder.svg",
    category: "Backend",
    title: "Message Queues vs Event Streams",
    excerpt: "Understanding the difference between RabbitMQ-style queues and Kafka-style event streams for async architecture.",
    date: "Oct 2025",
    readTime: "6 min read",
    slug: "queues-vs-streams",
  },
  {
    image: "/images/placeholder.svg",
    category: "Security",
    title: "Securing Your Web Application",
    excerpt: "Essential security practices — rate limiting, input validation, CORS policies, and authentication best practices.",
    date: "Sep 2025",
    readTime: "9 min read",
    slug: "web-security-essentials",
  },
];

const scalabilityCards = [
  {
    icon: Zap,
    stat: "1M+",
    label: "Requests per Day",
    description:
      "Horizontal scaling with load balancers, caching layers, and read replicas to handle traffic spikes.",
  },
  {
    icon: Database,
    stat: "<50ms",
    label: "Query Response Time",
    description:
      "Optimized queries, covering indexes, and connection pooling reduce database latency even under load.",
  },
  {
    icon: Shield,
    stat: "99.9%",
    label: "Uptime SLA",
    description:
      "Redundant deployments across availability zones with health checks and automated failover.",
  },
  {
    icon: BarChart3,
    stat: "10x",
    label: "Faster Deployments",
    description:
      "Parallelized CI/CD pipelines and containerized services cut deployment time from hours to minutes.",
  },
];

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <>
      <Section darkBg padding="lg">
        <div className="flex flex-col items-center gap-4 pt-8 text-center">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            How I Build
            <br />
            <span className="bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] bg-clip-text text-transparent">
              Scalable Systems
            </span>
          </h1>
          <p className="max-w-2xl font-sans text-base text-[#7A7A9A] md:text-lg">
            Architecture patterns, design decisions, and systems thinking —
            the engineering principles behind every project I deliver.
          </p>
        </div>
      </Section>

      <Section id="philosophy">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
          <div className="md:w-2/5">
            <blockquote className="border-l-4 border-[#6C63FF] pl-6">
              <p className="font-display text-2xl leading-snug text-white md:text-3xl">
                &ldquo;Good architecture isn&apos;t about building for scale
                you&apos;ll never reach &mdash; it&apos;s about building so
                you <em>can</em> scale when the time comes.&rdquo;
              </p>
              <footer className="mt-4 font-sans text-sm text-[#7A7A9A]">
                &mdash; Goodluck Prosper
              </footer>
            </blockquote>
          </div>
          <div className="flex flex-col gap-5 md:w-3/5">
            {[
              {
                icon: Server,
                title: "Simplicity First",
                desc: "Start simple, measure, then optimize. Over-engineering is the enemy of delivery.",
              },
              {
                icon: Shield,
                title: "Defense in Depth",
                desc: "Every layer validates, sanitizes, and protects. Security isn't an afterthought, it's baked in.",
              },
              {
                icon: Zap,
                title: "Performance by Default",
                desc: "Fast load times, minimal dependencies, and efficient queries are the baseline, not a feature.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-5 py-4 transition-all duration-200 hover:border-[#6C63FF]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/20">
                  <Icon size={18} className="text-[#6C63FF]" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {title}
                  </h3>
                  <p className="font-sans text-sm text-[#7A7A9A]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="diagrams" darkBg>
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Architecture Diagrams
          </h2>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-white"
                      : "border border-[#22223A] bg-transparent text-[#7A7A9A] hover:text-[#EEEEFF]"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <MermaidDiagram chart={currentTab.chart} caption={currentTab.caption} />

          <div className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-5 py-4">
            <h3 className="font-display text-base font-semibold text-white">
              {currentTab.label} — Key Takeaways
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5 font-sans text-sm text-[#7A7A9A]">
              {currentTab.id === "microservices" && (
                <>
                  <li>• API Gateway handles routing, auth, and rate limiting</li>
                  <li>• Each service owns its data store — no shared databases</li>
                  <li>• Async communication via message queues for durability</li>
                </>
              )}
              {currentTab.id === "api" && (
                <>
                  <li>• Consistent error responses with descriptive status codes</li>
                  <li>• Middleware chain for auth, validation, and logging</li>
                  <li>• Versioned endpoints for backward compatibility</li>
                </>
              )}
              {currentTab.id === "database" && (
                <>
                  <li>• Index foreign keys and frequently queried columns</li>
                  <li>• Use migrations for schema changes, never raw SQL</li>
                  <li>• Read replicas for reporting and analytics queries</li>
                </>
              )}
              {currentTab.id === "cicd" && (
                <>
                  <li>• Tests must pass before deployment proceeds</li>
                  <li>• Staging environment mirrors production configuration</li>
                  <li>• Automated rollback on health check failure</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="articles">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Architecture Articles
            </h2>
            <Link
              href="/blog"
              className="hidden items-center gap-1 font-sans text-sm text-[#6C63FF] transition-colors hover:text-[#00D4FF] md:flex"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <BlogCard key={article.slug} href={`/blog/${article.slug}`} {...article} />
            ))}
          </div>
          <Link
            href="/blog"
            className="flex items-center justify-center gap-1 font-sans text-sm text-[#6C63FF] transition-colors hover:text-[#00D4FF] md:hidden"
          >
            View all articles <ArrowRight size={14} />
          </Link>
        </div>
      </Section>

      <Section id="scalability" darkBg>
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Scalability in Practice
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {scalabilityCards.map(({ icon: Icon, stat, label, description }) => (
              <div
                key={label}
                className="flex flex-col gap-3 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-5 py-6 transition-all duration-200 hover:border-[#6C63FF] hover:translate-y-[-2px]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/20">
                  <Icon size={18} className="text-[#6C63FF]" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-bold text-white">
                    {stat}
                  </span>
                  <span className="font-sans text-sm text-[#7A7A9A]">
                    {label}
                  </span>
                </div>
                <p className="font-sans text-sm leading-relaxed text-[#7A7A9A]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
