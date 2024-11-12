import {
    FireStoreCollectionFields,
    FireStoreCollections,
} from "@/constants/FirebaseConstants";
import { db } from "@/lib/firebase/firebase";
import { Column, Id } from "@/types/KanBanType";
import {
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

export const getColumnsAPI = async (workspaceId: string) => {
    const q = query(
        collection(db, FireStoreCollections.COLUMN),
        where(FireStoreCollectionFields.COLUMN.WORKSPACE_ID, "==", workspaceId),
        orderBy(FireStoreCollectionFields.COLUMN.COLUMN_INDEX, "asc"),
    );
    const querySnapshot = await getDocs(q);
    const columns: Column[] = [];
    querySnapshot.forEach((doc) => {
        columns.push({
            ...doc.data(),
        } as Column);
    });
    return columns;
};

export const addColumnAPI = async (column: Column) => {
    const columnRef = collection(db, FireStoreCollections.COLUMN);
    await addDoc(columnRef, column);
};

export const onSnapshotColumns = (
    callback: () => void,
    workspaceId: string,
) => {
    const q = query(
        collection(db, FireStoreCollections.COLUMN),
        where(FireStoreCollectionFields.COLUMN.WORKSPACE_ID, "==", workspaceId),
    );
    return onSnapshot(q, () => {
        callback();
    });
};

export const removeColumnAPI = async (columnId: Id) => {
    const q = query(
        collection(db, FireStoreCollections.COLUMN),
        where(FireStoreCollectionFields.COLUMN.ID, "==", columnId),
    );

    const cardQ = query(
        collection(db, FireStoreCollections.CARD),
        where(FireStoreCollectionFields.CARD.COLUMN_ID, "==", columnId),
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });

    const cardQuerySnapshot = await getDocs(cardQ);
    cardQuerySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });
};

export const updateColumnTitleAPI = async (
    columnId: Id,
    columnTitle?: string,
) => {
    const q = query(
        collection(db, FireStoreCollections.COLUMN),
        where(FireStoreCollectionFields.COLUMN.ID, "==", columnId),
    );

    const newColumn: Partial<Column> = {};
    if (columnTitle) {
        newColumn[FireStoreCollectionFields.COLUMN.TITLE] = columnTitle;
    }
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, newColumn);
    });
};

export const updateColumnPositionAPI = async (
    activeId: Id,
    activeIndex: number,
    overId: Id,
    overIndex: number,
) => {
    const activeQ = query(
        collection(db, FireStoreCollections.COLUMN),
        where(FireStoreCollectionFields.COLUMN.ID, "==", activeId),
    );
    const overQ = query(
        collection(db, FireStoreCollections.COLUMN),
        where(FireStoreCollectionFields.COLUMN.ID, "==", overId),
    );
    const activeQuerySnapshot = await getDocs(activeQ);
    const overQuerySnapshot = await getDocs(overQ);
    activeQuerySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.COLUMN.COLUMN_INDEX]: overIndex,
        });
    });
    overQuerySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.COLUMN.COLUMN_INDEX]: activeIndex,
        });
    });
};

export const searchColumnAPI = async (columnId: Id) => {
    const q = query(
        collection(db, FireStoreCollections.COLUMN),
        where(FireStoreCollectionFields.COLUMN.ID, "==", columnId),
    );
    const querySnapshot = await getDocs(q);
    const columns: Column[] = [];
    querySnapshot.forEach((doc) => {
        columns.push({
            ...doc.data(),
        } as Column);
    });
    return columns;
}

export const updateColumnsAPI = async (columns: Column[]) => {
    columns.map(async (column, index) => {
        const q = query(
            collection(db, FireStoreCollections.COLUMN),
            where(FireStoreCollectionFields.COLUMN.ID, "==", column.id),
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
                [FireStoreCollectionFields.COLUMN.COLUMN_INDEX]: index,
            });
        });
    });
}