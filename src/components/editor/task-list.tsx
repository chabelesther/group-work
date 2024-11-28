'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
}

interface TaskListProps {
  projectId: string;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function TaskList({ projectId, tasks, onTasksUpdate }: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
    };

    try {
      await updateDoc(doc(db, 'projects', projectId), {
        tasks: arrayUnion(newTask),
      });
      onTasksUpdate([...tasks, newTask]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    try {
      await updateDoc(doc(db, 'projects', projectId), {
        tasks: updatedTasks,
      });
      onTasksUpdate(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (!taskToDelete) return;

    try {
      await updateDoc(doc(db, 'projects', projectId), {
        tasks: arrayRemove(taskToDelete),
      });
      onTasksUpdate(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <Button onClick={addTask} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                  {task.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}