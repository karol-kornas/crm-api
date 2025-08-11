import request from "supertest";
import app from "@/app";
import { TicketBody, TicketCommentBody, TicketUpdateBody } from "@/types/ticktes/body.type";

export async function createTicket(token: string, projectId: string, projectSlug: string, data?: TicketBody) {
  const defaultData: TicketBody = {
    ticketData: {
      title: "New ticket",
      description: "Description ticket",
      projectId,
    },
  };

  const ticketData = data ?? defaultData;

  const res = await request(app)
    .post(`/api/projects/${projectSlug}/tickets`)
    .send(ticketData)
    .set("Authorization", `Bearer ${token}`);

  return res;
}

export async function updateTicket(token: string, ticketId: string, data?: TicketUpdateBody) {
  const defaultData: TicketUpdateBody = {
    ticketData: {
      title: "New ticket updated",
    },
  };

  const ticketData = data ?? defaultData;

  const res = await request(app)
    .patch(`/api/tickets/${ticketId}`)
    .send(ticketData)
    .set("Authorization", `Bearer ${token}`);

  return res;
}

export async function deleteTicket(token: string, ticketId: string) {
  const res = await request(app).delete(`/api/tickets/${ticketId}`).set("Authorization", `Bearer ${token}`);

  return res;
}

export async function getTickets(token: string, query?: string) {
  const res = await request(app).get(`/api/tickets?${query}`).set("Authorization", `Bearer ${token}`);

  return res;
}

export async function getTicket(token: string, ticketId: string) {
  const res = await request(app).get(`/api/tickets/${ticketId}`).set("Authorization", `Bearer ${token}`);

  return res;
}

export async function addComment(token: string, ticketId: string, data?: TicketCommentBody) {
  const defaultData: TicketCommentBody = {
    commentData: {
      text: "New comment",
    },
  };

  const commentData = data ?? defaultData;
  const res = await request(app)
    .post(`/api/tickets/${ticketId}/comments`)
    .send(commentData)
    .set("Authorization", `Bearer ${token}`);

  return res;
}

export async function removeComment(token: string, ticketId: string, commentId: string) {
  const res = await request(app)
    .delete(`/api/tickets/${ticketId}/comments/${commentId}`)
    .set("Authorization", `Bearer ${token}`);

  return res;
}
