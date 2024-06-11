import { DndContext, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import AddIcon from "../icons/AddIcon";
import { Column, Id } from "../types";
import Container from "./Container";

const KanbanBoard = () => {
    const [columns,setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(()=>columns.map((column)=>column.id),[columns]);
    const [activeColumn,setActiveColumn] = useState<Column | null>(null);
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
    const dragStart = (event:DragStartEvent) =>{
        if(event.active.data.current?.type === "Column"){
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }
    return (
        <div className="flex m-auto min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-40px">
            <DndContext onDragStart={dragStart}>
                <div className="flex m-auto">
                    <div className="flex gap-4 cursor-pointer">
                        <SortableContext items={columnsId}>
                        {columns.map((column) => (
                            <div className="w-300px h-300px bg-slate-200 p-4 ring-rose-400" key={column.id}>
                                <Container column={column} deleteColumn={deleteColumn} />
                            </div> ))}
                        </SortableContext>
                    </div>
                    <button className="btn btn-primary w-300px h-30px min-w-300px cursor-pointer rounded-lg
                    bg-slate-200 border-2 border-slate-400 p-4 ring-rose-400 hover:ring-2 flex gap-2 " onClick={() => {createNewColumn()}}><AddIcon /> Add Column</button>
                </div>
                {createPortal(<DragOverlay>
                    {activeColumn && <Container column={activeColumn} deleteColumn={deleteColumn} />}
                </DragOverlay>,document.body)}
            </DndContext>
        </div>
    )
}

export default KanbanBoard


