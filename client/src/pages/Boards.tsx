import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Board {
    _id: string;
    title: string;
    createdAt: string;
}

export default function Boards() {
    const [boards, setBoards] = useState<Board[]>([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const { user, logout } = useAuth();

    const fetchBoards = async () => {
        try {
            const res = await api.get('/boards');
            setBoards(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load boards');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);
    const startEdit = (board: Board) => {
        setEditingId(board._id);
        setEditTitle(board.title);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
    };


    const saveEdit = async (id: string) => {
        if (!editTitle.trim()) return;
        try {
            const res = await api.put(`/boards/${id}`, { title: editTitle });
            setBoards((prev) => prev.map((b) => (b._id === id ? res.data : b)));
            cancelEdit();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update board');
        }
    };
    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this board? This cannot be undone.')) return;
        try {
            await api.delete(`/boards/${id}`);
            setBoards((prev) => prev.filter((b) => b._id !== id));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete board');
        }
    };
    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const res = await api.post('/boards', { title });
            setBoards((prev) => [res.data, ...prev]);
            setTitle('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create board');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">My Boards</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user?.name}</span>
                    <button onClick={logout} className="text-sm text-indigo-600 font-medium">
                        Log out
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-8">
                <form onSubmit={handleCreate} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="New board title"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Create
                    </button>
                </form>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                {loading ? (
                    <p className="text-gray-500">Loading boards...</p>
                ) : boards.length === 0 ? (
                    <p className="text-gray-500">No boards yet — create your first one above.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {boards.map((board) => (
                            <div key={board._id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow">
                                {editingId === board._id ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            autoFocus
                                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                        <button onClick={() => saveEdit(board._id)} className="text-sm text-indigo-600 font-medium">
                                            Save
                                        </button>
                                        <button onClick={cancelEdit} className="text-sm text-gray-500">
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <Link to={`/boards/${board._id}`} className="font-semibold text-gray-900 hover:text-indigo-600">
                                            {board.title}
                                        </Link>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    startEdit(board);
                                                }}
                                                className="text-gray-400 hover:text-indigo-600 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDelete(board._id);
                                                }}
                                                className="text-gray-400 hover:text-red-600 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
}
