import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/layout/HeroSection';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TransactionForm } from '@/components/TransactionForm';
import { DebtForm } from '@/components/DebtForm';
import { BudgetForm } from '@/components/BudgetForm';
import { GoalForm } from '@/components/GoalForm';
import { TransactionList } from '@/components/TransactionList';
import { DebtList } from '@/components/DebtList';
import { BudgetList } from '@/components/BudgetList';
import { GoalList } from '@/components/GoalList';
import { InsightsDashboard } from '@/components/insights/InsightsDashboard';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { Plus } from 'lucide-react';

function App() {
  const [showHero, setShowHero] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const {
    summary,
    advancedMetrics,
    recentTransactions,
    activeGoals,
    budgetStatus,
    transactions,
    debts,
    budgets,
    goals,
    isLoading,
    refreshData,
  } = useFinancialData();

  // Console logging setup for iframe
  useEffect(() => {
    ["log", "warn", "error"].forEach((level) => {
      const original = console[level as keyof Console] as (...args: any[]) => void;

      console[level as keyof Console] = (...args: any[]) => {
        // keep normal console output
        original.apply(console, args);

        // sanitize args for postMessage
        const safeArgs = args.map((a) => {
          if (a instanceof Error) {
            return {
              message: a.message,
              stack: a.stack,
              name: a.name,
            };
          }
          try {
            JSON.stringify(a);
            return a;
          } catch {
            return String(a);
          }
        });

        try {
          window.parent?.postMessage(
            { type: "iframe-console", level, args: safeArgs },
            "*"
          );
        } catch (e) {
          // use original, not the wrapped one (avoid recursion)
          original("Failed to postMessage:", e);
        }
      };
    });

    // Global error handler
    window.onerror = (msg, url, line, col, error) => {
      window.parent?.postMessage(
        {
          type: "iframe-console",
          level: "error",
          args: [
            msg,
            url,
            line,
            col,
            error ? { message: error.message, stack: error.stack } : null,
          ],
        },
        "*"
      );
    };

    // Unhandled promise rejections
    window.onunhandledrejection = (event) => {
      const reason =
        event.reason instanceof Error
          ? { message: event.reason.message, stack: event.reason.stack }
          : event.reason;

      window.parent?.postMessage(
        {
          type: "iframe-console",
          level: "error",
          args: ["Unhandled Promise Rejection:", reason],
        },
        "*"
      );
    };
  }, []);

  const handleGetStarted = () => {
    setShowHero(false);
    setActiveSection('overview');
  };

  const handleFormSuccess = () => {
    setActiveModal(null);
    refreshData();
  };

  const getModalTitle = () => {
    switch (activeModal) {
      case 'transaction':
        return 'Add Transaction';
      case 'debt':
        return 'Add Debt';
      case 'budget':
        return 'Create Budget';
      case 'goal':
        return 'Set Goal';
      default:
        return '';
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case 'transaction':
        return <TransactionForm onSuccess={handleFormSuccess} />;
      case 'debt':
        return <DebtForm onSuccess={handleFormSuccess} />;
      case 'budget':
        return <BudgetForm onSuccess={handleFormSuccess} />;
      case 'goal':
        return <GoalForm onSuccess={handleFormSuccess} />;
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return (
          <OverviewDashboard
            summary={summary}
            financialHealth={advancedMetrics?.financialHealth || null}
            spendingPatterns={advancedMetrics?.spendingPatterns || null}
            recentTransactions={recentTransactions}
          />
        );
        
      case 'analytics':
        return (
          <AnalyticsDashboard
            cashFlowData={advancedMetrics?.cashFlowData || null}
            categoryInsights={advancedMetrics?.categoryInsights || null}
            spendingPatterns={advancedMetrics?.spendingPatterns || null}
            predictiveInsights={advancedMetrics?.predictiveInsights || null}
          />
        );
        
      case 'transactions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Transactions</h2>
                <p className="text-neutral-600">Track your income and expenses</p>
              </div>
              <Button onClick={() => setActiveModal('transaction')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
            <TransactionList transactions={transactions} onRefresh={refreshData} />
          </div>
        );
        
      case 'budgets':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Budgets</h2>
                <p className="text-neutral-600">Plan and track your spending limits</p>
              </div>
              <Button onClick={() => setActiveModal('budget')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Budget
              </Button>
            </div>
            <BudgetList budgets={budgetStatus} onRefresh={refreshData} />
          </div>
        );
        
      case 'goals':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Financial Goals</h2>
                <p className="text-neutral-600">Set and achieve your financial objectives</p>
              </div>
              <Button onClick={() => setActiveModal('goal')}>
                <Plus className="h-4 w-4 mr-2" />
                Set Goal
              </Button>
            </div>
            <GoalList goals={activeGoals} onRefresh={refreshData} />
          </div>
        );
        
      case 'insights':
        return (
          <InsightsDashboard
            financialHealth={advancedMetrics?.financialHealth || null}
            predictiveInsights={advancedMetrics?.predictiveInsights || null}
            summary={summary}
          />
        );
        
      case 'settings':
        return <SettingsPanel onRefresh={refreshData} />;
        
      default:
        return null;
    }
  };

  if (showHero) {
    return (
      <ErrorBoundary>
        <HeroSection onGetStarted={handleGetStarted} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-neutral-50">
        <Navigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8">
            {renderMainContent()}
          </div>
        </main>
        
        <Modal
          isOpen={activeModal !== null}
          onClose={() => setActiveModal(null)}
          title={getModalTitle()}
          size="lg"
        >
          {renderModalContent()}
        </Modal>
      </div>
    </ErrorBoundary>
  );
}

export default App;