'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FiEye, FiEyeOff } from 'react-icons/fi'

type Inputs = { email: string; password: string }

const Form = () => {
  const { data: session } = useSession()
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') || '/'
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<Inputs>({ defaultValues: { email: '', password: '' } })

  useEffect(() => {
    if (session?.user) router.push(callbackUrl)
  }, [callbackUrl, router, session])

  const formSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    signIn('credentials', { email, password })
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen flex flex-col items-center py-8 px-4">
      {/* Logo */}
      <Link href="/" className="mb-6 flex flex-col items-center">
        <span className="text-[#131921] font-bold text-3xl tracking-tight">agu<span className="text-[#FF9900]">brothers</span></span>
      </Link>

      {/* Main box */}
      <div className="w-full max-w-sm bg-white border border-[#D5D9D9] rounded-md p-6 shadow-sm">
        <h1 className="text-2xl font-medium text-[#0F1111] mb-4">Sign in</h1>

        {/* Error */}
        {params.get('error') && (
          <div className="border border-[#CC0C39] bg-[#FFF0F0] text-[#CC0C39] text-sm rounded-md p-3 mb-4">
            {params.get('error') === 'CredentialsSignin'
              ? 'Your email or password is incorrect.'
              : params.get('error')}
          </div>
        )}
        {params.get('success') && (
          <div className="border border-[#007600] bg-[#F0FFF0] text-[#007600] text-sm rounded-md p-3 mb-4">
            {params.get('success')}
          </div>
        )}

        <form onSubmit={handleSubmit(formSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Enter your email',
                pattern: { value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, message: 'Invalid email address' },
              })}
              className="amazon-input"
            />
            {errors.email && <p className="text-[#CC0C39] text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="At least 6 characters"
                {...register('password', { required: 'Enter your password' })}
                className="amazon-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565959] hover:text-[#0F1111]"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[#CC0C39] text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-amazon w-full py-2.5 rounded-md text-sm font-normal mt-1 flex items-center justify-center gap-2"
          >
            {isSubmitting && <span className="loading loading-spinner loading-xs"></span>}
            Continue
          </button>
        </form>

        <p className="text-xs text-[#565959] mt-3 leading-relaxed">
          By continuing, you agree to Agu Brothers&apos;{' '}
          <Link href="/terms-and-conditions" className="text-[#007185] hover:underline">Conditions of Use</Link>
          {' '}and{' '}
          <Link href="/privacy-policy" className="text-[#007185] hover:underline">Privacy Notice</Link>.
        </p>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D5D9D9]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-[#565959]">Or sign in with</span>
          </div>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl })}
          className="btn-amazon-outline w-full py-2.5 rounded-md text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {/* Divider */}
      <div className="w-full max-w-sm flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-[#D5D9D9]"></div>
        <span className="text-xs text-[#565959]">New to Agu Brothers?</span>
        <div className="flex-1 h-px bg-[#D5D9D9]"></div>
      </div>

      {/* Create account */}
      <div className="w-full max-w-sm">
        <Link
          href={`/register?callbackUrl=${callbackUrl}`}
          className="btn-amazon-outline w-full py-2.5 rounded-md text-sm flex items-center justify-center"
        >
          Create your Agu Brothers account
        </Link>
      </div>

      {/* Footer links */}
      <div className="mt-8 text-center text-xs text-[#565959] space-x-3">
        <Link href="/about-us" className="text-[#007185] hover:underline">Conditions of Use</Link>
        <Link href="/privacy-policy" className="text-[#007185] hover:underline">Privacy Notice</Link>
        <Link href="/contact-us" className="text-[#007185] hover:underline">Help</Link>
      </div>
      <p className="text-xs text-[#565959] mt-2">© 2024, Agu Brothers Electronics</p>
    </div>
  )
}

export default Form
