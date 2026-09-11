import { useState, useEffect, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

interface Board {
    _id: string;
    title: string;
}

interface List {
    _id: string;
    title: string;
    position: number;
}

interface Card {
    _id: string;
    title: string;
    list: string;
    position: number;
}

export default function BoardDetail() {
    const { boardId } = useParams<{ boardId: string }>();

    const [board, setBoard] = useState<Board | null>(null);
    const [lists, setLists] = useState<List[]>([]);
    const [cardsByList, setCardsByList] = useState<Record<string, Card[]>>({});
    const [loading, setLoading] = useState(true);
    const [newListTitle, setNewListTitle] = useState('');
    const [newCardTitles, setNewCardTitles] = useState<Record<string, string>>({});
    const [editingListId, setEditingListId] = useState<string | null>(null);
    const [editListTitle, setEditListTitle] = useState('');
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [editCardTitle, setEditCardTitle] = useState('');


    const loadBoard = async () => {
        setLoading(true);
        const [boardRes, listsRes] = await Promise.all([
            api.get(`/boards/${boardId}`),
            api.get(`/lists?board=${boardId}`),
        ]);

        setBoard(boardRes.data);
        setLists(listsRes.data);

        const cardResults = await Promise.all(
            listsRes.data.map((list: List) => api.get(`/cards?list=${list._id}`))
        );

        const cardsMap: Record<string, Card[]> = {};
        listsRes.data.forEach((list: List, index: number) => {
            cardsMap[list._id] = cardResults[index].data;
        });
        setCardsByList(cardsMap);

        setLoading(false);
    };

    useEffect(() => {
        loadBoard();
    }, [boardId]);

    const saveListEdit = async (listId: string) => {
        if (!editListTitle.trim()) return;
        const res = await api.put(`/lists/${listId}`, { title: editListTitle });
        setLists((prev) => prev.map((l) => (l._id === listId ? res.data : l)));
        setEditingListId(null);
    };

    const deleteList = async (listId: string) => {
        if (!window.confirm('Delete this list and all its cards?')) return;
        await api.delete(`/lists/${listId}`);
        setLists((prev) => prev.filter((l) => l._id !== listId));
    };

    const saveCardEdit = async (listId: string, cardId: string) => {
        if (!editCardTitle.trim()) return;
        const res = await api.put(`/cards/${cardId}`, { title: editCardTitle });
        setCardsByList((prev) => ({
            ...prev,
            [listId]: prev[listId].map((c) => (c._id === cardId ? res.data : c)),
        }));
        setEditingCardId(null);
    };

    const deleteCard = async (listId: string, cardId: string) => {
        if (!window.confirm('Delete this card?')) return;
        await api.delete(`/cards/${cardId}`);
        setCardsByList((prev) => ({
            ...prev,
            [listId]: prev[listId].filter((c) => c._id !== cardId),
        }));
    };


    const handleCreateList = async (e: FormEvent) => {
        e.preventDefault();
        if (!newListTitle.trim()) return;

        const res = await api.post('/lists', {
            title: newListTitle,
            board: boardId,
            position: lists.length,
        });

        setLists((prev) => [...prev, res.data]);
        setCardsByList((prev) => ({ ...prev, [res.data._id]: [] }));
        setNewListTitle('');
    };

    const handleCreateCard = async (listId: string, e: FormEvent) => {
        e.preventDefault();
        const title = newCardTitles[listId]?.trim();
        if (!title) return;

        const res = await api.post('/cards', {
            title,
            list: listId,
            position: cardsByList[listId]?.length ?? 0,
        });

        setCardsByList((prev) => ({
            ...prev,
            [listId]: [...(prev[listId] ?? []), res.data],
        }));
        setNewCardTitles((prev) => ({ ...prev, [listId]: '' }));
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading board...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4">
                <Link to="/boards" className="text-indigo-600 text-sm font-medium">
                    ← Boards
                </Link>
                <h1 className="text-xl font-bold text-gray-900">{board?.title}</h1>
            </div>

            <div className="p-8 flex gap-4 overflow-x-auto items-start">
                {lists.map((list) => (
                    <div key={list._id} className="bg-gray-200 rounded-lg p-3 w-72 flex-shrink-0">
                        {editingListId === list._id ? (
                            <div className="flex gap-1 mb-3">
                                <input
                                    type="text"
                                    value={editListTitle}
                                    onChange={(e) => setEditListTitle(e.target.value)}
                                    autoFocus
                                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <button onClick={() => saveListEdit(list._id)} className="text-xs text-indigo-600 font-medium">
                                    Save
                                </button>
                                <button onClick={() => setEditingListId(null)} className="text-xs text-gray-500">
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold text-sm">{list.title}</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingListId(list._id);
                                            setEditListTitle(list.title);
                                        }}
                                        className="text-gray-400 hover:text-indigo-600 text-xs"
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => deleteList(list._id)} className="text-gray-400 hover:text-red-600 text-xs">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 mb-3">
                            {(cardsByList[list._id] ?? []).map((card) =>
                                editingCardId === card._id ? (
                                    <div key={card._id} className="flex gap-1">
                                        <input
                                            type="text"
                                            value={editCardTitle}
                                            onChange={(e) => setEditCardTitle(e.target.value)}
                                            autoFocus
                                            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                        <button onClick={() => saveCardEdit(list._id, card._id)} className="text-xs text-indigo-600 font-medium">
                                            Save
                                        </button>
                                        <button onClick={() => setEditingCardId(null)} className="text-xs text-gray-500">
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        key={card._id}
                                        className="bg-white rounded-md p-3 shadow-sm text-sm flex items-center justify-between group"
                                    >
                                        <span>{card.title}</span>
                                        <div className="hidden group-hover:flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingCardId(card._id);
                                                    setEditCardTitle(card.title);
                                                }}
                                                className="text-gray-400 hover:text-indigo-600 text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => deleteCard(list._id, card._id)} className="text-gray-400 hover:text-red-600 text-xs">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}

                        </div>

                        <form onSubmit={(e) => handleCreateCard(list._id, e)} className="flex gap-1">
                            <input
                                type="text"
                                value={newCardTitles[list._id] ?? ''}
                                onChange={(e) =>
                                    setNewCardTitles((prev) => ({ ...prev, [list._id]: e.target.value }))
                                }
                                placeholder="Add a card"
                                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button type="submit" className="text-sm text-indigo-600 font-medium px-2">
                                Add
                            </button>
                        </form>
                    </div>
                ))}

                <form
                    onSubmit={handleCreateList}
                    className="w-72 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg p-3"
                >
                    <input
                        type="text"
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        placeholder="+ Add another list"
                        className="w-full text-sm bg-transparent focus:outline-none"
                    />
                </form>
            </div>
        </div>
    );
}
