'use client';

import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import ClientsTable from "@/components/ClientsTable";
import { Users, DollarSign, ClipboardList } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-8 w-full min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Welcome back!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Clients" value="50" icon={<Users className="w-5 h-5" />} />
          <StatCard title="Revenue" value="$120k" icon={<DollarSign className="w-5 h-5" />} />
          <StatCard title="Tasks" value="8" icon={<ClipboardList className="w-5 h-5" />} />
        </div>
        <ClientsTable />
      </main>
    </div>
  );
}
