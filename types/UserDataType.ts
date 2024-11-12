import { WorkSpaceType } from "./WorkSpaceType";

export interface UserDataType {
    id?: string;
    email: string;
    name: string;
    imageUri: string;
    workSpaceOwnerOrder?: string[];
    workSpaceMemberOrder?: string[];
    workSpaceRequest?: WorkSpaceType[]
}