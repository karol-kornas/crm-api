import request from "supertest";
import app from "@/app";
import { CreateProjectParams, IProject } from "@/types/project";

export async function createProject(token: string, data?: Partial<CreateProjectParams>) {
  const defaultData = {
    name: "Test project",
    description: "description project",
    deadline: "2030-09-30",
    tags: ["CRM", "backend"],
  };

  const projectData = data ?? defaultData;

  const res = await request(app).post("/api/projects/").send(projectData).set("Authorization", `Bearer ${token}`);

  return res;
}

export async function deleteProject(token: string, slug: string) {
  const res = await request(app).delete(`/api/projects/${slug}`).set("Authorization", `Bearer ${token}`);
  return res;
}
