import React, { useState } from 'react'
import { useAuthStore } from '../Store/useAuthStore';
import { Camera, Mail, User, Calendar, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { isUpdatingProfile, authUser, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>

          {/* ── Header ───────────────────────────────────────── */}
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2 text-base-content/60'>Your profile information</p>
          </div>

          {/* ── Avatar Upload ─────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-base-content/20"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-base-content/60">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* ── User Info ─────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <User className="size-4" />
                <span>Full Name</span>
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-content/10">
                {authUser?.fullname}
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <Mail className="size-4" />
                <span>Email</span>
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-content/10">
                {authUser?.email}
              </p>
            </div>

          </div>

          {/* ── Account Info ──────────────────────────────────── */}
          <div className="bg-base-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="size-5 text-primary" />
              <h2 className="text-lg font-medium">Account Information</h2>
            </div>

            <div className="space-y-3 text-sm">

              {/* Member Since */}
              <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                <div className="flex items-center gap-2 text-base-content/60">
                  <Calendar className="size-4" />
                  <span>Member Since</span>
                </div>
                <span className="font-medium">
                  {authUser?.createdAt
                    ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>

              {/* Account Status */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-base-content/60">
                  <Shield className="size-4" />
                  <span>Account Status</span>
                </div>
                <span className="text-green-500 font-medium flex items-center gap-1">
                  <span className="size-2 bg-green-500 rounded-full inline-block"></span>
                  Active
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage