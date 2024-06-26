import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import AddIcon from "../icons/AddIcon";
import Delete from "../icons/Delete";
import { Column, Id, Task } from "../types";
import TaskCard from "./TaskCard";

interface Props{
    column : Column;
    deleteColumn:(id:Id)=>void;
    updateColumnTitle:(id:Id,title:string)=>void;
    createTask:(columnId:Id)=>void;
    tasks: Task[];
    deleteTask:(id:Id)=>void;
    updateTask: (id:Id,description:string)=>void;
}

const Container = (props:Props) => {
    const {column,deleteColumn,updateColumnTitle,createTask,tasks,deleteTask,updateTask} = props;
    const [editTitle,setEditTitle] = useState(true);
    const taskIds = useMemo(()=>{
        return tasks.map((task)=>task.id)
    },[tasks])
    const {setNodeRef, attributes,listeners,transform,transition,isDragging} = useSortable({
        id:column.id,
        data:{
            type:"Column",
            column,
        },
        disabled:editTitle,
    });
    const style ={
        transition,
        transform:CSS.Transform.toString(transform)
    };
    if(isDragging){
        return (
            <div ref={setNodeRef} style={style} className="bg-slate-200 w-[250px] h-[400px] max-h-[400px] rounded-md flex flex-col border-4 border-blue-400">
            </div>
        )
    }
    return (
        <div ref={setNodeRef} style={style} className="bg-slate-200 w-[250px] h-[400px] max-h-[400px] rounded-md flex flex-col border-4 border-blue-400">
            <div {...attributes} {...listeners} onClick={()=>setEditTitle(true)} className="bg-slate-400 text-md h-[50px] cursor-grab rounded-b-none p-3 font-bold flex items-center justify-between">
                <div className="flex bg-slate-200 px-2 py-1 text-sm">{tasks.length}</div>
                {!editTitle && column.title}
                {editTitle && <input type="text" value={column.title} onChange={(e)=>updateColumnTitle(column.id,e.target.value)} className="w-[100px] border-rose-100 px-2" autoFocus onBlur={()=>setEditTitle(false)} onKeyDown={(e)=>{
                    if(e.key!=="Enter")return;
                    setEditTitle(false);
                }}></input>}
                <button className="rounded px-1 py-2 stroke-white hover:bg-gray-50 hover:opacity-100" onClick={()=>deleteColumn(column.id)}><Delete /></button>
            </div>
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={taskIds}>
                    {tasks.map((task)=>
                    <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>)}
                </SortableContext>
            </div>
            <div className="bg-slate-200 h-[40px] text-md cursor-grab rounded-md rounded-b-none border-1">
                <button className="flex ml-[55px] justify-center gap-2 border-4 m-2 p--4 items-center active:bg-gray-300"
                onClick={()=>{createTask(column.id)}}><AddIcon/>Add Task</button>
            </div>

        </div>
    )
}

export default Container