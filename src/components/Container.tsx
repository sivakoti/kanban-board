import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Delete from "../icons/Delete";
import { Column, Id } from "../types";

interface Props{
    column : Column;
    deleteColumn:(id:Id)=>void;
}

const Container = (props:Props) => {
    const {column,deleteColumn} = props;
    const {setNodeRef, attributes,listeners,transform,transition} = useSortable({
        id:column.id,
        data:{
            type:"Column",
            column,
        },
    });
    const style ={
        transition,
        transform:CSS.Transform.toString(transform)
    };
    return (
        <div ref={setNodeRef} style={style} className="bg-slate-200 w-[250px] h-[400px] max-h-[400px] rounded-md flex flex-col border-4 border-blue-400">
            <div {...attributes} {...listeners} className="bg-slate-400 text-md h-[50px] cursor-grab rounded-b-none p-3 font-bold flex items-center justify-between">
                <div className="flex bg-slate-200 px-2 py-1 text-sm">0</div>
                {column.title}
                <button className="rounded px-1 py-2 hover:stroke-white hover:bg-slate-600" onClick={()=>deleteColumn(column.id)}><Delete /></button>
            </div>
            <div className="flex flex-grow">
                content
            </div>
            <div className="bg-slate-200 h-60px text-md cursor-grab rounded-md rounded-b-none border-1">
                Footer
            </div>

        </div>
    )
}

export default Container