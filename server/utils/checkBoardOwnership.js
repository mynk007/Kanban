import Board from "../models/Board.js";

const checkBoardOwnership = async (boardId, userId) => {
    const board = await Board.findById(boardId);
    if (!board) return false;
    return board.user.toString() === userId.toString();
};

export default checkBoardOwnership;
export { checkBoardOwnership as isBoardOwner };
