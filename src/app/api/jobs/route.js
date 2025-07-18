// src/app/api/jobs/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const jobs = await prisma.job.findMany({ orderBy: { dateApplied: "desc" } });
  return NextResponse.json(jobs);
}

export async function POST(request) {
  const data = await request.json();
  const created = await prisma.job.create({
    data: {
      company: data.company,
      position: data.position,
      dateApplied: new Date(data.dateApplied),
      status: data.status,
    },
  });
  return NextResponse.json(created);
}

export async function DELETE(request) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }
  await prisma.job.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
