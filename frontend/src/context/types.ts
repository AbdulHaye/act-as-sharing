export interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: 'Admin' | 'Host' | 'Guest';
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: { firstname: string; lastname: string; email: string; password: string; role: string }) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
  }