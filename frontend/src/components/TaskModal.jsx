import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Loader } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskModal = ({ isOpen, onClose, onTaskCreated, editingTask = null, users: propsUsers = [] }) => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState(propsUsers);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'pending',
  });

  // Fetch users on mount
  useEffect(() => {
    if (isOpen && users.length === 0) {
      fetchUsers();
    }
  }, [isOpen]);

  // Update users when props change
  useEffect(() => {
    if (propsUsers && propsUsers.length > 0) {
      setUsers(propsUsers);
    }
  }, [propsUsers]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setError(''); // Clear previous errors
      const res = await api.get('/users');
      const userData = res.data.data || [];
      setUsers(userData);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Don't show blocking error for user fetching, just log it
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        assignedTo: editingTask.assignedTo._id || editingTask.assignedTo,
        dueDate: format(new Date(editingTask.dueDate), 'yyyy-MM-dd'),
        status: editingTask.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'pending',
      });
    }
    setError('');
  }, [editingTask, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      setLoading(false);
      return;
    }

    // Fallback to current user if none selected
    const assignedTo = formData.assignedTo || authUser?._id || authUser?.id;
    if (!assignedTo) {
      setError('Session expired. Please log in again.');
      setLoading(false);
      return;
    }
    if (!formData.dueDate) {
      setError('Due date is required');
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      assignedTo,
    };

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, payload);
      } else {
        const response = await api.post('/tasks', payload);
        console.log('Task created:', response.data);
      }
      onTaskCreated();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save task';
      setError(errorMsg);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-auto max-h-[90vh] overflow-y-auto border border-slate-100">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-8 border-b border-slate-100 bg-white/80 backdrop-blur-md z-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
              <AlertCircle size={20} className="text-rose-600 flex-shrink-0" />
              <p className="text-sm font-bold text-rose-700">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What needs to be done?"
              rows="3"
              disabled={loading}
              className="input-field resize-none"
            />
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
              Assign To *
            </label>
            <div className="relative">
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                disabled={loading || usersLoading}
                className="input-field appearance-none"
              >
                <option value="">
                  {usersLoading ? 'Loading users...' : 'Select a user'}
                </option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              {usersLoading && (
                <Loader size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" />
              )}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Due Date *
            </label>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-slate-500" />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Status (only for editing) */}
          {editingTask && (
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || usersLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
