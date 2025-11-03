
import {
  doc,
  collection,
  onSnapshot,
  Unsubscribe,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Expense, Income, Categories, DeleteInfo } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

let expensesUnsub: Unsubscribe = () => {};
let incomeUnsub: Unsubscribe = () => {};
let settingsUnsub: Unsubscribe = () => {};

export const attachDataListeners = (
  appId: string,
  dataCallback: (data: { expenses: Expense[], income: Income[] }) => void,
  settingsCallback: (settings: { budget: number, categories: Categories, theme: 'light' | 'dark' }) => void
) => {
  const publicDataPath = `artifacts/${appId}/public/data`;

  const settingsRef = doc(db, publicDataPath, 'settings', 'userSettings');
  settingsUnsub = onSnapshot(settingsRef, async (docSnap) => {
    if (docSnap.exists()) {
      const settingsData = docSnap.data();
      let categories = settingsData.categories || DEFAULT_CATEGORIES;
      let categoriesUpdated = false;

      for (const key of Object.keys(DEFAULT_CATEGORIES)) {
        if (!categories[key]) {
          categories[key] = DEFAULT_CATEGORIES[key];
          categoriesUpdated = true;
        }
      }

      if (categoriesUpdated) {
        await setDoc(settingsRef, { categories }, { merge: true });
      }

      settingsCallback({
        budget: settingsData.budget || 0,
        categories: categories,
        theme: settingsData.theme || 'dark',
      });
    } else {
      await setDoc(settingsRef, { budget: 0, categories: DEFAULT_CATEGORIES, theme: 'dark' });
      settingsCallback({ budget: 0, categories: DEFAULT_CATEGORIES, theme: 'dark' });
    }
  });

  const fetchData = () => {
    const expensesRef = collection(db, publicDataPath, 'expenses');
    expensesUnsub = onSnapshot(expensesRef, (querySnapshot) => {
      const expenses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      const incomeRef = collection(db, publicDataPath, 'income');
      incomeUnsub = onSnapshot(incomeRef, (incomeSnapshot) => {
        const income = incomeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Income));
        dataCallback({ expenses, income });
      });
    });
  };
  fetchData();
};

export const detachDataListeners = () => {
  expensesUnsub();
  incomeUnsub();
  settingsUnsub();
};

export const saveExpense = async (appId: string, expense: Omit<Expense, 'id'>, id?: string) => {
  const path = `artifacts/${appId}/public/data/expenses`;
  if (id) {
    await updateDoc(doc(db, path, id), expense);
  } else {
    await addDoc(collection(db, path), expense);
  }
};

export const saveIncome = async (appId: string, income: Omit<Income, 'id'>, id?: string) => {
  const path = `artifacts/${appId}/public/data/income`;
  if (id) {
    await updateDoc(doc(db, path, id), income);
  } else {
    await addDoc(collection(db, path), income);
  }
};

export const saveBudget = async (appId: string, budget: number) => {
  const settingsRef = doc(db, `artifacts/${appId}/public/data/settings`, 'userSettings');
  await setDoc(settingsRef, { budget }, { merge: true });
};

export const saveCategories = async (appId: string, categories: Categories) => {
    const settingsRef = doc(db, `artifacts/${appId}/public/data/settings`, 'userSettings');
    await setDoc(settingsRef, { categories }, { merge: true });
};

export const deleteTransaction = async (appId: string, deleteInfo: DeleteInfo) => {
    if (!deleteInfo.id) return;
    const path = `artifacts/${appId}/public/data/${deleteInfo.type}s`;
    await deleteDoc(doc(db, path, deleteInfo.id));
};

export const deleteCategory = async (appId: string, categoryId: string, expenses: Expense[], currentCategories: Categories) => {
    const batch = writeBatch(db);
    const newCategories = { ...currentCategories };
    delete newCategories[categoryId];

    expenses.forEach(exp => {
        if (exp.category === categoryId) {
            const expRef = doc(db, `artifacts/${appId}/public/data/expenses`, exp.id);
            batch.update(expRef, { category: 'other' });
        }
    });

    const settingsRef = doc(db, `artifacts/${appId}/public/data/settings`, 'userSettings');
    batch.update(settingsRef, { categories: newCategories });

    await batch.commit();
}


export const handleImportBackup = async (appId: string, file: File) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
      try {
          const importedData = JSON.parse(event.target!.result as string);
          if (!importedData.settings || !importedData.expenses || !importedData.income) {
              throw new Error('Invalid backup file structure.');
          }

          const batch = writeBatch(db);
          const publicDataPath = `artifacts/${appId}/public/data`;

          const collections = ['expenses', 'income', 'recurringExpenses'];
          for (const coll of collections) {
              const collRef = collection(db, publicDataPath, coll);
              const snapshot = await getDocs(collRef);
              snapshot.forEach(doc => batch.delete(doc.ref));
          }

          importedData.expenses.forEach((exp: Expense) => {
              const newDocRef = doc(collection(db, publicDataPath, 'expenses'));
              delete (exp as any).id;
              batch.set(newDocRef, exp);
          });
          importedData.income.forEach((inc: Income) => {
              const newDocRef = doc(collection(db, publicDataPath, 'income'));
              delete (inc as any).id;
              batch.set(newDocRef, inc);
          });

          const settingsRef = doc(db, publicDataPath, 'settings', 'userSettings');
          batch.set(settingsRef, importedData.settings);
          
          await batch.commit();
      } catch (e) {
          console.error("Error restoring backup:", e);
          throw e; // re-throw to be caught in component
      }
  };
  reader.readAsText(file);
};

export const handleResetData = async (appId: string) => {
    const batch = writeBatch(db);
    const publicDataPath = `artifacts/${appId}/public/data`;

    const collections = ['expenses', 'income', 'recurringExpenses'];
    for (const coll of collections) {
        const collRef = collection(db, publicDataPath, coll);
        const snapshot = await getDocs(collRef);
        snapshot.forEach(doc => batch.delete(doc.ref));
    }

    const settingsRef = doc(db, publicDataPath, 'settings', 'userSettings');
    batch.set(settingsRef, { budget: 0, categories: DEFAULT_CATEGORIES, theme: 'dark' });

    await batch.commit();
};

export const checkRecurringExpenses = async (appId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const recurringRef = collection(db, `artifacts/${appId}/public/data/recurring`);
    const q = query(recurringRef, where("nextDueDate", "<=", today));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return;

        const batch = writeBatch(db);
        querySnapshot.forEach(docSnap => {
            const rex = docSnap.data();
            let nextDueDate = new Date(rex.nextDueDate + 'T00:00:00');

            const newExpense = { ...rex, date: rex.nextDueDate };
            delete newExpense.nextDueDate;
            const newExpenseRef = doc(collection(db, `artifacts/${appId}/public/data/expenses`));
            batch.set(newExpenseRef, newExpense);
            
            const updatedDueDate = new Date(nextDueDate.setMonth(nextDueDate.getMonth() + 1)).toISOString().split('T')[0];
            const rexRef = doc(db, `artifacts/${appId}/public/data/recurring`, docSnap.id);
            batch.update(rexRef, { nextDueDate: updatedDueDate });
        });
        
        await batch.commit();
    } catch (err) {
        console.error("Error processing recurring expenses: ", err);
    }
};
