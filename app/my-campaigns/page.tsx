"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, CheckCircle2, AlertCircle, ExternalLink, Loader2, Mail, LogOut, ArrowRight } from "lucide-react";

export default function MyCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("boostera_user_email");
    if (savedEmail) {
      setUserEmail(savedEmail);
      handleFetchCampaigns(savedEmail);
    }
  }, []);

  const handleFetchCampaigns = async (email: string) => {
    if (!email) return;
    
    setLoading(true);
    setError("");
    setHasSearched(true);
    
    try {
      const response = await fetch(`/api/submit-promotion?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.campaigns);
        setSubmittedEmail(email);
        localStorage.setItem("boostera_user_email", email);
        
        if (data.campaigns.length === 0) {
          setError(`No campaigns found for "${email}"`);
        }
      } else {
        setError(data.error || "Failed to fetch campaigns");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchCampaigns(userEmail);
  };

  const handleLogout = () => {
    localStorage.removeItem("boostera_user_email");
    setUserEmail("");
    setCampaigns([]);
    setSubmittedEmail("");
    setHasSearched(false);
    setError("");
  };

  const getStatusBadge = (status: string, daysLeft?: number) => {
    switch (status) {
      case "pending":
        return <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs text-yellow-300"><Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Pending</span>;
      case "verified":
        return <span className="flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs text-blue-300">Verified</span>;
      case "active":
        return <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs text-green-300"><CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Active ({daysLeft}d)</span>;
      case "completed":
        return <span className="rounded-full bg-green-500/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs text-green-300">Completed</span>;
      case "expired":
        return <span className="rounded-full bg-gray-500/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs text-gray-300">Expired</span>;
      case "rejected":
        return <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs text-red-300"><AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Rejected</span>;
      default:
        return null;
    }
  };

  // Show email input form
  if (!hasSearched && !localStorage.getItem("boostera_user_email")) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
          <div className="text-center mb-6">
            <Mail className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-400 mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white/90">Find Your Campaigns</h2>
            <p className="mt-2 text-sm text-white/50">Enter the email you used when submitting your campaign</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-blue-500/50"
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 font-semibold text-white transition hover:scale-105 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "View My Campaigns"}
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-white/40 mb-2">Don't have a campaign?</p>
            <Link href="/promote" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition">
              Start a new campaign <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header - Mobile Responsive */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white/90">My Campaigns</h1>
            {submittedEmail && (
              <p className="mt-1 text-xs sm:text-sm text-white/50 break-all">
                Campaigns for: <span className="text-blue-400 font-medium">{submittedEmail}</span>
              </p>
            )}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs sm:text-sm text-white/70 hover:bg-white/10 transition flex-1 sm:flex-none"
            >
              <LogOut className="h-3.5 w-3.5" />
              Change Email
            </button>
            <Link
              href="/promote"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-105 flex-1 sm:flex-none"
            >
              New Campaign →
            </Link>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-8 sm:p-12 text-center backdrop-blur-xl">
            <div className="text-4xl sm:text-5xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white/80">No Campaigns Found</h3>
            <p className="mt-2 text-sm text-white/50">{error}</p>
            <div className="mt-6 flex gap-3 justify-center flex-wrap">
              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition"
              >
                Try Different Email
              </button>
              <Link href="/promote" className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105">
                Create Campaign →
              </Link>
            </div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-12 text-center backdrop-blur-xl">
            <div className="text-5xl sm:text-6xl mb-4">📧</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white/80">No Campaigns Yet</h3>
            <p className="mt-2 text-sm text-white/50">You haven't submitted any campaigns with this email.</p>
            <Link href="/promote" className="mt-6 inline-block rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105">
              Create Your First Campaign →
            </Link>
          </div>
        ) : (
          <>
            {/* Active Campaigns */}
            {campaigns.filter(c => c.status === "active").length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-xl font-semibold text-white/80 mb-3 sm:mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  Active Campaigns ({campaigns.filter(c => c.status === "active").length})
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {campaigns.filter(c => c.status === "active").map((campaign) => (
                    <div key={campaign.id} className="rounded-xl sm:rounded-2xl border border-green-500/30 bg-green-500/5 p-4 sm:p-6 backdrop-blur-xl">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-white/90">{campaign.packageName}</h3>
                            {getStatusBadge(campaign.status, campaign.daysLeft)}
                          </div>
                          <p className="font-mono text-xs sm:text-sm text-white/50 break-all">CA: {campaign.ca.slice(0, 10)}...{campaign.ca.slice(-8)}</p>
                          <p className="mt-1 text-xs text-white/40">Submitted: {new Date(campaign.submittedAt).toLocaleDateString()}</p>
                          {campaign.expiresAt && (
                            <p className="mt-1 text-xs text-green-400">Expires: {new Date(campaign.expiresAt).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-lg sm:text-xl font-bold text-blue-400">${campaign.amount}</p>
                          <a href={`https://solscan.io/tx/${campaign.txHash}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white transition mt-1">
                            View Tx <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Campaigns */}
            {campaigns.filter(c => c.status === "pending").length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-xl font-semibold text-white/80 mb-3 sm:mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                  Pending Verification ({campaigns.filter(c => c.status === "pending").length})
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {campaigns.filter(c => c.status === "pending").map((campaign) => (
                    <div key={campaign.id} className="rounded-xl sm:rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4 sm:p-6 backdrop-blur-xl">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-white/90">{campaign.packageName}</h3>
                            {getStatusBadge(campaign.status)}
                          </div>
                          <p className="font-mono text-xs sm:text-sm text-white/50 break-all">CA: {campaign.ca.slice(0, 10)}...{campaign.ca.slice(-8)}</p>
                          <p className="mt-1 text-xs text-white/40">Submitted: {new Date(campaign.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-lg sm:text-xl font-bold text-blue-400">${campaign.amount}</p>
                          <p className="text-xs text-yellow-400 mt-1">Awaiting verification</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Campaigns */}
            {campaigns.filter(c => !["active", "pending"].includes(c.status)).length > 0 && (
              <div>
                <h2 className="text-base sm:text-xl font-semibold text-white/60 mb-3 sm:mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  Past Campaigns ({campaigns.filter(c => !["active", "pending"].includes(c.status)).length})
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {campaigns.filter(c => !["active", "pending"].includes(c.status)).map((campaign) => (
                    <div key={campaign.id} className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl opacity-80">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-white/90">{campaign.packageName}</h3>
                            {getStatusBadge(campaign.status)}
                          </div>
                          <p className="font-mono text-xs sm:text-sm text-white/50 break-all">CA: {campaign.ca.slice(0, 10)}...{campaign.ca.slice(-8)}</p>
                          <p className="mt-1 text-xs text-white/40">Submitted: {new Date(campaign.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-lg sm:text-xl font-bold text-blue-400">${campaign.amount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
