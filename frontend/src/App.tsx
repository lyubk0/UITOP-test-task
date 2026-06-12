import { Toaster } from 'react-hot-toast';
import TodosPage from './pages/TodosPage';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
      <TodosPage />
    </div>
  );
}
