'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Menu,
  MessageSquare,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ListTodo,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import TaskList from './task-list';

interface EditorLayoutProps {
  children: React.ReactNode;
  project: any;
}

export default function EditorLayout({ children, project }: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'document' | 'tasks' | 'comments' | 'collaborators' | 'settings'>('document');

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <TaskList
            projectId={project.id}
            tasks={project.tasks || []}
            onTasksUpdate={(tasks) => {
              // Handle tasks update
            }}
          />
        );
      case 'document':
        return children;
      default:
        return <div className="p-4">Content for {activeTab}</div>;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div
        className={cn(
          'relative border-r bg-background transition-all duration-300',
          isSidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="space-y-1 p-2">
            <Button
              variant={activeTab === 'document' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('document')}
            >
              <FileText className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Document</span>}
            </Button>
            <Button
              variant={activeTab === 'tasks' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('tasks')}
            >
              <ListTodo className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Tasks</span>}
            </Button>
            <Button
              variant={activeTab === 'comments' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('comments')}
            >
              <MessageSquare className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Comments</span>}
            </Button>
            <Button
              variant={activeTab === 'collaborators' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('collaborators')}
            >
              <Users className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Collaborators</span>}
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Settings</span>}
            </Button>
          </div>
        </ScrollArea>
      </div>
      <main className="flex-1 overflow-hidden">
        <div className="h-16 border-b px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{project.title}</h1>
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}