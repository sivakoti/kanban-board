import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import Delete from "../icons/Delete";
import { Id, Task } from "../types";


interface Props{
    task:Task;
    deleteTask:(id:Id)=>void;
    updateTask:(id:Id,description:string)=>void;
}
const TaskCard = ({task,deleteTask,updateTask}:Props) => {
    const [mouseIsOver,setMouseIsOver] = useState(false);
    const [editTask,setEditTask] = useState(false);
    const {setNodeRef, attributes,listeners,transform,transition,isDragging} = useSortable({
        id:task.id,
        data:{
            type:"Task",
            task,
        },
        disabled:editTask,
    });
    const style ={
        transition,
        transform:CSS.Transform.toString(transform)
    };
    if(isDragging){
        return(
            <div ref={setNodeRef} style={style} className="p-2 h-[100px] min-h-[100px] items-center flex text-left rounded-xl
        bg-slate-400 cursor-grab relative opacity-50 border-2 border-rose-500" />
        )
    }
    const toggleEditTask = () =>{
        setEditTask(editTask=>!editTask);
        setMouseIsOver(false);
    }
    if(editTask){
        return(
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-2 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-inset
        hover:ring-rose-500
        bg-slate-400 cursor-grabs relative task" >
            <textarea className="h-[90%] w-full resize-none border-none rounded text-black focus:outline-none"
            value={task.description} autoFocus placeholder="Enter task description"
            onBlur={toggleEditTask} 
            onKeyDown={(e)=>{
                if(e.key==="Enter" && e.shiftKey){ toggleEditTask()}
            }}
            onChange={(e)=>updateTask(task.id,e.target.value)}></textarea>
        </div> )
    }
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
        className="p-2 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-inset hover:ring-rose-500
        bg-slate-400 cursor-grab relative" 
        onMouseEnter={()=>{
            setMouseIsOver(true)
        }}
        onMouseLeave={()=>{
            setMouseIsOver(false)
        }}
        onClick={toggleEditTask}>
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"> {task.description} </p>
            {mouseIsOver && <button className="stroke-white absolute right-4 top-4 p-2 
            translate-y-2 rounded hover:bg-gray-50 hover:opacity-100"
            onClick={()=>deleteTask(task.id)}><Delete/></button>}
        </div>
    )
}

export default TaskCard
