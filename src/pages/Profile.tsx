import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { User, Lock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileForm {
  name: string;
}

interface PasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export function Profile() {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch,
    reset,
  } = useForm<PasswordForm>();

  const newPassword = watch('newPassword');

  const onSubmitProfile = async (data: ProfileForm) => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await authService.updateProfile(user.id, data.name);
      setSuccess('Profile updated successfully');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordForm) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await authService.changePassword(data.newPassword);
      setSuccess('Password changed successfully');
      setShowPasswordForm(false);
      reset();
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={() => setError('')} />
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm text-green-800">{success}</p>
            </div>
            <button
              onClick={() => setSuccess('')}
              className="text-green-600 hover:text-green-800 text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                  Admin
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>

            <Input
              label="Full Name"
              type="text"
              error={profileErrors.name?.message}
              {...registerProfile('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />

            <Input
              label="Email Address"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />

            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
            </div>
            {!showPasswordForm && (
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
              >
                Change
              </Button>
            )}
          </div>

          {showPasswordForm && (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-5">
              <Input
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                error={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter your new password"
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === newPassword || 'Passwords do not match',
                })}
              />

              <div className="flex gap-3">
                <Button type="submit" loading={loading}>
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    reset();
                    setError('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
          </div>
          <p className="text-gray-600 mb-4">
            View and track all your orders in one place
          </p>
          <Link to="/orders">
            <Button variant="outline">View All Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
