import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  User as UserIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    fetchUsers();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openModal = (task = null) => {
    setEditingTask(task || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tasks</h2>
          <p className="text-slate-500 font-medium">Manage and track your team's progress</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus size={20} />
          New Task
        </button>
      </div>

      <TaskModal 
        isOpen={showModal}
        onClose={closeModal}
        onTaskCreated={handleTaskCreated}
        editingTask={editingTask}
        users={users}
      />

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="input-field pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="input-field min-w-[180px] appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-slate-100"></div>
          ))
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task._id} className="card group relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                    task.priority === 'high' ? 'bg-red-50 text-red-600' :
                    task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {task.priority} Priority
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {user.role === 'admin' && (
                      <>
                        <button onClick={() => openModal(task)} className="p-1 text-slate-400 hover:text-primary-600 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(task._id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{task.title}</h4>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {format(new Date(task.dueDate), 'MMM d')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserIcon size={14} />
                    {task.assignedTo?.name || 'Unassigned'}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <select 
                  className={`text-xs font-bold rounded-lg px-2 py-1 outline-none appearance-none cursor-pointer ${
                    task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                    task.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-100 text-slate-600'
                  }`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <div className="flex items-center gap-2">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="text-emerald-500" size={20} />
                  ) : task.status === 'in-progress' ? (
                    <Clock className="text-amber-500" size={20} />
                  ) : (
                    <AlertCircle className="text-slate-300" size={20} />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center card bg-white">
            <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
