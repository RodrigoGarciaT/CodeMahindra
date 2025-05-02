import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  status: string;
  taskType?: string;
  priority?: string;
  createdAt?: string;
  estimatedTime?: number;
  affectedModule?: string;
  tag?: string;
  reward?: number;
  employee_id?: string;
  description?: string;
  sprint?: string;
  labels?: string;
  reporter?: string;
  assignee_name?: string;
  assignee_avatar?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/tasks/').then((res) => {
      const grouped: Record<string, Task[]> = {};
      res.data.forEach((task: Task) => {
        const normalizedStatus =
          task.status?.toLowerCase() === "in progress"
            ? "In Progress"
            : task.status?.toLowerCase() === "code review"
            ? "Code Review"
            : task.status?.toLowerCase() === "done"
            ? "Done"
            : "To Do";

        if (!grouped[normalizedStatus]) grouped[normalizedStatus] = [];
        grouped[normalizedStatus].push({ ...task, status: normalizedStatus });
      });

      const cols = Object.entries(grouped).map(([status, tasks]) => ({
        id: status.toLowerCase().replace(/\s+/g, ''),
        title: status,
        tasks,
      }));
      setColumns(cols);
    });
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns.find((c) => c.id === source.droppableId)!;
    const destCol = columns.find((c) => c.id === destination.droppableId)!;
    const sourceTasks = [...sourceCol.tasks];
    const destTasks = [...destCol.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceCol.id === destCol.id) {
      sourceTasks.splice(destination.index, 0, movedTask);
      setColumns(columns.map(col => col.id === sourceCol.id ? { ...col, tasks: sourceTasks } : col));
    } else {
      movedTask.status = destCol.title;
      destTasks.splice(destination.index, 0, movedTask);
      setColumns(columns.map(col => {
        if (col.id === sourceCol.id) return { ...col, tasks: sourceTasks };
        if (col.id === destCol.id) return { ...col, tasks: destTasks };
        return col;
      }));

      await axios.put(`http://127.0.0.1:8000/tasks/${movedTask.id}`, { status: movedTask.status });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {columns.map((col) => (
          <KanbanColumn key={col.id} id={col.id} title={col.title} tasks={col.tasks} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;