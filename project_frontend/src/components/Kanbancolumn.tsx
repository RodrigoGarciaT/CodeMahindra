import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard';

interface Task {
  id: number;
  title: string;
  taskType?: string;
  priority?: string;
  status?: string;
  estimatedTime?: number;
  affectedModule?: string;
  tag?: string;
  reward?: number;
  employee_id?: string;
  createdAt?: string;
  description?: string;
  sprint?: string;
  labels?: string;
  reporter?: string;
  assignee_name?: string;
  assignee_avatar?: string;
}

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanColumn: React.FC<ColumnProps> = ({ id, title, tasks }) => {
  return (
    <div style={{ margin: '0 8px', width: 320 }}>
      <h2 style={{ fontWeight: '600', textAlign: 'center', marginBottom: '8px' }}>
        {title}
      </h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              backgroundColor: '#f4f5f7',
              padding: '8px',
              minHeight: '200px',
              borderRadius: '4px',
            }}
          >
            {tasks.map((task, index) => (
              <KanbanCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;