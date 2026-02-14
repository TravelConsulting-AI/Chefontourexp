import { Link } from 'react-router-dom';
import { AuthCard } from '@/app/components/chef-on-tour/AuthCard';
import logo from '@/assets/63a59453823c55a03703a64e2bd861fe4dd295a2.png';

export function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#111] p-4">
            {/* Logo */}
            <Link to="/" className="mb-8">
                <img
                    src={logo}
                    alt="Chef On Tour"
                    className="h-[65px] w-auto"
                />
            </Link>

            <AuthCard defaultView="signup" />

            {/* Home link */}
            <p className="mt-6 text-xs text-white/30">
                <Link to="/" className="transition-colors hover:text-white/60">
                    ← Back to home
                </Link>
            </p>
        </div>
    );
}
