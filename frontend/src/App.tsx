import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { CreatePostModal } from "@/components/modals/CreatePostModal";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { FeedPage } from "@/pages/FeedPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ExplorePage } from "@/pages/ExplorePage";
import { MessagesPage } from "@/pages/MessagesPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { Toaster } from "sonner";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ThemeProvider } from "./components/layout/theme-provider";
import { profile } from "@/features/user/userThunks";
import { EditProfile } from "@/components/common/EditProfile";
import { EditEmail } from "@/components/common/EditEmail";
import { EditPassword } from "@/components/common/EditPassword";

const AppRoutes: React.FC = () => {
  const { token, authChecking } = useAppSelector((state) => state.user);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  if (authChecking) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          {!token ? (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route
                path="/feed"
                element={
                  <Layout onCreatePost={() => setIsCreatePostModalOpen(true)}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FeedPage />
                    </motion.div>
                  </Layout>
                }
              />
              <Route
                path="/profile"
                element={
                  <Layout onCreatePost={() => setIsCreatePostModalOpen(true)}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProfilePage />
                    </motion.div>
                  </Layout>
                }
              />
              <Route
                path="/explore"
                element={
                  <Layout onCreatePost={() => setIsCreatePostModalOpen(true)}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ExplorePage />
                    </motion.div>
                  </Layout>
                }
              />
              <Route
                path="/messages"
                element={
                  <Layout onCreatePost={() => setIsCreatePostModalOpen(true)}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MessagesPage />
                    </motion.div>
                  </Layout>
                }
              />
              <Route
                path="/settings"
                element={
                  <Layout onCreatePost={() => setIsCreatePostModalOpen(true)}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SettingsPage />
                    </motion.div>
                  </Layout>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <Layout onCreatePost={() => setIsCreatePostModalOpen(true)}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <EditProfile />
                    </motion.div>
                  </Layout>
                }
              />
              <Route
                path="/security"
                element={
                  <Layout onCreatePost={() => setIsCreatePostModalOpen(true)}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <EditPassword />
                    </motion.div>
                  </Layout>
                }
              />
              <Route
                path="/privacy"
                element={
                  <Layout onCreatePost={() => setIsCreatePostModalOpen(true)}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <EditEmail />
                    </motion.div>
                  </Layout>
                }
              />
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </>
          )}
        </Routes>
      </AnimatePresence>

      {token && (
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
        />
      )}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </Router>
    </ThemeProvider>
  );
}

export default App;
