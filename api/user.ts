import {
    FireStoreCollectionFields,
    FireStoreCollections,
} from "@/constants/FirebaseConstants";
import { db } from "@/lib/firebase/firebase";
import { UserDataType } from "@/types/UserDataType";
import { WorkSpaceType } from "@/types/WorkSpaceType";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { getWorkSpacesMember, getWorkSpacesOwner } from "./workSpace";

export const addUserData = async (
    uid: string,
    email: string,
    name: string,
    imageUri: string,
): Promise<void> => {
    const docRef = doc(db, FireStoreCollections.USER_DATA, uid);
    const docData = await getDoc(docRef);
    if (docData.exists()) {
        return;
    }
    const workSpacesOwner = await getWorkSpacesOwner(uid);
    const workSpacesMember = await getWorkSpacesMember(uid);
    return setDoc(doc(db, FireStoreCollections.USER_DATA, uid), {
        workSpaceOwnerOrder: workSpacesOwner.map((workSpace) => workSpace.id),
        workSpaceMemberOrder: workSpacesMember.map((workSpace) => workSpace.id),
        workSpaceRequest: [],
        email: email,
        name: name,
        imageUri: imageUri,
    });
};

export const setUserData = async (
    uid: string,
    workSpaceOwnerOrder?: string[],
    workSpaceMemberOrder?: string[],
    workSpaceRequest?: WorkSpaceType[],
): Promise<void> => {
    const docRef = doc(db, FireStoreCollections.USER_DATA, uid);
    const newUserData: Partial<UserDataType> = {};
    if (workSpaceOwnerOrder) {
        newUserData.workSpaceOwnerOrder = workSpaceOwnerOrder;
    }
    if (workSpaceMemberOrder) {
        newUserData.workSpaceMemberOrder = workSpaceMemberOrder;
    }
    if (workSpaceRequest) {
        newUserData.workSpaceRequest = workSpaceRequest;
    }
    return updateDoc(docRef, newUserData);
};

export const getUserData = async (uid: string): Promise<UserDataType> => {
    const docRef = doc(db, FireStoreCollections.USER_DATA, uid);
    const docData = await getDoc(docRef);
    if (!docData.exists()) {
        throw new Error("No such document!");
    }
    const userData = docData.data() as UserDataType;
    userData.id = docData.ref.id;
    if (!userData.workSpaceOwnerOrder) {
        const workSpacesOwner = await getWorkSpacesOwner(uid);
        setUserData(
            uid,
            workSpacesOwner
                .map((workSpace) => workSpace.id)
                .filter((id): id is string => id !== undefined),
        );
    }
    if (!userData.workSpaceMemberOrder) {
        const workSpacesMember = await getWorkSpacesMember(uid);
        setUserData(
            uid,
            undefined,
            workSpacesMember
                .map((workSpace) => workSpace.id)
                .filter((id): id is string => id !== undefined),
        );
    }
    return userData;
};

export const getAllUserData = async (
    email: string,
): Promise<UserDataType[]> => {
    const q = query(
        collection(db, FireStoreCollections.USER_DATA),
        where(FireStoreCollectionFields.USER_DATA.EMAIL, "==", email),
        where(FireStoreCollectionFields.USER_DATA.EMAIL, ">=", email),
        where(
            FireStoreCollectionFields.USER_DATA.EMAIL,
            "<=",
            email + "\uf8ff",
        ),
    );
    const querySnapshot = await getDocs(q);
    const userDatas: UserDataType[] = [];
    querySnapshot.forEach((doc) => {
        userDatas.push({
            email: doc.data().email,
            imageUri: doc.data().imageUri,
            name: doc.data().name,
            id: doc.id,
        });
    });
    return userDatas;
};

export const onSnapshotUserDataWorkSpaceRequest = (
    callback: () => void,
    uid: string,
) => {
    return onSnapshot(doc(db, FireStoreCollections.USER_DATA, uid), () => {
        callback();
    });
};
