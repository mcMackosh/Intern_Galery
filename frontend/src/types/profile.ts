export interface IProfile {
    id: string;
    firstname: string;
    lastname: string;
    email: string ;
    updatedAt: Date;
    createdAt: Date;
}

export interface UpdateProfile {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined
}