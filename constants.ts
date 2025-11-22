import { ThemeColor, ThemeConfig } from './types';
import { 
  LayoutDashboard, 
  Settings, 
  Plus, 
  CheckSquare, 
  FileText, 
  Trash2, 
  ChevronLeft, 
  Save, 
  Sparkles,
  Moon,
  Sun,
  Search,
  X,
  Pin,
  ArrowUpDown,
  Check,
  Globe,
  MoreVertical,
  AlertTriangle,
  Eye,
  Pen
} from 'lucide-react';

export const THEMES: Record<ThemeColor, ThemeConfig> = {
  blue: {
    primary: 'bg-blue-600',
    secondary: 'bg-blue-100',
    accent: 'text-blue-600',
    text: 'text-blue-900',
    border: 'border-blue-200',
    ring: 'ring-blue-500'
  },
  green: {
    primary: 'bg-emerald-600',
    secondary: 'bg-emerald-100',
    accent: 'text-emerald-600',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    ring: 'ring-emerald-500'
  },
  purple: {
    primary: 'bg-violet-600',
    secondary: 'bg-violet-100',
    accent: 'text-violet-600',
    text: 'text-violet-900',
    border: 'border-violet-200',
    ring: 'ring-violet-500'
  },
  orange: {
    primary: 'bg-orange-600',
    secondary: 'bg-orange-100',
    accent: 'text-orange-600',
    text: 'text-orange-900',
    border: 'border-orange-200',
    ring: 'ring-orange-500'
  },
  slate: {
    primary: 'bg-slate-800',
    secondary: 'bg-slate-200',
    accent: 'text-slate-800',
    text: 'text-slate-900',
    border: 'border-slate-300',
    ring: 'ring-slate-500'
  }
};

export const ICONS = {
  Dashboard: LayoutDashboard,
  Settings,
  Plus,
  Todo: CheckSquare,
  Note: FileText,
  Delete: Trash2,
  Back: ChevronLeft,
  Save,
  AI: Sparkles,
  Moon,
  Sun,
  Search,
  Close: X,
  Pin,
  Sort: ArrowUpDown,
  Check,
  Globe,
  More: MoreVertical,
  Alert: AlertTriangle,
  View: Eye,
  Edit: Pen
};