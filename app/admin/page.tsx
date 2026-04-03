import { loginAdmin } from './actions';
import { ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <ShieldAlert className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-slate-400 text-sm mt-2">Enter the secret password to manage events.</p>
        </div>

        <form action={loginAdmin} className="space-y-4">
          <div>
            <input 
              type="password" 
              name="password"
              placeholder="Admin Password"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
