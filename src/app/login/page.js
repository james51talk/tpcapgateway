"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, session } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (session) router.replace("/");
  }, [loading, session, router]);

  if (!loading && session) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-700 to-yellow-400 px-4 py-6 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
      
\n      <div className="mx-auto w-full max-w-[900px] relative z-10">\n        <div className="flex flex-col lg:flex-row w-full overflow-hidden rounded-3xl bg-white shadow-2xl border border-white/20 backdrop-blur-xl">\n
          {/* Left Panel - Branding */}
          <div className="hidden lg:flex lg:w-2/5 flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-8 py-12 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-300/20 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
              <div className="text-4xl font-bold tracking-tight mb-2 animate-in fade-in slide-in-from-top-6 duration-700">TPCAP</div>
              <div className="inline-block bg-yellow-300/30 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-yellow-300/50 animate-in fade-in duration-700 delay-100">
                <p className="text-sm font-bold text-yellow-100">Center Owner Portal</p>
              </div>

            </div>

            <div className="relative z-10 flex items-center justify-center">
              <div className="animate-in fade-in duration-1000 delay-300">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-24 w-24 object-contain drop-shadow-2xl hover:drop-shadow-3xl transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:py-16 bg-gradient-to-br from-white to-yellow-50">
            
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Welcome Back CO!</h2>
            </div>

              <form
              className="space-y-5 bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                setError("");
                setSubmitting(true);
                const res = login({ username, password });
                if (!res.ok) {
                  setError(res.error || "Sign in failed.");
                  setSubmitting(false);
                  return;
                }
                window.location.assign("/");
              }}
            >
              {/* Username Field */}
              <div className="space-y-3">
                <label className="text-xs lg:text-sm font-bold text-slate-800 block uppercase tracking-wide">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 backdrop-blur-sm pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] hover:border-slate-300 placeholder:text-slate-400"
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label className="text-xs lg:text-sm font-bold text-slate-800 block uppercase tracking-wide">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 backdrop-blur-sm pl-11 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] hover:border-slate-300 placeholder:text-slate-400"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors duration-200 focus:outline-none p-1 rounded-lg hover:bg-blue-50"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10C1.732 14.057 5.522 17 10 17a9.958 9.958 0 004.512-1.074l1.78 1.781a1 1 0 001.414-1.414L15.17 13.576z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-300 bg-red-50/90 backdrop-blur-sm px-4 py-3.5 text-sm font-medium text-red-800 flex items-start gap-3 animate-in fade-in duration-300 shadow-sm">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={submitting || !username || !password}
                className={[
                  "h-12 w-full rounded-xl text-sm lg:text-base font-bold text-slate-900 transition-all duration-300 flex items-center justify-center gap-2 mt-8 relative overflow-hidden",
                  submitting || !username || !password
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 font-semibold",
                ].join(" ")}
              >
                {submitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-gradient-to-br from-blue-50/80 via-white to-yellow-50/50 rounded-2xl border border-blue-200/60 shadow-md backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <p className="text-xs lg:text-sm font-bold text-blue-900 mb-5 flex items-center gap-2 uppercase tracking-wide">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z" />
                </svg>
                Demo Credentials
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-300/60 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md">
                    <p className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      Center Owner
                    </p>
                    <p className="text-xs lg:text-sm font-mono text-blue-800 font-bold tracking-wide">owner.lucena</p>
                    <p className="text-xs lg:text-sm font-mono text-blue-800 font-bold tracking-wide">owner123</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-4 border border-yellow-300/60 hover:border-yellow-500 transition-all duration-200 shadow-sm hover:shadow-md">
                    <p className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.169-1.409l-7-14z" />
                      </svg>
                      Administrator
                    </p>
                    <p className="text-xs lg:text-sm font-mono text-yellow-800 font-bold tracking-wide">admin</p>
                    <p className="text-xs lg:text-sm font-mono text-yellow-800 font-bold tracking-wide">admin123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-white/80 font-medium animate-in fade-in duration-1000 delay-500">
          <p>© 2026 TPCAP-CO. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

