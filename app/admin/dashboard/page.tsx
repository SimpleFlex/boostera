"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, DollarSign, Clock, CheckCircle2, AlertCircle, 
  Play, XCircle, Check, RefreshCw, Eye, Mail, Calendar 
} from "lucide-react";

interface Campaign {
  id: string;
  ca: string;
  packageName: string;
  amount: number;
  txHash: string;
  status: string;
  submittedAt: string;
  userEmail?: string;
  daysLeft?: number;
  expiresAt?: string;
  verifiedAt?: string;
  activatedAt?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>("pending");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    active: 0,
    revenue: 0,
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (!isLoggedIn) {
      router.push("/admin/login");
      return;
    }
    fetchCampaigns();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchCampaigns, 10000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/admin/campaigns");
      const data = await response.json();
      
      if (data.success && data.campaigns) {
        setCampaigns(data.campaigns);
        
        const pending = data.campaigns.filter((c: Campaign) => c.status === "pending").length;
        const verified = data.campaigns.filter((c: Campaign) => c.status === "verified").length;
        const active = data.campaigns.filter((c: Campaign) => c.status === "active").length;
        const revenue = data.campaigns
          .filter((c: Campaign) => c.status === "active" || c.status === "completed")
          .reduce((sum: number, c: Campaign) => sum + (c.amount || 0), 0);
        
        setStats({
          total: data.campaigns.length,
          pending,
          verified,
          active,
          revenue,
        });
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, action: string, durationDays?: number) => {
    try {
      const response = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, durationDays }),
      });
      
      if (response.ok) {
        fetchCampaigns(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    router.push("/admin/login");
  };

  const getStatusBadge = (status: string, daysLeft?: number, expiresAt?: string) => {
    switch (status) {
      case "pending":
        return <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300"><Clock className="h-3 w-3" /> Pending Verification</span>;
      case "verified":
        return <span className="flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300"><Check className="h-3 w-3" /> Payment Verified - Ready to Activate</span>;
      case "active":
        return <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300"><Play className="h-3 w-3" /> Active ({daysLeft} days left)</span>;
      case "completed":
        return <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">Completed</span>;
      case "expired":
        return <span className="flex items-center gap-1 rounded-full bg-gray-500/20 px-3 py-1 text-xs text-gray-300">Expired</span>;
      case "rejected":
        return <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300"><AlertCircle className="h-3 w-3" /> Rejected</span>;
      default:
        return <span className="rounded-full bg-gray-500/20 px-3 py-1 text-xs">{status}</span>;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedTab === "pending") return campaign.status === "pending";
    if (selectedTab === "verified") return campaign.status === "verified";
    if (selectedTab === "active") return campaign.status === "active";
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white/90">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-white/50">Manage and verify promotion campaigns</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchCampaigns}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-white/50">Total Campaigns</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-white/50">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">${stats.revenue}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-white/50">Active Campaigns</p>
                <p className="text-2xl font-bold text-green-300">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-sm text-white/50">Pending</p>
                <p className="text-2xl font-bold text-yellow-300">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTab("pending")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              selectedTab === "pending"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Clock className="h-4 w-4" />
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setSelectedTab("verified")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              selectedTab === "verified"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Check className="h-4 w-4" />
            Verified ({stats.verified})
          </button>
          <button
            onClick={() => setSelectedTab("active")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              selectedTab === "active"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Play className="h-4 w-4" />
            Active ({stats.active})
          </button>
          <button
            onClick={() => setSelectedTab("all")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              selectedTab === "all"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Eye className="h-4 w-4" />
            All ({stats.total})
          </button>
        </div>

        {/* Campaigns Table */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/10">
                <tr className="text-left text-sm text-white/60">
                  <th className="p-4">Email</th>
                  <th className="p-4">Token CA</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Tx Hash</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4">Actions</th>
                 </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-white/40">
                      No campaigns found
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-blue-400" />
                          <span className="text-sm text-white/80">{campaign.userEmail || "—"}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-white/60">
                        {campaign.ca?.slice(0, 12)}...
                      </td>
                      <td className="p-4 text-sm text-white/80">{campaign.packageName}</td>
                      <td className="p-4 text-sm text-white/80">${campaign.amount}</td>
                      <td className="p-4 font-mono text-xs text-white/60">
                        {campaign.txHash?.slice(0, 16)}...
                      </td>
                      <td className="p-4">
                        {getStatusBadge(campaign.status, campaign.daysLeft, campaign.expiresAt)}
                      </td>
                      <td className="p-4 text-sm text-white/60">
                        {new Date(campaign.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {campaign.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(campaign.id, "verify")}
                                className="rounded-lg bg-green-500/20 p-2 text-green-300 hover:bg-green-500/30 transition"
                                title="Verify Payment"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt("Enter rejection reason:");
                                  if (reason) updateStatus(campaign.id, "reject");
                                }}
                                className="rounded-lg bg-red-500/20 p-2 text-red-300 hover:bg-red-500/30 transition"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {campaign.status === "verified" && (
                            <button
                              onClick={() => {
                                const days = prompt("Enter campaign duration in days:", "30");
                                if (days) updateStatus(campaign.id, "activate", parseInt(days));
                              }}
                              className="rounded-lg bg-blue-500/20 p-2 text-blue-300 hover:bg-blue-500/30 transition"
                              title="Activate Campaign (Starts Countdown)"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          {campaign.status === "active" && (
                            <div className="flex items-center gap-2 text-xs text-green-400">
                              <Calendar className="h-3 w-3" />
                              {campaign.daysLeft} days left
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
