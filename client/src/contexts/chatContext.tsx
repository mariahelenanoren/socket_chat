import { Component, createContext } from 'react';
import { socket } from '../socket';
interface Errors {
    wrongPassword: string;
    noPassword: string;
    roomNameAlreadyInUse: string;
    noUsername: string;
    noRoomName: string;
    noMessage: string;
}
export interface Message {
    userName: string;
    message: string;
}
export interface Room {
    name: string;
    hasPassword?: boolean;
    users?: string[];
}
interface State {
    userName: string;
    currentRoom: string;
    allRooms: Room[];
    messages: Message[];
    errors: Errors;
}

const defaultState = {
    userName: '',
    currentRoom: '',
    allRooms: [],
    messages: [],
    errors: {
        wrongPassword: '',
        noPassword: '',
        roomNameAlreadyInUse: '',
        noUsername: '',
        noRoomName: '',
        noMessage: '',
    },
};

interface Context extends State {
    handleJoinRoom: (room: Room, password?: string) => void;
    handleSetUsername: (username: string) => void;
    handleCreateRoom: (
        room: Room,
        password?: string,
        userName?: string
    ) => void;
    handleLogout: () => void;
    handleSendMessage: (message: string) => void;
}

export const ChatContext = createContext<Context>({
    userName: '',
    currentRoom: '',
    allRooms: [],
    messages: [],
    errors: {
        wrongPassword: '',
        noPassword: '',
        roomNameAlreadyInUse: '',
        noUsername: '',
        noRoomName: '',
        noMessage: '',
    },
    handleJoinRoom: () => {},
    handleSetUsername: () => {},
    handleCreateRoom: () => {},
    handleLogout: () => {},
    handleSendMessage: () => {},
});

class ChatProvider extends Component<{}, State> {
    state: State = defaultState;

    incomingJoinRoom = (room: Room) => {
        this.setState((prevState) => ({
            ...prevState,
            currentRoom: room.name,
            messages: [],
        }));
    };

    incomingConnectionEstablished = () => {
        console.log('Connection established');
    };

    incomingMessage = (message: Message) => {
        console.log('incoming message:', message);
        this.setState((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, message],
        }));
    };

    incomingRooms = (rooms: Room[]) => {
        console.log('incoming rooms:', rooms);
        this.setState((prevState) => ({
            ...prevState,
            allRooms: rooms,
        }));
    };

    incomingCreateRoom = (room: Room) => {
        console.log('new room has been created');
        this.setState((prevState) => ({
            ...prevState,
            currentRoom: room.name,
            messages: [],
        }));
        return true;
    };

    incomingJoinSuccess = () => {
        console.log('You have joined a new room');
        // Current user has successfully joined a new room
    };

    incomingUserInRoom = (message: string) => {
        console.log(message);
        // Another user has joined the room
    };

    incomingError = (error: string) => {
        this.setState((prevState) => ({
            ...prevState,
            errors: { ...prevState.errors, [error]: error },
        }));
    };

    incomingNoError = (noError: string) => {
        this.setState((prevState) => ({
            ...prevState,
            errors: { ...prevState.errors, [noError]: '' },
        }));
    };

    incomingDisconnect = (reason: any) => {
        console.log(reason);
        this.setState(defaultState);
    };

    incomingRegisterUser = (userName: string) => {
        console.log('Your username is', userName);
        this.setState((prevState) => ({
            ...prevState,
            userName: userName,
        }));
    };

    componentDidMount() {
        socket.on('connect', this.incomingConnectionEstablished);
        socket.on('register-user', this.incomingRegisterUser);
        socket.on('join-room', this.incomingJoinRoom);
        socket.on('send-message', this.incomingMessage);
        socket.on('all-rooms', this.incomingRooms);
        socket.on('new-user-in-room', this.incomingUserInRoom);
        socket.on('create-room', this.incomingCreateRoom);
        socket.on('disconnect', this.incomingDisconnect);
        socket.on('join-success', this.incomingJoinSuccess);
        socket.on('no-error', this.incomingNoError);
        socket.on('error', this.incomingError);
    }

    handleJoinRoom = async (room: Room, password?: string) => {
        const { currentRoom } = this.state;
        // Adds user to new room
        socket.emit('join-room', {
            room: room,
            currentRoom: currentRoom,
            password: password,
        });
    };

    handleCreateRoom = async (room: Room, password?: string) => {
        const { currentRoom } = this.state;
        // Creates and adds user to new room
        socket.emit('create-room', {
            room: room,
            currentRoom: currentRoom,
            password: password,
        });
    };

    handleLogout = () => {
        const { currentRoom } = this.state;
        socket.emit('logout', { currentRoom: currentRoom });
        // Resets state
        this.setState(defaultState);
    };

    handleSendMessage = (message: string) => {
        const { userName, currentRoom } = this.state;

        // Sends message
        socket.emit('send-message', {
            userName: userName,
            message: message,
            room: currentRoom,
        });
    };

    handleSetUsername = (username: string) => {
        socket.emit('register-user', username);
    };

    render() {
        return (
            <ChatContext.Provider
                value={{
                    userName: this.state.userName,
                    currentRoom: this.state.currentRoom,
                    allRooms: this.state.allRooms,
                    messages: this.state.messages,
                    errors: this.state.errors,
                    handleJoinRoom: this.handleJoinRoom,
                    handleSetUsername: this.handleSetUsername,
                    handleCreateRoom: this.handleCreateRoom,
                    handleSendMessage: this.handleSendMessage,
                    handleLogout: this.handleLogout,
                }}
            >
                {this.props.children}
            </ChatContext.Provider>
        );
    }
}

export default ChatProvider;
