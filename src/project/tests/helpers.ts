import request from "supertest";
import app from "@/app";
import { IProject } from "@/types/project";

export async function createProject(token: string, data?: Partial<IProject>) {
  const defaultData = {
    name: "Test project",
    description: "description project",
    deadline: "2025-09-30",
    tags: ["CRM", "backend"],
  };

  const projectData = data ?? defaultData;

  const res = await request(app).post("/api/project/create").send(projectData).set("Authorization", `Bearer ${token}`);

  return res;
}
