"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Database, Server, RefreshCw } from "lucide-react";

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/db-status");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({
        connected: false,
        message: "Failed to connect to API endpoint",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white/90">Database Status</h1>
          <button
            onClick={checkDatabase}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Main Status Card */}
        <div className={`rounded-2xl border p-8 mb-6 ${
          status?.connected 
            ? "border-green-500/30 bg-green-500/10" 
            : "border-red-500/30 bg-red-500/10"
        }`}>
          <div className="flex items-center gap-4">
            {status?.connected ? (
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            ) : (
              <XCircle className="h-12 w-12 text-red-400" />
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">
                {status?.connected ? "✅ Connected to MongoDB" : "❌ Connection Failed"}
              </h2>
              <p className="text-white/60 mt-1">{status?.message || "Unknown status"}</p>
            </div>
          </div>
        </div>

        {/* Connection Details */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Connection Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/50">Status:</span>
              <span className={status?.connected ? "text-green-400" : "text-red-400"}>
                {status?.connected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/50">Database Name:</span>
              <span className="text-white/80">boostera</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Collections:</span>
              <span className="text-white/80">campaigns, promoCodes, referrals</span>
            </div>
          </div>
        </div>

        {/* Database Statistics */}
        {status?.stats && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Database Statistics</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/50">Total Campaigns</p>
                <p className="text-2xl font-bold text-white">{status.stats.totalCampaigns || 0}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/50">Active Campaigns</p>
                <p className="text-2xl font-bold text-green-400">{status.stats.activeCampaigns || 0}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/50">Pending Verification</p>
                <p className="text-2xl font-bold text-yellow-400">{status.stats.pendingVerification || 0}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/50">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-400">${status.stats.totalRevenue || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Troubleshooting */}
        {!status?.connected && (
          <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
            <h3 className="text-lg font-semibold text-yellow-300 mb-3">🔧 Troubleshooting</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>1. Check your MongoDB Atlas IP whitelist</li>
              <li>2. Verify username/password in .env.local</li>
              <li>3. Make sure the database name is correct</li>
              <li>4. Check network connectivity</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
