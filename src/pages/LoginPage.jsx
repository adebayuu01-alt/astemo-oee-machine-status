import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import astemoLogo from '../assets/astemo_logo.png';
import Toast from '../components/Toast';
import { INITIAL_USERS } from '../data/mockData';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Authentication logic supporting username + password and default accounts
  const handleCredentialLogin = (e) => {
    e.preventDefault();
    setIsInvalid(false);
    setErrorMsg('');

    const uTrim = username.trim().toLowerCase();
    const pTrim = password.trim();

    if (!uTrim || !pTrim) {
      setIsInvalid(true);
      setErrorMsg('Silakan masukkan username dan password Anda.');
      return;
    }

    // Match in INITIAL_USERS or default aliases
    let matched = INITIAL_USERS.find(
      (u) =>
        u.username.toLowerCase() === uTrim &&
        u.password === pTrim
    );

    // Support convenient aliases like admin / admin123 or admin / admin
    if (!matched) {
      if ((uTrim === 'admin' || uTrim === 'kevin') && (pTrim === 'admin123' || pTrim === 'admin' || pTrim === 'kevin12345')) {
        matched = INITIAL_USERS[0]; // Kevin (Superadmin)
      } else if ((uTrim === 'operator' || uTrim === 'suep') && (pTrim === 'operator123' || pTrim === 'operator' || pTrim === 'suep12345')) {
        matched = INITIAL_USERS[1]; // Suep (Operator)
      }
    }

    if (!matched) {
      setIsInvalid(true);
      setErrorMsg('Username atau password salah. Silakan gunakan akun default di bawah.');
      return;
    }

    setLoggedInUser(matched);
    setShowSuccessToast(true);

    setTimeout(() => {
      onLoginSuccess(matched);
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#F4F5F7] overflow-hidden select-none">
      {/* Background Decorative Polygons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white/60 rotate-45 transform skew-x-12" />
        <div className="absolute top-1/4 -right-40 w-[700px] h-[700px] bg-emerald-50/40 -rotate-12 transform skew-y-6" />
        <div className="absolute -bottom-40 left-1/3 w-[800px] h-[800px] bg-white/50 rotate-12" />
      </div>

      {/* Top right toast */}
      {showSuccessToast && loggedInUser && (
        <Toast
          type="success"
          title="Login Berhasil"
          message={`Selamat datang, ${loggedInUser.name} (${loggedInUser.role})`}
          onClose={() => setShowSuccessToast(false)}
          duration={2000}
        />
      )}

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl border border-[#E4E7EC] p-6 sm:p-8 flex flex-col items-center">
          {/* Astemo Brand */}
          <div className="mb-6 flex flex-col items-center text-center">
            <img
              src={astemoLogo}
              alt="Astemo"
              className="h-9 object-contain mb-2"
            />
            <h1 className="text-base font-bold tracking-tight text-[#1E232F] uppercase">
              OEE MACHINE STATUS
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Silakan masuk menggunakan username dan password Anda
            </p>
          </div>

          {/* Form Username & Password */}
          <form onSubmit={handleCredentialLogin} className="w-full space-y-4 text-left">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (isInvalid) setIsInvalid(false);
                  }}
                  placeholder="Enter your username"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none ${
                    isInvalid
                      ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                      : 'border-[#D0D5DD] focus:border-[#00A854] bg-[#FAFAFA]'
                  }`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (isInvalid) setIsInvalid(false);
                  }}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none ${
                    isInvalid
                      ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                      : 'border-[#D0D5DD] focus:border-[#00A854] bg-[#FAFAFA]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {isInvalid && errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button - Only LOGIN text */}
            <button
              type="submit"
              className="w-full py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white font-semibold rounded-lg text-sm transition-all shadow-sm active:scale-[0.99] mt-2"
            >
              LOGIN
            </button>
          </form>

          {/* Akun Default Section - Simple neutral without colors */}
          <div className="w-full mt-6 pt-5 border-t border-[#E4E7EC] text-left">
            <p className="text-xs font-semibold text-gray-700 mb-3">
              Akun Default:
            </p>

            <div className="space-y-2">
              {/* kevin_astemo/kevin12345 */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-700">
                <span className="font-mono text-gray-800">kevin_astemo/kevin12345</span>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('kevin_astemo');
                    setPassword('kevin12345');
                    setIsInvalid(false);
                    setErrorMsg('');
                  }}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 hover:underline px-2 py-0.5"
                >
                  Gunakan
                </button>
              </div>

              {/* suep_astemo/suep12345 */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-700">
                <span className="font-mono text-gray-800">suep_astemo/suep12345</span>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('suep_astemo');
                    setPassword('suep12345');
                    setIsInvalid(false);
                    setErrorMsg('');
                  }}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 hover:underline px-2 py-0.5"
                >
                  Gunakan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-3 text-center text-xs text-gray-400 z-10">
        Copyright © 2026 PT. Electrindo Inti Dinamika · Hitachi Astemo
      </footer>
    </div>
  );
}
