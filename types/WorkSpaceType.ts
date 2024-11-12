import { Timestamp } from "firebase/firestore";
import { UserDataType } from "./UserDataType";

export interface WorkSpaceType {
    id?: string,
    name: string,
    members: string[],
    requests: string[],
    owner: UserDataType,
    icon_unified: string,
    created_at?: Timestamp,
}
