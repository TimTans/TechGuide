import { useState } from "react";



export default function CourseEditingModal({ isOpen, onClose, courseToEdit, onSubmit }){
    if(!isOpen) return null

    const [newName, setNewName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newName);
    }

     return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black opacity-40 backdrop-blur-sm"
                onClick={()=>{
                    onClose()
                }}
            ></div>

            {/* Modal */}
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full h-40 relative z-10 p-4"
                onClick={(e) => {
                    e.stopPropagation()

                }}
            >   
                <span>
                    Old Name: {courseToEdit.title}
                </span>

                <form onSubmit={handleSubmit} className="mt-5">
                    <div>
                        <label htmlFor="newName" className="block text-sm font-semibold text-gray-700 mb-2">
                            Enter new name for category
                        </label>
                        <input
                            type='text'
                            id="newName"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter name"
                            className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
                            required
                            autoFocus
                        />
                    </div>

                </form>
            
            </div>
        </div>
     )

}