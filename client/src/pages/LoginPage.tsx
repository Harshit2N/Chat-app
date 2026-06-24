import React, { useState, FormEvent } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState<'Sign up' | 'Login'>('Sign up')
  const [step, setStep] = useState<1 | 2>(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')

  const authContext = useContext(AuthContext)
  if (!authContext) throw new Error('LoginPage must be used within AuthProvider')
  const { login } = authContext

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (currState === 'Sign up' && step === 1) {
      setStep(2)
      return
    }
    login(currState === 'Sign up' ? 'signup' : 'login', { fullName, email, password, bio })
  }

  const switchToLogin = () => { setCurrState('Login'); setStep(1) }
  const switchToSignup = () => { setCurrState('Sign up'); setStep(1) }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4">
      <div className="w-full max-w-sm bg-white/5 border border-gray-600 rounded-2xl p-8 shadow-xl backdrop-blur-xl">

        {/* Step indicator — only shown during Sign up */}
        {currState === 'Sign up' && (
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                  ${step === s ? 'bg-violet-600 text-white' : step > s ? 'bg-violet-400 text-white' : 'bg-white/10 text-gray-400 border border-gray-600'}`}>
                  {s}
                </div>
                {i < 1 && <div className="flex-1 h-px bg-gray-600" />}
              </React.Fragment>
            ))}
          </div>
        )}

        <h2 className="text-2xl font-medium text-white mb-1">
          {currState === 'Sign up' ? (step === 1 ? 'Create account' : 'Add your bio') : 'Welcome back'}
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          {currState === 'Sign up'
            ? step === 1 ? 'Step 1 of 2 — Enter your details' : 'Step 2 of 2 — Tell us about yourself'
            : 'Sign in to continue'}
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">

          {/* Step 1: name + email + password */}
          {(currState === 'Login' || step === 1) && (
            <>
              {currState === 'Sign up' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Full name</label>
                  <input
                    type="text" required placeholder="John Doe" value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-gray-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email address</label>
                <input
                  type="email" required placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-gray-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Password</label>
                <input
                  type="password" required placeholder="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-gray-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </>
          )}

          {/* Step 2: bio */}
          {currState === 'Sign up' && step === 2 && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Short bio</label>
              <textarea
                required rows={4} placeholder="Tell people a little about yourself..." value={bio}
                onChange={e => setBio(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/5 border border-gray-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
              />
            </div>
          )}

          {/* Terms — only on step 1 signup or login */}
          {(currState === 'Login' || step === 1) && (
            <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 accent-violet-500 flex-shrink-0" />
              I agree to the{' '}
              <span className="text-violet-400 underline cursor-pointer">terms of service</span>{' '}
              and{' '}
              <span className="text-violet-400 underline cursor-pointer">privacy policy</span>.
            </label>
          )}

          {/* Back button on step 2 */}
          {currState === 'Sign up' && step === 2 && (
            <button type="button" onClick={() => setStep(1)}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1 w-fit">
              ← Back
            </button>
          )}

          <button type="submit"
            className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors mt-1">
            {currState === 'Sign up' ? (step === 1 ? 'Continue' : 'Create Account') : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-gray-700" />
          <span className="text-xs text-gray-500">{currState === 'Sign up' ? 'have an account?' : 'new here?'}</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        <p className="text-center text-sm text-gray-500">
          {currState === 'Sign up'
            ? <><span>Already have an account? </span><span onClick={switchToLogin} className="text-violet-400 font-medium cursor-pointer hover:underline">Sign in</span></>
            : <><span>Don't have an account? </span><span onClick={switchToSignup} className="text-violet-400 font-medium cursor-pointer hover:underline">Sign up</span></>
          }
        </p>

      </div>
    </div>
  )
}

export default LoginPage