import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { CogIcon, BellIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface Settings {
  notifications: {
    email: boolean;
    slack: boolean;
    bidAlerts: boolean;
    budgetAlerts: boolean;
  };
  bidding: {
    maxBidAmount: number;
    autoBidding: boolean;
    bidStrategy: 'aggressive' | 'balanced' | 'conservative';
  };
  security: {
    twoFactorAuth: boolean;
    apiKeyExpiration: number;
    ipWhitelist: string[];
  };
  billing: {
    autoRecharge: boolean;
    minimumBalance: number;
    paymentMethod: string;
  };
}

const Settings = () => {
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      slack: false,
      bidAlerts: true,
      budgetAlerts: true,
    },
    bidding: {
      maxBidAmount: 1000,
      autoBidding: true,
      bidStrategy: 'balanced',
    },
    security: {
      twoFactorAuth: false,
      apiKeyExpiration: 30,
      ipWhitelist: [],
    },
    billing: {
      autoRecharge: true,
      minimumBalance: 1000,
      paymentMethod: 'credit_card',
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const response = await fetch('http://localhost:3000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      const data = await response.json();
      setSettings({ ...settings, ...data });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications Section */}
      <section className="bg-dark-bg-secondary rounded-lg p-6">
        <h2 className="text-lg font-medium text-dark-text-primary mb-4 flex items-center">
          <BellIcon className="h-6 w-6 mr-2" />
          Notification Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-dark-text-primary">Email Notifications</h3>
              <p className="text-sm text-dark-text-secondary">Receive bid updates via email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onChange={(checked) => updateSettings({
                notifications: { ...settings.notifications, email: checked }
              })}
              className={`${
                settings.notifications.email ? 'bg-primary-600' : 'bg-dark-bg-tertiary'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span className={`${
                settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-dark-text-primary">Slack Notifications</h3>
              <p className="text-sm text-dark-text-secondary">Receive bid updates via Slack</p>
            </div>
            <Switch
              checked={settings.notifications.slack}
              onChange={(checked) => updateSettings({
                notifications: { ...settings.notifications, slack: checked }
              })}
              className={`${
                settings.notifications.slack ? 'bg-primary-600' : 'bg-dark-bg-tertiary'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span className={`${
                settings.notifications.slack ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>
        </div>
      </section>

      {/* Bidding Settings */}
      <section className="bg-dark-bg-secondary rounded-lg p-6">
        <h2 className="text-lg font-medium text-dark-text-primary mb-4 flex items-center">
          <CogIcon className="h-6 w-6 mr-2" />
          Bidding Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-primary">
              Maximum Bid Amount (USD)
            </label>
            <input
              type="number"
              value={settings.bidding.maxBidAmount}
              onChange={(e) => updateSettings({
                bidding: { ...settings.bidding, maxBidAmount: parseFloat(e.target.value) }
              })}
              className="mt-1 block w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border rounded-md text-dark-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text-primary">
              Bidding Strategy
            </label>
            <select
              value={settings.bidding.bidStrategy}
              onChange={(e) => updateSettings({
                bidding: { ...settings.bidding, bidStrategy: e.target.value as any }
              })}
              className="mt-1 block w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border rounded-md text-dark-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="aggressive">Aggressive</option>
              <option value="balanced">Balanced</option>
              <option value="conservative">Conservative</option>
            </select>
          </div>
        </div>
      </section>

      {/* Security Settings */}
      <section className="bg-dark-bg-secondary rounded-lg p-6">
        <h2 className="text-lg font-medium text-dark-text-primary mb-4 flex items-center">
          <ShieldCheckIcon className="h-6 w-6 mr-2" />
          Security Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-dark-text-primary">Two-Factor Authentication</h3>
              <p className="text-sm text-dark-text-secondary">Add an extra layer of security</p>
            </div>
            <Switch
              checked={settings.security.twoFactorAuth}
              onChange={(checked) => updateSettings({
                security: { ...settings.security, twoFactorAuth: checked }
              })}
              className={`${
                settings.security.twoFactorAuth ? 'bg-primary-600' : 'bg-dark-bg-tertiary'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span className={`${
                settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text-primary">
              API Key Expiration (days)
            </label>
            <input
              type="number"
              value={settings.security.apiKeyExpiration}
              onChange={(e) => updateSettings({
                security: { ...settings.security, apiKeyExpiration: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border rounded-md text-dark-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </section>

      {/* Billing Settings */}
      <section className="bg-dark-bg-secondary rounded-lg p-6">
        <h2 className="text-lg font-medium text-dark-text-primary mb-4 flex items-center">
          <CreditCardIcon className="h-6 w-6 mr-2" />
          Billing Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-dark-text-primary">Auto-Recharge</h3>
              <p className="text-sm text-dark-text-secondary">Automatically recharge when balance is low</p>
            </div>
            <Switch
              checked={settings.billing.autoRecharge}
              onChange={(checked) => updateSettings({
                billing: { ...settings.billing, autoRecharge: checked }
              })}
              className={`${
                settings.billing.autoRecharge ? 'bg-primary-600' : 'bg-dark-bg-tertiary'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span className={`${
                settings.billing.autoRecharge ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text-primary">
              Minimum Balance (USD)
            </label>
            <input
              type="number"
              value={settings.billing.minimumBalance}
              onChange={(e) => updateSettings({
                billing: { ...settings.billing, minimumBalance: parseFloat(e.target.value) }
              })}
              className="mt-1 block w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border rounded-md text-dark-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings; 