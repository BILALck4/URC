import {CustomError} from "./CustomError";

export const AUTHENT_HEADER = "Authorization";
export const BEARER = "Bearer ";

export interface User {
    user_id: number;
    username: string;
    email?: string;
    password: string;
    last_login?: string;
    external_id?: string;
}

export interface Room {
    room_id: number;
    name: string;
    created_on: string;
  }


export interface Session {
    user_id: string;
    token: string;
    username?: string;
    id?: number;
    externalId: string;
}

  
export interface UsersState {
    users: User[];
    rooms: Room[];
    selectedUser: User | null;
    selectedRoom: Room | null; 
    selectedUserRomm: boolean | null// Add this line
  }
  

  export interface Message {
    created_at: string | number | Date;
    message_id: number;
    sender_id: number;
    sender_name: string;
    receiver_id: number;
    receiver_type: string;
    content: string;
    created_at: string;
  }

  export interface MessagesState {
    selectedUser: User | null;
    selectedRoom: null,  // Add selectedRoom here
    messages: Message[];
  }
  
  export const initialState: MessagesState = {
    selectedUser: null,
    selectedRoom: null,  // Add selectedRoom here
    messages: [],
  };



export interface EmptyCallback {
    (): void;
}

export interface SessionCallback {
    (session: Session): void;
}


export interface ErrorCallback {
    (error: CustomError): void;
}

