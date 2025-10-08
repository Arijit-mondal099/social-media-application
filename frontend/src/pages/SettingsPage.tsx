import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/hooks/useAppSelector';

export const SettingsPage: React.FC = () => {
  const {  } = useAppSelector(state => state.user);

  const settingSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Edit Profile', description: 'Update your profile information' },
        { label: 'Privacy', description: 'Control your privacy settings' },
        { label: 'Security', description: 'Password and security options' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', description: 'Receive notifications on your device', toggle: true },
        { label: 'Email Notifications', description: 'Receive email updates', toggle: true },
        { label: 'SMS Notifications', description: 'Receive SMS alerts', toggle: false },
      ],
    },
    {
      title: 'Appearance',
      icon: theme === 'light' ? Sun : Moon,
      items: [
        { 
          label: 'Theme', 
          description: `Currently using ${theme} mode`,
          action: toggleTheme,
          toggle: theme === 'dark'
        },
      ],
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        { label: 'Help Center', description: 'Get help and support' },
        { label: 'Contact Us', description: 'Reach out to our support team' },
        { label: 'Terms of Service', description: 'Read our terms and conditions' },
        { label: 'Privacy Policy', description: 'Learn about our privacy practices' },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <section.icon className="w-5 h-5" />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <Label className="text-base font-medium">
                          {item.label}
                        </Label>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* {item.toggle !== undefined ? (
                          <Switch
                            checked={item.toggle}
                            onCheckedChange={item.action}
                          />
                        ) : (
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )} */}
                      </div>
                    </div>
                    {itemIndex < section.items.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                These actions cannot be undone. Please be careful.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Sign Out</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};