
import React, { useState } from 'react';
import { Task } from '../types';
import { mockDb } from '../services/mockDatabase';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockDb.getTasks());
  const [user, setUser] = useState(mockDb.getUser());
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  const handleTaskClick = (task: Task) => {
    if (task.isCompleted || verifyingId) return;

    // Open link in new tab
    if (task.link !== '#') window.open(task.link, '_blank');

    // Start verification
    setVerifyingId(task.id);
    setCountdown(10);

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          completeTask(task);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeTask = (task: Task) => {
    const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, isCompleted: true } : t);
    const updatedUser = { ...user, balance: user.balance + task.reward };
    
    setTasks(updatedTasks);
    setUser(updatedUser);
    setVerifyingId(null);
    
    mockDb.saveTasks(updatedTasks);
    mockDb.saveUser(updatedUser);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass p-5 rounded-3xl">
        <h1 className="text-xl font-black mb-1">Earn More OLO</h1>
        <p className="text-gray-400 text-sm">Complete simple tasks to boost your balance instantly.</p>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map(task => (
          <div key={task.id} className="glass p-4 rounded-2xl flex items-center justify-between transition-all active:scale-95 cursor-pointer" onClick={() => handleTaskClick(task)}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <i className={`fa-solid ${task.title.toLowerCase().includes('twitter') ? 'fa-brands fa-x-twitter' : task.title.toLowerCase().includes('telegram') ? 'fa-brands fa-telegram' : 'fa-bolt'}`}></i>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">{task.title}</span>
                <span className="text-[10px] text-gray-500">{task.description}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {task.isCompleted ? (
                <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                  <i className="fa-solid fa-circle-check"></i>
                  DONE
                </div>
              ) : verifyingId === task.id ? (
                <div className="bg-blue-500 text-white font-mono text-xs px-3 py-1 rounded-full">
                  {countdown}s
                </div>
              ) : (
                <div className="flex items-center gap-1 glass px-3 py-1 rounded-full text-xs font-black">
                  <span className="text-[#00f2ff]">+{task.reward}</span>
                  <span className="text-[8px]">OLO</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-white/5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-widest">
          <i className="fa-solid fa-circle-info"></i>
          Tip
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Tasks are verified automatically. Please ensure you actually follow the links as our system checks your engagement!
        </p>
      </div>
    </div>
  );
};

export default Tasks;
