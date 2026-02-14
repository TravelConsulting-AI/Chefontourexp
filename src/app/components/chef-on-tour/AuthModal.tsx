import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Eye, EyeOff, Loader2, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type View = 'signin' | 'signup' | 'forgot' | 'forgot-success' | 'signup-success';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { signIn, signUp, resetPassword } = useAuth();

    const [view, setView] = useState<View>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setShowPassword(false);
        setError(null);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        resetForm();
        setView('signin');
        onClose();
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const { error: err } = await signIn(email, password);
        if (err) {
            setError(err);
            setIsSubmitting(false);
        } else {
            handleClose();
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsSubmitting(true);
        const { error: err } = await signUp(email, password, firstName, lastName);
        if (err) {
            setError(err);
            setIsSubmitting(false);
        } else {
            setView('signup-success');
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const { error: err } = await resetPassword(email);
        if (err) {
            setError(err);
            setIsSubmitting(false);
        } else {
            setView('forgot-success');
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const inputClasses =
        'w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574]/50 text-sm';

    const buttonClasses =
        'w-full rounded-full bg-[#D4A574] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#C19563] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Content */}
                        <div className="px-8 pb-8 pt-10">
                            {/* ── Sign In / Sign Up Tabs ── */}
                            {(view === 'signin' || view === 'signup') && (
                                <>
                                    {/* Tab header */}
                                    <div className="mb-8 flex border-b border-white/10">
                                        <button
                                            onClick={() => { setView('signin'); setError(null); }}
                                            className={`flex-1 pb-3 text-sm font-medium transition-colors ${view === 'signin'
                                                    ? 'border-b-2 border-[#D4A574] text-[#D4A574]'
                                                    : 'text-white/50 hover:text-white/70'
                                                }`}
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            onClick={() => { setView('signup'); setError(null); }}
                                            className={`flex-1 pb-3 text-sm font-medium transition-colors ${view === 'signup'
                                                    ? 'border-b-2 border-[#D4A574] text-[#D4A574]'
                                                    : 'text-white/50 hover:text-white/70'
                                                }`}
                                        >
                                            Sign Up
                                        </button>
                                    </div>

                                    {/* ── Sign In Form ── */}
                                    {view === 'signin' && (
                                        <motion.form
                                            key="signin"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2 }}
                                            onSubmit={handleSignIn}
                                            className="space-y-5"
                                        >
                                            <div>
                                                <label className="mb-1.5 block text-xs font-medium text-white/60">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    required
                                                    className={inputClasses}
                                                    autoFocus
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1.5 block text-xs font-medium text-white/60">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        required
                                                        className={inputClasses + ' pr-10'}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                                        tabIndex={-1}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {error && (
                                                <p className="text-sm text-red-400">{error}</p>
                                            )}

                                            <button type="submit" disabled={isSubmitting} className={buttonClasses}>
                                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => { setView('forgot'); setError(null); }}
                                                className="w-full text-center text-xs text-white/40 transition-colors hover:text-[#D4A574]"
                                            >
                                                Forgot password?
                                            </button>
                                        </motion.form>
                                    )}

                                    {/* ── Sign Up Form ── */}
                                    {view === 'signup' && (
                                        <motion.form
                                            key="signup"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2 }}
                                            onSubmit={handleSignUp}
                                            className="space-y-5"
                                        >
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        placeholder="Jane"
                                                        required
                                                        className={inputClasses}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                        placeholder="Doe"
                                                        required
                                                        className={inputClasses}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1.5 block text-xs font-medium text-white/60">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    required
                                                    className={inputClasses}
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1.5 block text-xs font-medium text-white/60">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="Min. 6 characters"
                                                        required
                                                        minLength={6}
                                                        className={inputClasses + ' pr-10'}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                                        tabIndex={-1}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {error && (
                                                <p className="text-sm text-red-400">{error}</p>
                                            )}

                                            <button type="submit" disabled={isSubmitting} className={buttonClasses}>
                                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                                            </button>
                                        </motion.form>
                                    )}
                                </>
                            )}

                            {/* ── Forgot Password ── */}
                            {view === 'forgot' && (
                                <motion.div
                                    key="forgot"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => { setView('signin'); setError(null); }}
                                        className="mb-6 flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-[#D4A574]"
                                    >
                                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                                    </button>

                                    <h3 className="mb-2 text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                                        Reset Password
                                    </h3>
                                    <p className="mb-6 text-sm text-white/50">
                                        Enter your email and we'll send you a link to reset your password.
                                    </p>

                                    <form onSubmit={handleResetPassword} className="space-y-5">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-white/60">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                required
                                                className={inputClasses}
                                                autoFocus
                                            />
                                        </div>

                                        {error && (
                                            <p className="text-sm text-red-400">{error}</p>
                                        )}

                                        <button type="submit" disabled={isSubmitting} className={buttonClasses}>
                                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* ── Forgot Password Success ── */}
                            {view === 'forgot-success' && (
                                <motion.div
                                    key="forgot-success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center py-4"
                                >
                                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4A574]/20">
                                        <Check className="h-7 w-7 text-[#D4A574]" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                                        Check Your Email
                                    </h3>
                                    <p className="mb-6 text-sm text-white/50">
                                        We've sent a password reset link to<br />
                                        <span className="text-white/80">{email}</span>
                                    </p>
                                    <button onClick={handleClose} className={buttonClasses}>
                                        Done
                                    </button>
                                </motion.div>
                            )}

                            {/* ── Sign Up Success ── */}
                            {view === 'signup-success' && (
                                <motion.div
                                    key="signup-success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center py-4"
                                >
                                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4A574]/20">
                                        <Check className="h-7 w-7 text-[#D4A574]" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                                        Almost There!
                                    </h3>
                                    <p className="mb-2 text-sm text-white/50">
                                        We've sent a confirmation email to<br />
                                        <span className="text-white/80">{email}</span>
                                    </p>
                                    <p className="mb-6 text-xs text-white/40">
                                        Please check your inbox and confirm your account to continue.
                                    </p>
                                    <button onClick={handleClose} className={buttonClasses}>
                                        Got It
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
