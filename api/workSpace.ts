import {
    FireStoreCollectionFields,
    FireStoreCollections,
} from "@/constants/FirebaseConstants";
import { db } from "@/lib/firebase/firebase";
import { WorkSpaceType } from "@/types/WorkSpaceType";
import {
    addDoc,
    arrayRemove,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { getUserData, setUserData } from "./user";

export const getWorkSpacesOwner = async (
    uid: string,
): Promise<WorkSpaceType[]> => {
    const q = query(
        collection(db, FireStoreCollections.WORKSPACES),
        where(
            `${FireStoreCollectionFields.WORKSPACES.OWNER}.${FireStoreCollectionFields.USER_DATA.ID}`,
            "==",
            uid,
        ),
    );
    const querySnapshot = await getDocs(q);
    const workSpaces: WorkSpaceType[] = [];
    querySnapshot.forEach((doc) => {
        workSpaces.push({
            id: doc.id,
            name: doc.data().name,
            owner: doc.data().owner,
            members: doc.data().members,
            icon_unified: doc.data().icon_unified,
            requests: doc.data().requests,
            created_at: doc.data().created_at,
        });
    });
    return workSpaces;
};

export const getWorkSpacesMember = async (
    uid: string,
): Promise<WorkSpaceType[]> => {
    const q = query(
        collection(db, FireStoreCollections.WORKSPACES),
        where(
            FireStoreCollectionFields.WORKSPACES.MEMBERS,
            "array-contains",
            uid,
        ),
    );
    const querySnapshot = await getDocs(q);
    const workSpaces: WorkSpaceType[] = [];
    querySnapshot.forEach((doc) => {
        workSpaces.push({
            id: doc.id,
            name: doc.data().name,
            owner: doc.data().owner,
            members: doc.data().members,
            icon_unified: doc.data().icon_unified,
            requests: doc.data().requests,
            created_at: doc.data().created_at,
        });
    });
    return workSpaces;
};

export const addWorkSpace = async (
    workSpace: WorkSpaceType,
    uid: string,
): Promise<string> => {
    const workSpaceRef = collection(db, FireStoreCollections.WORKSPACES);
    const docRef = await addDoc(workSpaceRef, workSpace);
    workSpace.id = docRef.id;

    const userData = await getUserData(uid);
    if (!userData) {
        throw new Error("User not found");
    }
    if (!userData?.workSpaceOwnerOrder) {
        userData.workSpaceOwnerOrder = [];
    }
    userData.workSpaceOwnerOrder.push(docRef.id);
    await setUserData(uid, userData.workSpaceOwnerOrder);

    workSpace.requests.forEach(async (request) => {
        const requestUserData = await getUserData(request);
        if (!requestUserData) {
            throw new Error("User not found");
        }
        if (!requestUserData?.workSpaceRequest) {
            requestUserData.workSpaceRequest = [];
        }
        requestUserData.workSpaceRequest.push(workSpace);
        await setUserData(
            request,
            undefined,
            undefined,
            requestUserData.workSpaceRequest,
        );
    });
    return docRef.id;
};

export const onSnapshotWorkSpacesMember = (
    callback: () => void,
    uid: string,
) => {
    const q = query(
        collection(db, FireStoreCollections.WORKSPACES),
        where(
            FireStoreCollectionFields.WORKSPACES.MEMBERS,
            "array-contains",
            uid,
        ),
    );
    return onSnapshot(q, () => {
        callback();
    });
};

export const onSnapshotWorkSpacesOwner = (
    callback: () => void,
    uid: string,
) => {
    const q = query(
        collection(db, FireStoreCollections.WORKSPACES),
        where(`${FireStoreCollectionFields.WORKSPACES.OWNER}.${FireStoreCollectionFields.WORKSPACES.ID}`, "==", uid),
    );
    return onSnapshot(q, () => {
        callback();
    });
};

export const onSnapshotWorkSpace = (callback: () => void, workspaceId: string) => {
    const workspaceRef = doc(db, FireStoreCollections.WORKSPACES, workspaceId);
    return onSnapshot(workspaceRef, () => {
        callback();
    });
}

export const editWorkSpace = async (
    uid: string,
    workspaceId: string,
    workspaceName?: string,
    workSpaceTcon_unified?: string,
    members?: string[],
) => {
    const workspaceRef = doc(db, FireStoreCollections.WORKSPACES, workspaceId);
    const docSnap = await getDoc(workspaceRef);
    if (!docSnap.exists()) {
        throw new Error("Workspace not found");
    }
    if (docSnap.data().owner.id !== uid) {
        throw new Error("You are not the owner of this workspace");
    }

    const editedWorkspace: Partial<WorkSpaceType> = {};
    if (workspaceName) {
        editedWorkspace.name = workspaceName;
    }
    if (workSpaceTcon_unified) {
        editedWorkspace.icon_unified = workSpaceTcon_unified;
    }
    if (members) {
        editedWorkspace.members = members;
    }
    return updateDoc(workspaceRef, editedWorkspace);
};

export const addRequestWorkSpace = async (
    uid: string,
    workspaceId: string,
) => {
    const workspaceRef = doc(db, FireStoreCollections.WORKSPACES, workspaceId);
    const docSnap = await getDoc(workspaceRef);
    if (!docSnap.exists()) {
        throw new Error("Workspace not found");
    }
    const workSpace = docSnap.data() as WorkSpaceType;
    workSpace.id = docSnap.id;
    const userData = (await getUserData(uid)) || {};
    if (!userData.workSpaceRequest) {
        userData.workSpaceRequest = [];
    }
    userData.workSpaceRequest.push(workSpace);
    setUserData(uid, undefined, undefined, userData.workSpaceRequest);
    return updateDoc(workspaceRef, {
        requests: [...workSpace.requests, uid],
    });
};
export const removeRequestWorkSpace = async (
    uid: string,
    workspaceId: string,
) => {
    const workspaceRef = doc(db, FireStoreCollections.WORKSPACES, workspaceId);
    const docSnap = await getDoc(workspaceRef);
    if (!docSnap.exists()) {
        throw new Error("Workspace not found");
    }
    const userData = (await getUserData(uid)) || {};
    if (!userData.workSpaceRequest) {
        userData.workSpaceRequest = [];
    }
    userData.workSpaceRequest = userData.workSpaceRequest.filter(
        (request: WorkSpaceType) => request.id !== workspaceId,
    );
    setUserData(uid, undefined, undefined, userData.workSpaceRequest);
    return updateDoc(workspaceRef, {
        requests: arrayRemove(uid),
    });
};

export const removeWorkSpace = async (workspaceId: string, uid: string) => {
    const workspaceRef = doc(db, FireStoreCollections.WORKSPACES, workspaceId);
    const docSnap = await getDoc(workspaceRef);
    if (!docSnap.exists()) {
        throw new Error("Workspace not found");
    }
    if (docSnap.data().owner.id !== uid) {
        throw new Error("You are not the owner of this workspace");
    }
    const userData = (await getUserData(uid)) || {};
    if (!userData.workSpaceOwnerOrder) {
        userData.workSpaceOwnerOrder = [];
    }
    userData.workSpaceOwnerOrder = userData.workSpaceOwnerOrder.filter(
        (id: string) => id !== workspaceId,
    );
    await setUserData(uid, userData.workSpaceOwnerOrder);
    return deleteDoc(workspaceRef);
};

export const getWorkSpace = async (workspaceId: string) => {
    const workspaceRef = doc(db, FireStoreCollections.WORKSPACES, workspaceId);
    const docSnap = await getDoc(workspaceRef);
    if (docSnap.exists()) {
        return docSnap.data() as WorkSpaceType;
    } else {
        throw new Error("Workspace not found");
    }
};

export const acceptRequest = async (uid: string, workSpaceId: string) => {
    const workSpaceRef = doc(db, FireStoreCollections.WORKSPACES, workSpaceId);
    const workSpaceDoc = await getDoc(workSpaceRef);
    if (!workSpaceDoc.exists()) {
        throw new Error("Workspace not found");
    }
    const userDataRef = doc(db, FireStoreCollections.USER_DATA, uid);
    const workSpaceData = workSpaceDoc.data() as WorkSpaceType;
    if (!workSpaceData.requests.includes(uid)) {
        throw new Error("User not found in requests");
    }
    const userDataDoc = await getDoc(userDataRef);
    if (!userDataDoc.exists()) {
        throw new Error("User not found");
    }
    const userData = userDataDoc.data();

    updateDoc(workSpaceRef, {
        requests: workSpaceData.requests.filter((request) => request !== uid),
        members: [...workSpaceData.members, uid],
    });
    updateDoc(userDataRef, {
        workSpaceRequest: userData.workSpaceRequest.filter(
            (request: WorkSpaceType) => request.id !== workSpaceId,
        ),
    });
};

export const declineRequest = async (uid: string, workSpaceId: string) => {
    const workSpaceRef = doc(db, FireStoreCollections.WORKSPACES, workSpaceId);
    const workSpaceDoc = await getDoc(workSpaceRef);
    if (!workSpaceDoc.exists()) {
        throw new Error("Workspace not found");
    }
    const userDataRef = doc(db, FireStoreCollections.USER_DATA, uid);
    const workSpaceData = workSpaceDoc.data() as WorkSpaceType;
    if (!workSpaceData.requests.includes(uid)) {
        throw new Error("User not found in requests");
    }
    const userDataDoc = await getDoc(userDataRef);
    if (!userDataDoc.exists()) {
        throw new Error("User not found");
    }
    const userData = userDataDoc.data();

    updateDoc(workSpaceRef, {
        requests: arrayRemove(uid),
    });
    updateDoc(userDataRef, {
        workSpaceRequest: userData.workSpaceRequest.filter(
            (request: WorkSpaceType) => request.id !== workSpaceId,
        ),
    });
};
