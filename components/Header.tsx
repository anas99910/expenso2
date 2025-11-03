
import React from 'react';
import { View, ModalType } from '../types';
import GlassInput from './shared/GlassInput';

interface HeaderProps {
    currentDate: { year: number; month: number };
    theme: 'light' | 'dark';
    setCurrentDate: React.Dispatch<React.SetStateAction<{ year: number; month: number }>>;
    setView: React.Dispatch<React.SetStateAction<View>>;
    onLogout: () => void;
    onOpenModal: (modal: ModalType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentDate, setCurrentDate, setView, onLogout, onOpenModal, theme }) => {

    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        // The theme change will be persisted by the onSnapshot listener in App.tsx
        // but this gives instant UI feedback.
    };
    
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value.startsWith('yearly')) {
            const year = parseInt(value.split('-')[1], 10);
            setCurrentDate({ year, month: 0 }); // month doesn't matter for yearly
            setView(View.YEARLY_REPORT);
        } else {
            setView(View.MAIN);
            const [year, month] = value.split('-').map(Number);
            setCurrentDate({ year, month });
        }
    };

    const monthOptions = () => {
        const options = [];
        const now = new Date();
        options.push(<option key="yearly" value={`yearly-${now.getFullYear()}`}>Yearly View ({now.getFullYear()})</option>);
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = date.getMonth();
            const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            options.push(<option key={`${year}-${month}`} value={`${year}-${month}`}>{label}</option>);
        }
        return options;
    };
    
    return (
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
            <div className="flex-1 flex items-center gap-4 w-full md:w-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary tracking-tight">Expenso</h1>
                <select
                    value={`${currentDate.year}-${currentDate.month}`}
                    onChange={handleMonthChange}
                    className="glass-input text-sm rounded-lg py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                    {monthOptions()}
                </select>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                {/* Theme, Settings, Logout Buttons... */}
                <button onClick={handleThemeToggle} className="p-2 rounded-full glass-input" title="Toggle Theme">
                    {theme === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-dark-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    )}
                </button>
                <button onClick={() => onOpenModal(ModalType.SETTINGS)} className="p-2 rounded-full glass-input" title="Settings">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-text-primary dark:text-dark-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                <button onClick={onLogout} className="p-2 rounded-full glass-input" title="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-text-primary dark:text-dark-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
                <button onClick={() => onOpenModal(ModalType.BUDGET)} className="bg-teal-600 hover:bg-teal-500 text-white font-medium py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16v2m-6-6H3m6 0H9m6 0h3m-3 0h-3m-6 0H3m6 0H9m6 0h3m-3 0h-3" /></svg>
                    <span className="hidden sm:inline">Budget</span>
                </button>
                <button onClick={() => onOpenModal(ModalType.INCOME)} className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
                    <span className="hidden sm:inline">Add Income</span>
                </button>
                <button onClick={() => onOpenModal(ModalType.EXPENSE)} className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    <span className="hidden sm:inline">Add Expense</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
