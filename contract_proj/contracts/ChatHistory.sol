// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <=0.8.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
contract ChatHistory {
    //Emitted when update function is called
    //Smart contract events are a way for your contract to communicate that something happened on the blockchain to your app front-end, which can be 'listening' for certain events and take action when they happen.
    // event AddChat(string query, string message, address id, uint256 timeAdded);
    // event AddDocumentError(string ipfs_hash, string error);
    struct Chat {
        string reply;
        string query;
        uint256 timeAdded;
        // address public id;
    }
    // Chat[] public chats;
    mapping(string => Chat[]) public mapChat;

    constructor() {}

    function add_chat_history(string memory userid, string memory query, string memory reply) public {
        //add now
        uint256 timeAdded = block.timestamp;
        // Chat memory chatnow = Chat(reply, query, timeAdded);
        mapChat[userid].push(Chat(reply, query, timeAdded));
    }
    function getChatsCount(string memory userid) external view returns (uint256) {
        return mapChat[userid].length;
    }
    function getChat(string memory userid, uint256 _index) external view returns (string memory, string memory) {
        Chat storage chat = mapChat[userid][_index];
        return (chat.query, chat.reply);
    }
}