import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import AddIcon from "../icons/AddIcon";
import { Column, Id, Task } from "../types";
import Container from "./Container";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {
    const [columns,setColumns] = useState<Column[]>([]);
    const [tasks,setTasks] = useState<Task[]>([]);
    const columnsId = useMemo(()=>columns.map((column)=>column.id),[columns]);
    const [activeColumn,setActiveColumn] = useState<Column | null>(null);
    const [activeTask,setActiveTask] = useState<Task | null>(null);
    const sensors= useSensors(useSensor(PointerSensor,{
        activationConstraint:{
            distance:1
        }
    }))
    console.log(columns)
    const createNewColumn = () => {
        const newColumn : Column = {
            id: Math.floor(Math.random() * 100000),
            title:`column ${columns.length+1}`,
        }
        setColumns([...columns,newColumn])
    }
    const deleteColumn = (id:Id) =>{
        const filteredColumns = columns.filter((column)=>column.id!==id);
        setColumns(filteredColumns);
        const filteredTasks = tasks.filter((task)=>task.columnId!==id);
        setTasks(filteredTasks)
    }
    const createTask = (columnId:Id) =>{
        const newTask:Task ={
            id:Math.floor(Math.random() * 100000),
            columnId,
            description:`Task ${tasks.length+1}`,
        }
        setTasks([...tasks,newTask])
    }
    const updateTask = (id:Id,description:string)=>{
        const updatedTask = tasks.map((task)=>{
            if(task.id!==id) return task;
            return {...task,description}
        });
        setTasks(updatedTask);
    }
    const deleteTask = (id:Id)=>{
        const filteredTasks = tasks.filter((task)=>task.id!==id)
        setTasks(filteredTasks);
    }
    const updateColumnTitle = (id:Id,title:string) =>{
            const updatedColumnTitle= columns.map((column)=>{
                if(column.id!==id) return column;
                return{...column,title};
            })
            setColumns(updatedColumnTitle);
    }
    const dragStart = (event:DragStartEvent) =>{
        if(event.active.data.current?.type === "Column"){
            setActiveColumn(event.active.data.current.column);
            return;
        }
        if(event.active.data.current?.type === "Task"){
            setActiveTask(event.active.data.current.task);
            return;
        }
    }
    const dragOver = (event:DragOverEvent) =>{
        const {active,over} = event;
        if(!over) return;
        const activeId= active.id;
        const overId= over.id;
        if(activeId === overId) return;
        const isActiveTask = active.data.current?.type==="Task";
        const isOverTask = over.data.current?.type==="Task";
        if(!isActiveTask) return;
        if(isActiveTask && isOverTask){
            setTasks((tasks)=>{
                const activeIndex = tasks.findIndex((task)=>task.id===activeId);
                const overIndex =tasks.findIndex((task)=>task.id===overId);
                if(tasks[activeIndex].columnId !== tasks[overIndex].columnId){
                    tasks[activeIndex].columnId = tasks[overIndex].columnId
                }
                return arrayMove(tasks,activeIndex,overIndex);
            })
        }
        const isOverColumn = over.data.current?.type==="Column";
        if(isActiveTask && isOverColumn){
            setTasks((tasks)=>{
                const activeIndex = tasks.findIndex((task)=>task.id===activeId);
                    tasks[activeIndex].columnId = overId;
                return arrayMove(tasks,activeIndex,activeIndex);
            })
        }
    }
    const dragEnd = (event:DragEndEvent) =>{
        setActiveColumn(null)
        setActiveTask(null)
        const {active,over} = event;
        if(!over) return;
        const activeColumnId= active.id;
        const overColumnId= over.id;
        if(activeColumnId === overColumnId) return;
            setColumns((columns)=>{
                const activeColumnIndex = columns.findIndex((column)=>column.id===activeColumnId)
                const overColumnIndex = columns.findIndex((column)=>column.id===overColumnId)
                return arrayMove(columns,activeColumnIndex,overColumnIndex)
            })
    }
    return (
        <div className="flex m-auto min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-40px">
            <DndContext sensors={sensors} onDragStart={dragStart} onDragEnd={dragEnd} onDragOver={dragOver}>
                <div className="flex m-auto">
                    <div className="flex gap-4 cursor-pointer">
                        <SortableContext items={columnsId}>
                        {columns.map((column) => (
                            <div className="w-300px h-300px bg-slate-200 p-4 ring-rose-400" key={column.id}>
                                <Container column={column} deleteColumn={deleteColumn} updateColumnTitle={updateColumnTitle}
                                createTask={createTask} tasks={tasks.filter((task)=>task.columnId===column.id)} deleteTask={deleteTask}
                                updateTask={updateTask} />
                            </div> ))}
                        </SortableContext>
                    </div>
                    <button className=" w-300px h-30px min-w-300px cursor-pointer rounded-lg
                    bg-slate-200 p-2 flex gap-2 " onClick={() => {createNewColumn()}}><AddIcon /> Add Column</button>
                </div>
                {createPortal(<DragOverlay>
                    {activeColumn && <Container column={activeColumn} deleteColumn={deleteColumn} updateColumnTitle={updateColumnTitle} 
                    createTask={createTask} tasks={tasks.filter((task)=>task.columnId===activeColumn.id)} 
                    deleteTask={deleteTask} updateTask={updateTask} />}
                    {activeTask && <TaskCard task={activeTask} updateTask={updateTask} deleteTask={deleteTask}/>}
                </DragOverlay>,document.body)}
            </DndContext>
        </div>
    )
}

export default KanbanBoard


