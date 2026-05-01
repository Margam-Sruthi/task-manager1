import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ClipboardList,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/tasks/stats');
        setStats(statsRes.data.data);
        
        const tasksRes = await api.get('/tasks');
        setRecentTasks(tasksRes.data.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Overview</h2>
          <p className="text-slate-500 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/tasks" className="btn-primary self-start md:self-auto">
          <Plus size={20} />
          Add New Task
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="stat-card flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Tasks</h3>
            <Link to="/tasks" className="text-indigo-600 text-sm font-black hover:underline flex items-center gap-1 uppercase tracking-wider">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTasks.length > 0 ? recentTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        task.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-400 italic">
                      No tasks found. Create your first task!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Priority Breakdown</h3>
          <div className="card space-y-6">
            {['high', 'medium', 'low'].map(priority => {
              const count = recentTasks.filter(t => t.priority === priority).length;
              const total = recentTasks.length || 1;
              const percentage = (count / total) * 100;
              const colors = {
                high: 'bg-red-500',
                medium: 'bg-amber-500',
                low: 'bg-emerald-500'
              };
              
              return (
                <div key={priority} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium text-slate-600">{priority} Priority</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors[priority]} transition-all duration-1000`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
