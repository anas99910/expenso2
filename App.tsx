
import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { auth, db } from './services/firebaseConfig';
import {
  attachDataListeners,
  checkRecurringExpenses,
  detachDataListeners,
  handleImportBackup,
  handleResetData
} from './services/firebaseService';

import { 
  Expense,
  Income,
  Categories,
  Transaction,
  SortOrder,
  HistoryType,
  View,
  ModalType,
  DeleteInfo
} from './types';

import { DEFAULT_CATEGORIES } from './constants';

import PasswordGate from './components/PasswordGate';
import MainView from './components/MainView';
import YearlyReportView from './components/YearlyReportView';
import ExpenseModal from './components/modals/ExpenseModal';
import IncomeModal from './components/modals/IncomeModal';
import BudgetModal from './components/modals/BudgetModal';
import CategoryModal from './components/modals/CategoryModal';
import SettingsModal from './components/modals/SettingsModal';
import DeleteModal from './components/modals/DeleteModal';
import ResetPasswordModal from './components/modals/ResetPasswordModal';
import Toast from './components/shared/Toast';

const App: React.FC = () => {
  const [appId, setAppId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Categories>(DEFAULT_CATEGORIES);
  const [budget, setBudget] = useState<number>(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // UI State
  const [view, setView] = useState<View>(View.MAIN);
  const [currentDate, setCurrentDate] = useState<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteInfo, setDeleteInfo] = useState<DeleteInfo | null>(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  
  const [toast, setToast] = useState<{ message: string, isError: boolean } | null>(null);

  useEffect(() => {
    const authenticatedAppId = sessionStorage.getItem('expenso_app_id');
    if (authenticatedAppId) {
      setAppId(authenticatedAppId);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!appId) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsLoading(false);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          showToast('Firebase connection failed. Please refresh.', true);
          setIsLoading(false);
        });
      }
    });

    return () => unsubscribe();
  }, [appId]);

  useEffect(() => {
    if (userId && appId) {
      const dataCallback = (data: { expenses: Expense[], income: Income[] }) => {
        setExpenses(data.expenses);
        setIncome(data.income);
      };
      const settingsCallback = (settings: { budget: number, categories: Categories, theme: 'light' | 'dark' }) => {
        setBudget(settings.budget);
        setCategories(settings.categories);
        setTheme(settings.theme);
        document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      };
      
      attachDataListeners(appId, dataCallback, settingsCallback);
      checkRecurringExpenses(appId);

      return () => detachDataListeners();
    }
  }, [userId, appId]);

  const showToast = useCallback((message: string, isError: boolean = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleLoginSuccess = (newAppId: string) => {
    sessionStorage.setItem('expenso_app_id', newAppId);
    setAppId(newAppId);
    setIsLoading(true); // Show loading while auth state changes
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('expenso_app_id');
      setAppId(null);
      setUserId(null);
      // Reset all state to default
      setExpenses([]);
      setIncome([]);
      setCategories(DEFAULT_CATEGORIES);
      setBudget(0);
      setTheme('dark');
      document.documentElement.classList.add('dark');
      setView(View.MAIN);
    } catch (error) {
      console.error("Error signing out:", error);
      showToast('Error signing out.', true);
    }
  };
  
  const handleResetApp = async () => {
    if (!appId) return;
    try {
      await handleResetData(appId);
      setShowResetPasswordModal(false);
      setDeleteInfo(null);
      setActiveModal(null);
      showToast('All app data has been reset.');
    } catch (e) {
      showToast('Failed to reset data.', true);
    }
  };

  if (isLoading && appId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary">
        Loading...
      </div>
    );
  }

  if (!appId) {
    return <PasswordGate onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`font-sans ${theme}`}>
        {view === View.MAIN && (
            <MainView
                expenses={expenses}
                income={income}
                categories={categories}
                budget={budget}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                setView={setView}
                onLogout={handleLogout}
                onOpenModal={(modal, transaction) => {
                    setActiveModal(modal);
                    setEditingTransaction(transaction || null);
                }}
                onDelete={(info) => setDeleteInfo(info)}
                theme={theme}
            />
        )}
        {view === View.YEARLY_REPORT && (
            <YearlyReportView
                year={currentDate.year}
                expenses={expenses}
                income={income}
                onBack={() => setView(View.MAIN)}
            />
        )}

        {/* Modals */}
        <ExpenseModal
            isOpen={activeModal === ModalType.EXPENSE}
            onClose={() => setActiveModal(null)}
            expense={editingTransaction as Expense | null}
            categories={categories}
            appId={appId}
            currentDate={currentDate}
            showToast={showToast}
        />
        <IncomeModal
            isOpen={activeModal === ModalType.INCOME}
            onClose={() => setActiveModal(null)}
            income={editingTransaction as Income | null}
            appId={appId}
            showToast={showToast}
        />
        <BudgetModal
            isOpen={activeModal === ModalType.BUDGET}
            onClose={() => setActiveModal(null)}
            appId={appId}
            currentBudget={budget}
            showToast={showToast}
        />
        <CategoryModal
             isOpen={activeModal === ModalType.CATEGORY}
             onClose={() => setActiveModal(null)}
             appId={appId}
             categories={categories}
             showToast={showToast}
             onDeleteRequest={(id) => setDeleteInfo({id, type: 'category'})}
        />
        <SettingsModal
            isOpen={activeModal === ModalType.SETTINGS}
            onClose={() => setActiveModal(null)}
            appId={appId}
            onImport={async (file) => {
                if (appId) {
                    await handleImportBackup(appId, file);
                    showToast('Backup restored successfully!');
                }
            }}
            onResetRequest={() => setShowResetPasswordModal(true)}
        />
        <DeleteModal
            isOpen={!!deleteInfo}
            onClose={() => setDeleteInfo(null)}
            deleteInfo={deleteInfo}
            appId={appId}
            categories={categories}
            showToast={showToast}
        />
        <ResetPasswordModal
            isOpen={showResetPasswordModal}
            onClose={() => setShowResetPasswordModal(false)}
            onConfirm={() => {
                setShowResetPasswordModal(false);
                setDeleteInfo({ id: null, type: 'all-data' });
            }}
        />

        <Toast toast={toast} />
    </div>
  );
};

export default App;
