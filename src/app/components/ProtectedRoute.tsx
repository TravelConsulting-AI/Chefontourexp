import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/lib/database.types';

type DbRole = Database['public']['Enums']['user_role'];

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: DbRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, role, isLoading } = useAuth();
    const location = useLocation();

    // Show a branded loading state while checking auth
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4A574] border-t-transparent" />
                    <p className="text-sm text-[#1a1a1a]/50" style={{ fontFamily: 'var(--font-body)' }}>
                        Loading…
                    </p>
                </div>
            </div>
        );
    }

    // Not logged in → redirect to /login with return URL
    if (!user) {
        toast.error('Please sign in to access this page');
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    // Role check
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        toast.error("You don't have permission to access this page");
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
