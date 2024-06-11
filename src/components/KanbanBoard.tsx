import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import AddIcon from "../icons/AddIcon";
import { Column, Id } from "../types";
import Container from "./Container";

const KanbanBoard = () => {
    const [columns,setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(()=>columns.map((column)=>column.id),[columns]);
    const [activeColumn,setActiveColumn] = useState<Column | null>(null);
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
    }
    const dragEnd = (event:DragEndEvent) =>{
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
            <DndContext sensors={sensors} onDragStart={dragStart} onDragEnd={dragEnd}>
                <div className="flex m-auto">
                    <div className="flex gap-4 cursor-pointer">
                        <SortableContext items={columnsId}>
                        {columns.map((column) => (
                            <div className="w-300px h-300px bg-slate-200 p-4 ring-rose-400" key={column.id}>
                                <Container column={column} deleteColumn={deleteColumn} updateColumnTitle={updateColumnTitle} />
                            </div> ))}
                        </SortableContext>
                    </div>
                    <button className="btn btn-primary w-300px h-30px min-w-300px cursor-pointer rounded-lg
                    bg-slate-200 border-2 border-slate-400 p-4 ring-rose-400 hover:ring-2 flex gap-2 " onClick={() => {createNewColumn()}}><AddIcon /> Add Column</button>
                </div>
                {createPortal(<DragOverlay>
                    {activeColumn && <Container column={activeColumn} deleteColumn={deleteColumn} updateColumnTitle={updateColumnTitle} />}
                </DragOverlay>,document.body)}
            </DndContext>
        </div>
    )
}

export default KanbanBoard


