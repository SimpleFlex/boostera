"use client";

import { useState } from "react";
import { Calendar, Clock, Send, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"calendar" | "details" | "success">("calendar");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", telegram: "", projectName: "", message: "",
  });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const formatDate = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const handleDayClick = (day: number) => {
    if (isPast(day)) return;
    setSelectedDate(formatDate(day));
    setSelectedTime(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, date: selectedDate, time: selectedTime }),
      });
      if (res.ok) setStep("success");
    } catch (error) {
      console.error("Booking error:", error);
    }
    setLoading(false);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-white/60 mb-2">Your consultation has been booked for</p>
          <p className="text-emerald-400 font-semibold mb-1">{selectedDate}</p>
          <p className="text-emerald-400 font-semibold mb-6">{selectedTime}</p>
          <p className="text-white/50 text-sm">
            We'll reach out to you on Telegram <span className="text-white/70">@{formData.telegram}</span> before your session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 mb-6">
            <Calendar className="w-4 h-4" />
            Free Consultation
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Book a <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Consultation</span>
          </h1>
          <p className="text-white/60">Pick a date and time — we'll reach out on Telegram before your session.</p>
        </div>

        {step === "calendar" && (
          <div className="space-y-6">
            {/* Calendar */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-white font-semibold">{MONTHS[viewMonth]} {viewYear}</h2>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs text-white/40 font-medium py-2">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = formatDate(day);
                  const past = isPast(day);
                  const selected = selectedDate === dateStr;
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      disabled={past}
                      className={`
                        aspect-square rounded-xl text-sm font-medium transition
                        ${past ? "text-white/20 cursor-not-allowed" : "hover:bg-white/10 cursor-pointer"}
                        ${selected ? "bg-emerald-500 text-white hover:bg-emerald-600" : past ? "" : "text-white/80"}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-white font-semibold text-sm">Available Times</h3>
                  <span className="text-white/50 text-xs ml-auto">{selectedDate}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`
                        py-2.5 rounded-xl text-sm font-medium transition
                        ${selectedTime === slot
                          ? "bg-emerald-500 text-white"
                          : "border border-white/10 text-white/70 hover:border-emerald-500/50 hover:text-white"
                        }
                      `}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <button
                onClick={() => setStep("details")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-semibold text-white transition hover:scale-105"
              >
                Continue — Fill in your details
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {step === "details" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-emerald-300 text-sm font-medium">{selectedDate} · {selectedTime}</span>
              <button onClick={() => setStep("calendar")} className="ml-auto text-white/40 hover:text-white text-xs transition">Change</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Telegram Username *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">@</span>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                    placeholder="username"
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-white/40">We'll contact you here before the session</p>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Project / Token Name</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">What would you like to discuss?</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g., Marketing strategy, token launch, growth tactics..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-semibold text-white transition hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
