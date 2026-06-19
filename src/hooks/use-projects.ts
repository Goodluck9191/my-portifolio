"use client";

import { useState, useEffect } from "react";
import type { Project } from "@/lib/types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featured, setFeatured] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, featuredRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/projects?featured=true"),
        ]);
        const projectsData = await projectsRes.json();
        const featuredData = await featuredRes.json();
        setProjects(projectsData.data ?? []);
        setFeatured(featuredData.data ?? []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { projects, featured, loading };
}
