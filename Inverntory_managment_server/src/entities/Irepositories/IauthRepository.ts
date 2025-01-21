import { IUser, IUserProfile } from "../../frameWork/type/userType";


interface iUserRepository {
    userAlreadyExist(email: string): Promise<boolean>;
    createUser(data: IUser): Promise<IUser>;
    validUser(email: string): Promise<IUser>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getId(id: string | undefined): Promise<any>;
    getIdAndUpdate(id: string | undefined, data: IUserProfile): Promise<IUser>;
}

export default iUserRepository;
