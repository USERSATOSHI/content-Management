import exp from "constants";

export interface User {
    username: string;
    email: string;
    password: string;
}

export interface Author extends User {
    teams: Team[];
    projects: Project[];
}

export interface Team {
    name: string;
    members: User[];
}

export interface Project {
    name: string;
    description: string;
    tasks: Task[];
    team: Team;
    id: string;
}

export interface Task {
    name: string;
    description: string;
    comments: Comment[];
    due: Date;
    assignedTo: User;
}

export interface Comment {
    content: string;
    user: User;
    date: Date;
}

export interface DBUser {
    username: string;
    password: string;
    teams: string[];
    projects: string[];
}

export interface DBTeam {
    name: string;
    members: string[];
}

export interface DBProject {
    name: string;
    description: string;
    tasks: DBTask[];
    team: string;
}

export interface DBTask {
    name: string;
    description: string;
    comments: string[];
    due: Date;
    assignedTo: string;
}

export interface DBComment {
    content: string;
    user: string;
    date: Date;
}

