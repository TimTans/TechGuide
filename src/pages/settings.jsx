import {
    User, Lock, Bell, Globe, Shield,
    ChevronRight, Save, Check, AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth, supabase } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Settings() {
    const navigate = useNavigate();
    const { session, getUserData } = UserAuth();
    const [userData, setUserData] = useState(null);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [isSavingAccount, setIsSavingAccount] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [accountSuccess, setAccountSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [accountError, setAccountError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Settings states
    const [settings, setSettings] = useState({
        emailNotifications: true,
        lessonReminders: true,
        weeklyProgress: false,
        safetyAlerts: true,
        language: 'en'
    });

    // Wait for initial session check to complete
    useEffect(() => {
        // Check session after a brief delay to allow it to load
        const checkSession = async () => {
            // Wait a bit for session to initialize
            await new Promise(resolve => setTimeout(resolve, 150));
            setSessionChecked(true);
        };
        checkSession();
    }, []);

    // Redirect to signin if not authenticated (only after session has been checked)
    useEffect(() => {
        if (sessionChecked && session === null) {
            navigate("/signin");
        } else if (sessionChecked && session?.user) {
            getUserData().then((res) => {
                if (res.success) {
                    setUserData(res.data);
                    setFormData(prev => ({
                        ...prev,
                        firstName: res.data.first_name || '',
                        lastName: res.data.last_name || '',
                        email: res.data.email || ''
                    }));
                }
            });
        }
    }, [session, sessionChecked, navigate, getUserData]);

    // Show loading while checking auth (wait for session to be checked)
    if (!sessionChecked || session === null) {
        return null;
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSettingToggle = (setting) => {
        setSettings({
            ...settings,
            [setting]: !settings[setting]
        });
    };

    const handleSaveAccountInfo = async () => {
        setAccountError(null);
        setIsSavingAccount(true);

        try {
            const userId = session?.user?.id;
            if (!userId) {
                setAccountError("You must be logged in to save changes.");
                setIsSavingAccount(false);
                return;
            }

            // Validate account information
            if (!formData.firstName.trim() || !formData.lastName.trim()) {
                setAccountError("First name and last name are required.");
                setIsSavingAccount(false);
                return;
            }

            if (!formData.email.trim() || !formData.email.includes('@')) {
                setAccountError("Please enter a valid email address.");
                setIsSavingAccount(false);
                return;
            }

            // Update account information in users table
            const updateData = {
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim()
            };

            const { error: updateError } = await supabase
                .from("users")
                .update(updateData)
                .eq("user_id", userId);

            if (updateError) {
                setAccountError(updateError.message || "Failed to update account information.");
                setIsSavingAccount(false);
                return;
            }

            // Update email if it changed
            const emailChanged = formData.email.trim() !== (userData?.email || session.user.email);
            if (emailChanged) {
                const { error: emailUpdateError } = await supabase.auth.updateUser({
                    email: formData.email.trim()
                });

                if (emailUpdateError) {
                    setAccountError(emailUpdateError.message || "Failed to update email address.");
                    setIsSavingAccount(false);
                    return;
                }

                // Update email in users table as well
                const { error: emailTableError } = await supabase
                    .from("users")
                    .update({ email: formData.email.trim() })
                    .eq("user_id", userId);

                if (emailTableError) {
                    console.error("Error updating email in users table:", emailTableError);
                    // Don't fail the whole operation if this fails
                }
            }

            // Refresh user data
            const res = await getUserData();
            if (res.success) {
                setUserData(res.data);
            }

            // Show success message
            setAccountSuccess(true);
            setTimeout(() => {
                setAccountSuccess(false);
                setAccountError(null);
            }, 3000);

        } catch (err) {
            console.error("Error saving account information:", err);
            setAccountError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsSavingAccount(false);
        }
    };

    const handleSavePassword = async () => {
        setPasswordError(null);
        setIsSavingPassword(true);

        try {
            // Check if password change is requested
            if (!formData.currentPassword && !formData.newPassword && !formData.confirmPassword) {
                setPasswordError("Please fill in password fields to change your password.");
                setIsSavingPassword(false);
                return;
            }

            // Validate password fields
            if (!formData.currentPassword) {
                setPasswordError("Please enter your current password.");
                setIsSavingPassword(false);
                return;
            }

            if (!formData.newPassword) {
                setPasswordError("Please enter a new password.");
                setIsSavingPassword(false);
                return;
            }

            if (formData.newPassword.length < 6) {
                setPasswordError("New password must be at least 6 characters long.");
                setIsSavingPassword(false);
                return;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                setPasswordError("New passwords do not match.");
                setIsSavingPassword(false);
                return;
            }

            // Verify current password by attempting to sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: userData?.email || session.user.email,
                password: formData.currentPassword
            });

            if (signInError) {
                setPasswordError("Current password is incorrect.");
                setIsSavingPassword(false);
                return;
            }

            // Update password
            const { error: passwordUpdateError } = await supabase.auth.updateUser({
                password: formData.newPassword
            });

            if (passwordUpdateError) {
                setPasswordError(passwordUpdateError.message || "Failed to update password.");
                setIsSavingPassword(false);
                return;
            }

            // Clear password fields on success
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

            // Show success message
            setPasswordSuccess(true);
            setTimeout(() => {
                setPasswordSuccess(false);
                setPasswordError(null);
            }, 3000);

        } catch (err) {
            console.error("Error saving password:", err);
            setPasswordError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12 pb-20">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
                        Settings
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage your account and preferences
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Account Information */}
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
                        </div>

                        {accountError && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 font-medium">{accountError}</p>
                            </div>
                        )}

                        {accountSuccess && (
                            <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-emerald-700 font-medium">Account information updated successfully!</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 font-medium"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleSaveAccountInfo}
                                disabled={isSavingAccount}
                                className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${accountSuccess
                                    ? 'bg-emerald-500 text-white'
                                    : isSavingAccount
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {accountSuccess ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Saved!
                                        </>
                                    ) : isSavingAccount ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Account Information
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                                <Lock className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                        </div>

                        {passwordError && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 font-medium">{passwordError}</p>
                            </div>
                        )}

                        {passwordSuccess && (
                            <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-emerald-700 font-medium">Password updated successfully!</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-medium"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-medium"
                                        placeholder="Enter new password (min. 6 characters)"
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-medium"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleSavePassword}
                                disabled={isSavingPassword}
                                className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${passwordSuccess
                                    ? 'bg-emerald-500 text-white'
                                    : isSavingPassword
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {passwordSuccess ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Password Updated!
                                        </>
                                    ) : isSavingPassword ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5" />
                                            Update Password
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                <Bell className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                        </div>

                        <div className="space-y-4">
                            <SettingToggle
                                label="Email Notifications"
                                description="Receive updates and news via email"
                                enabled={settings.emailNotifications}
                                onToggle={() => handleSettingToggle('emailNotifications')}
                            />
                            <SettingToggle
                                label="Lesson Reminders"
                                description="Get reminded when it's time to learn"
                                enabled={settings.lessonReminders}
                                onToggle={() => handleSettingToggle('lessonReminders')}
                            />
                            <SettingToggle
                                label="Weekly Progress Report"
                                description="Receive a summary of your learning progress"
                                enabled={settings.weeklyProgress}
                                onToggle={() => handleSettingToggle('weeklyProgress')}
                            />
                            <SettingToggle
                                label="Safety Alerts"
                                description="Important security and scam warnings"
                                enabled={settings.safetyAlerts}
                                onToggle={() => handleSettingToggle('safetyAlerts')}
                                recommended
                            />
                        </div>
                    </div>



                    {/* Privacy & Security */}
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Privacy & Security</h2>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <span className="font-semibold text-gray-900">Privacy Policy</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <span className="font-semibold text-gray-900">Terms of Service</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <span className="font-semibold text-gray-900">Data & Privacy</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Language */}
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <Globe className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Language</h2>
                        </div>

                        <select
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 font-medium"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="zh">中文</option>
                        </select>
                    </div>

                </div>
            </main>
        </div>
    );
}

// Toggle Component
function SettingToggle({ label, description, enabled, onToggle, recommended, icon }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3 flex-1">
                {icon && <div className="text-gray-600 mt-0.5">{icon}</div>}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{label}</h3>
                        {recommended && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                Recommended
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`relative w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
            >
                <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                />
            </button>
        </div>
    );
}

