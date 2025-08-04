import request from "supertest";
import app from "@/app";
import { ENVIRONMENTS } from "@/constants/enums";
import { ProjectCredentialInput } from "@/types/projects/input.type";
import {
  ProjectBody,
  ProjectCredentialBody,
  ProjectMembersBody,
  UpdateProjectCredentialBody,
} from "@/types/projects/body.type";

export async function createProject(token: string, data?: ProjectBody) {
  const defaultData = {
    projectData: {
      name: "Test project",
      description: "description project",
      deadline: "2030-09-30",
      tags: ["CRM", "backend"],
    },
  };

  const projectData = data ?? defaultData;

  const res = await request(app)
    .post("/api/projects/")
    .send(projectData)
    .set("Authorization", `Bearer ${token}`);

  return res;
}

export async function deleteProject(token: string, slug: string) {
  const res = await request(app).delete(`/api/projects/${slug}`).set("Authorization", `Bearer ${token}`);
  return res;
}

export async function addCredential(token: string, projectSlug: string, data?: ProjectCredentialBody) {
  const defaultData = {
    credentialData: {
      name: "Dane do panelu admina",
      url: "www.test-page.pl/admin",
      username: "test",
      password: "Test123!",
      environment: ENVIRONMENTS[1],
    },
  };

  const credentialData = data ?? defaultData;

  const res = await request(app)
    .post(`/api/projects/${projectSlug}/credentials`)
    .send(credentialData)
    .set("Authorization", `Bearer ${token}`);

  return res;
}

export async function removeCredential(token: string, projectSlug: string, id: string) {
  const res = await request(app)
    .delete(`/api/projects/${projectSlug}/credentials/${id}`)
    .set("Authorization", `Bearer ${token}`);

  return res;
}

export async function updateCredential(
  token: string,
  projectSlug: string,
  id: string,
  data?: UpdateProjectCredentialBody
) {
  const defaultData = {
    credentialData: {
      username: "newUser",
      password: "Test123456!",
    },
  };

  const credentialUpdateData = data ?? defaultData;
  const res = await request(app)
    .patch(`/api/projects/${projectSlug}/credentials/${id}`)
    .send(credentialUpdateData)
    .set("Authorization", `Bearer ${token}`);

  return res;
}

export async function addMembers(token: string, projectSlug: string, data: ProjectMembersBody) {
  const res = await request(app)
    .post(`/api/projects/${projectSlug}/members`)
    .send(data)
    .set("Authorization", `Bearer ${token}`);

  return res;
}

export async function setMembers(token: string, projectSlug: string, data: ProjectMembersBody) {
  const res = await request(app)
    .put(`/api/projects/${projectSlug}/members`)
    .send(data)
    .set("Authorization", `Bearer ${token}`);

  return res;
}
