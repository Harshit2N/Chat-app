import React, { useContext, useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/authContext'

const ProfilePage = () => {
  const authContext = useContext(AuthContext)
  if (!authContext) throw new Error('ProfilePage must be used within AuthProvider')
  const { authUser, updateProfile } = authContext

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    )
  }

  const [selectedImg, setSelectedImg] = useState<File | null>(null)
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    if (!selectedImg) {
      await updateProfile({ fullName: name, bio })
      navigate('/')
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(selectedImg)
    reader.onload = async () => {
      await updateProfile({ profilePic: reader.result, fullName: name, bio })
      navigate('/')
    }
  }

  // Initials fallback when no image is selected
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-gray-600 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">

        {/* Avatar header */}
        <div className="flex flex-col items-center gap-3 px-8 pt-8 pb-6 border-b border-gray-700">
          <div className="relative">
            {/* Avatar image or initials circle */}
            {selectedImg || authUser.profilePic ? (
              <img
                src={selectedImg ? URL.createObjectURL(selectedImg) : authUser.profilePic}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-violet-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-violet-600/20 border-2 border-violet-500 flex items-center justify-center text-violet-300 text-2xl font-medium">
                {initials}
              </div>
            )}

            {/* Camera badge — triggers hidden file input */}
            <label htmlFor="avatar"
              className="absolute bottom-0 right-0 w-7 h-7 bg-violet-600 hover:bg-violet-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-gray-900 transition-colors"
              title="Change photo">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <input
                id="avatar" type="file" accept=".png,.jpg,.jpeg" hidden
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedImg(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="text-center">
            <p className="text-white font-medium text-base">{name || 'Your Name'}</p>
            <p className="text-gray-400 text-xs mt-0.5">Tap the camera icon to change photo</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-8 py-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Personal info</p>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Display name</label>
            <input
              type="text" required value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-gray-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Bio</label>
            <textarea
              required rows={3} value={bio}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
              placeholder="A short bio about yourself..."
              className="px-3 py-2 rounded-lg bg-white/5 border border-gray-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
            />
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium text-sm transition-colors mt-1">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default ProfilePage