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
                        <h2 className="font-semibold text-sm mb-3">{list.title}</h2>

                        <div className="flex flex-col gap-2 mb-3">
                            {(cardsByList[list._id] ?? []).map((card) => (
                                <div key={card._id} className="bg-white rounded-md p-3 shadow-sm text-sm">
                                    {card.title}
                                </div>
                            ))}
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
