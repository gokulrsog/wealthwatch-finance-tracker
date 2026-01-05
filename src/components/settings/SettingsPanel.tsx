import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Download, 
  Upload, 
  Trash2, 
  Shield, 
  Bell,
  Palette,
  Database
} from 'lucide-react';
import { getSettings, saveSettings, exportAllData, clearAllData } from '@/lib/storage';

interface SettingsPanelProps {
  onRefresh: () => void;
}

export const SettingsPanel = React.memo<SettingsPanelProps>(({ onRefresh }) => {
  const [settings, setSettings] = useState(() => getSettings());
  const [isExporting, setIsExporting] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      exportAllData();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your transactions, debts, budgets, and goals. Are you absolutely sure?')) {
        setIsClearingData(true);
        try {
          clearAllData();
          onRefresh();
        } catch (error) {
          console.error('Clear data failed:', error);
        } finally {
          setIsClearingData(false);
        }
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Settings</h2>
        <p className="text-neutral-600">
          Manage your preferences and data
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-accent-600" />
              <span>General Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className="input-field"
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
                <option value="AUD">Australian Dollar (AUD)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="input-field"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-neutral-900">Notifications</h4>
                <p className="text-sm text-neutral-600">
                  Receive alerts for budget limits and goals
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-neutral-900">Auto Backup</h4>
                <p className="text-sm text-neutral-600">
                  Automatically backup data locally
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-accent-600" />
              <span>Data Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Export Data</h4>
              <p className="text-sm text-neutral-600 mb-4">
                Download all your financial data as a JSON file for backup or migration.
              </p>
              <Button 
                onClick={handleExportData}
                isLoading={isExporting}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </div>

            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Import Data</h4>
              <p className="text-sm text-neutral-600 mb-4">
                Import previously exported data or migrate from another system.
              </p>
              <Button variant="secondary" className="w-full" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Import Data (Coming Soon)
              </Button>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <h4 className="font-medium text-danger-600 mb-2">Danger Zone</h4>
              <p className="text-sm text-neutral-600 mb-4">
                Permanently delete all your data. This action cannot be undone.
              </p>
              <Button 
                variant="danger"
                onClick={handleClearAllData}
                isLoading={isClearingData}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Privacy */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-accent-600" />
            <span>Security & Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-neutral-900">Data Storage</h4>
              <div className="space-y-3 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-success-500" />
                  <span>All data is stored locally on your device</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-success-500" />
                  <span>No data is transmitted to external servers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-success-500" />
                  <span>Your financial information remains private</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-neutral-900">Security Features</h4>
              <div className="space-y-3 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-success-500" />
                  <span>Browser-based encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-success-500" />
                  <span>Secure data validation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-success-500" />
                  <span>Regular security updates</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle>About WealthWatch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-600 leading-relaxed">
              WealthWatch is a premium financial intelligence platform designed to help you take 
              control of your financial future. With enterprise-grade analytics, intelligent insights, 
              and personalized wealth management tools, WealthWatch empowers you to make informed 
              financial decisions and build lasting wealth.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-6 not-prose">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">100%</div>
                <div className="text-sm text-neutral-600">Private & Secure</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">24/7</div>
                <div className="text-sm text-neutral-600">Real-time Analytics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">AI</div>
                <div className="text-sm text-neutral-600">Powered Insights</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

SettingsPanel.displayName = 'SettingsPanel';