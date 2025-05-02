import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface Task {
  id: number; // ✅ corregido a number
  title: string;
  taskType?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
  estimatedTime?: number;
  tag?: string;
  sprint?: string;
  reporter?: string;
  labels?: string;
}

interface KanbanCardProps {
  task: Task;
  index: number;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            backgroundColor: '#fff',
            margin: '0 0 8px 0',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: '14px',
            ...provided.draggableProps.style,
          }}
        >
          <strong>{task.title}</strong>
          <div><b>Tipo:</b> {task.taskType || 'N/A'}</div>
          <div><b>Prioridad:</b> {task.priority || 'N/A'}</div>
          <div><b>Estado:</b> {task.status || 'N/A'}</div>
          <div><b>Estimado:</b> {task.estimatedTime ? `${task.estimatedTime}h` : 'N/A'}</div>
          <div><b>Tag:</b> {task.tag || '—'}</div>
          {task.sprint && <div><b>Sprint:</b> {task.sprint}</div>}
          {task.reporter && <div><b>Reportado por:</b> {task.reporter}</div>}
          {task.labels && <div><b>Etiquetas:</b> {task.labels}</div>}
          <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
            {task.createdAt ? new Date(task.createdAt).toLocaleString() : ''}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;