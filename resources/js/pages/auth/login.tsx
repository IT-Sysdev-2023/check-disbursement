import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { request } from '@/routes/password';
import { SharedData } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const props = usePage<SharedData>().props;
    const loginRoute = AuthenticatedSessionController.store();
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0e1117] px-4">
            <Head title="Log in" />

            <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
                {/* Left panel */}
                <div className="relative hidden w-2/5 flex-col justify-between bg-gradient-to-br from-[#0a0e18] via-[#111827] to-[#0d1520] p-12 md:flex">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(196,157,73,0.08),transparent_60%)]" />
                    <div className="flex flex-col items-center justify-center">
                        <img
                            src="/storage/cd-logo.png"
                            alt="CDS Logo"
                            className="h-auto w-50 rounded object-contain"
                        />

                        <div className="mt-5 flex flex-col leading-none">
                            {/* <p className="font-serif text-xl tracking-wide text-[#c49d49]">
                                CDS
                            </p> */}
                            {/* <p className="mt-1 text-[10px] tracking-widest text-white/30 uppercase">
                                Cheque Disbursement Monitoring System
                            </p> */}
                        </div>
                    </div>
                    <div className="relative">
                        <p className="mb-4 font-serif text-lg leading-relaxed text-white/50 italic">
                            "{props.quote.message}"
                        </p>
                        <span className="text-[11px] tracking-widest text-[#c49d49]/70 uppercase">
                            {props.quote.author}
                        </span>
                    </div>
                </div>

                {/* Right panel */}
                <div className="flex flex-1 flex-col justify-center bg-[#f7f5f0] px-10 py-12">
                    <div className="mb-8">
                        <h1 className="mb-1 font-serif text-2xl text-[#111]">
                            Welcome back
                        </h1>
                        <p className="text-sm text-[#888]">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <Form
                        action={loginRoute.url}
                        method={loginRoute.method}
                        // {...AuthenticatedSessionController.store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Username */}
                                <div className="flex flex-col gap-1.5">
                                    <Label
                                        htmlFor="username"
                                        className="text-[11px] font-medium tracking-widest text-[#555] uppercase"
                                    >
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        name="username"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="username"
                                        placeholder="Enter username"
                                        className="rounded-lg border border-[#e0ddd5] bg-white text-sm text-[#111] transition-colors placeholder:text-[#bbb] focus:border-[#c49d49] focus:ring-0"
                                    />
                                    <InputError message={errors.username} />
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-[11px] font-medium tracking-widest text-[#555] uppercase"
                                        >
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-[12px] text-[#c49d49] transition-colors hover:text-[#a8832d]"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className="rounded-lg border border-[#e0ddd5] bg-white pr-10 text-sm text-[#111] transition-colors focus:border-[#c49d49] focus:ring-0"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-[#aaa] transition-colors hover:text-[#666]"
                                            tabIndex={-1}
                                            aria-label={
                                                showPassword
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff size={16} />
                                            ) : (
                                                <Eye size={16} />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                {/* Remember me */}
                                <div className="flex items-center space-x-2.5">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="border-[#d0cdc5] data-[state=checked]:border-[#c49d49] data-[state=checked]:bg-[#c49d49]"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="cursor-pointer text-sm text-[#666]"
                                    >
                                        Remember me
                                    </Label>
                                </div>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                    className="mt-2 w-full rounded-lg bg-[#1a1f2e] py-3 text-[13px] font-medium tracking-widest text-[#c49d49] uppercase transition-all hover:-translate-y-px hover:bg-[#111827]"
                                >
                                    {processing ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Log in
                                </Button>

                                <div className="mt-2 flex items-center gap-3">
                                    <div className="h-px flex-1 bg-[#e0ddd5]" />
                                    <span className="text-[11px] whitespace-nowrap text-[#bbb]">
                                        IT SYSDEV 2026
                                    </span>
                                    <div className="h-px flex-1 bg-[#e0ddd5]" />
                                </div>
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mt-4 text-center text-sm font-medium text-emerald-600">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
