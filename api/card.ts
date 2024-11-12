import {
    FireStoreCollectionFields,
    FireStoreCollections,
} from "@/constants/FirebaseConstants";
import { db } from "@/lib/firebase/firebase";
import { Card, Id, Task } from "@/types/KanBanType";

import {
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where
} from "firebase/firestore";
import { getColumnsAPI } from "./column";

export const getAllCardsAPI = async () => {
    const q = query(
        collection(db, FireStoreCollections.CARD),
        orderBy(FireStoreCollectionFields.CARD.CARD_INDEX, "asc"),
    );
    const querySnapshot = await getDocs(q);
    const cards: Card[] = [];
    querySnapshot.forEach((doc) => {
        cards.push({
            ...doc.data(),
        } as Card);
    });
    return cards;
};

export const getCardsOfColumnAPI = async (columnId: string) => {
    const cards = await getAllCardsAPI();
    return cards.filter((card) => card.columnId === columnId);
};

export const getCardOfWorkspaceAPI = async (workspaceId: string) => {
    const columns = await getColumnsAPI(workspaceId);
    const cards = await getAllCardsAPI();
    return cards.filter((card) =>
        columns.map((column) => column.id).includes(card.columnId),
    );
};

export const addCardAPI = async (card: Card) => {
    const cardRef = collection(db, FireStoreCollections.CARD);
    await addDoc(cardRef, card);
};

export const removeCardAPI = async (cardId: Id) => {
    const q = query(
        collection(db, FireStoreCollections.CARD),
        where(FireStoreCollectionFields.CARD.ID, "==", cardId),
    );

    const removeIdCardInColumn = query(
        collection(db, FireStoreCollections.COLUMN),
        where(FireStoreCollectionFields.COLUMN.CARDS, "array-contains", cardId),
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });

    const removeIdCardInColumnSnapshot = await getDocs(removeIdCardInColumn);
    removeIdCardInColumnSnapshot.forEach((doc) => {
        const cards = doc.data()[FireStoreCollectionFields.COLUMN.CARDS];
        const newCards = cards.filter((id: Id) => id !== cardId);
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.COLUMN.CARDS]: newCards,
        });
    });
};

export const updateCardAPI = async (cardId: Id, content: string) => {
    const q = query(
        collection(db, FireStoreCollections.CARD),
        where(FireStoreCollectionFields.CARD.ID, "==", cardId),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.CARD.CONTENT]: content,
        });
    });
};

export const addIDCardToColumnAPI = async (columnId: Id, cardId: Id) => {
    const q = query(
        collection(db, FireStoreCollections.COLUMN),
        where(FireStoreCollectionFields.COLUMN.ID, "==", columnId),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.COLUMN.CARDS]: [
                ...doc.data()[FireStoreCollectionFields.COLUMN.CARDS],
                cardId,
            ],
        });
    });
};

export const updateIndexInColumnAPI = async (
    activeId: Id,
    activeIndex: number,
    overId: Id,
    overIndex: number,
) => {
    const activeQ = query(
        collection(db, FireStoreCollections.CARD),
        where(FireStoreCollectionFields.CARD.ID, "==", activeId),
    );
    const overQ = query(
        collection(db, FireStoreCollections.CARD),
        where(FireStoreCollectionFields.CARD.ID, "==", overId),
    );
    const activeQuerySnapshot = await getDocs(activeQ);
    const overQuerySnapshot = await getDocs(overQ);
    activeQuerySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.CARD.CARD_INDEX]: overIndex,
        });
    });
    overQuerySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.CARD.CARD_INDEX]: activeIndex,
        });
    });
    const cards = await getAllCardsAPI();
    const activeCard = cards.find((card) => card.id === activeId);
    const overCard = cards.find((card) => card.id === overId);

    if (activeCard && overCard) {
        activeCard.columnId = overCard.columnId;

        activeQuerySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
                [FireStoreCollectionFields.CARD.COLUMN_ID]: activeCard.columnId,
            });
        });
    }
    const columnq = query(
        collection(db, FireStoreCollections.COLUMN),
        where(
            FireStoreCollectionFields.COLUMN.CARDS,
            "array-contains",
            activeId,
        ),
    );
    const columnQuerySnapshot = await getDocs(columnq);
    columnQuerySnapshot.forEach((doc) => {
        const cards = doc.data()[FireStoreCollectionFields.COLUMN.CARDS];
        const newCards = cards.filter((id: Id) => id !== activeId);
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.COLUMN.CARDS]: newCards,
        });
    });

    const overColumnq = query(
        collection(db, FireStoreCollections.COLUMN),
        where(FireStoreCollectionFields.COLUMN.CARDS, "array-contains", overId),
    );
    const overColumnQuerySnapshot = await getDocs(overColumnq);
    overColumnQuerySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.COLUMN.CARDS]: [
                ...doc.data()[FireStoreCollectionFields.COLUMN.CARDS],
                activeId,
            ],
        });
    });
};

export const updateIndexDiffColumnAPI = async (
    activeCardId: Id,
    overColId: Id,
    overCardIndex: number,
) => {
    const activeQ = query(
        collection(db, FireStoreCollections.CARD),
        where(FireStoreCollectionFields.CARD.ID, "==", activeCardId),
    );
    const activeQuerySnapshot = await getDocs(activeQ);
    activeQuerySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.CARD.COLUMN_ID]: overColId,
            [FireStoreCollectionFields.CARD.CARD_INDEX]: overCardIndex,
        });
    });
};

export const searchCardAPI = async (workspaceId: string, search: string) => {
    const columns = await getColumnsAPI(workspaceId);
    const cards = await getAllCardsAPI();
    return cards.filter((card) =>
        columns.map((column) => column.id).includes(card.columnId),
    ).filter((card) => card.content.includes(search));
};

export const updateDueDateAPI = async (cardId: Id, dueDate: string) => {
    console.log(cardId, dueDate);
    const q = query(collection(db, FireStoreCollections.CARD),
        where(FireStoreCollectionFields.CARD.ID, "==", cardId),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.CARD.DUE_DATE]: dueDate,
        });
    });
}

export const updateAssignAPI = async (cardId: Id, assignId: string) => {
    const q = query(collection(db, FireStoreCollections.CARD),
        where(FireStoreCollectionFields.CARD.ID, "==", cardId),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.CARD.ASSIGN_ID]: assignId,
        });
    });
}

export const onSnapshotCardAPI = (
    callback: () => void,
    columnId: Id
) => {
    const q = query(
        collection(db, FireStoreCollections.CARD),
        where(FireStoreCollectionFields.CARD.COLUMN_ID, "==", columnId),
    );
    const unsubscribe = onSnapshot(q, callback);
    return unsubscribe;
}

export const updateCardsAPI = async (cards: Card[]) => {
    cards.map(async (card, index) => {
        const q = query(
            collection(db, FireStoreCollections.CARD),
            where(FireStoreCollectionFields.CARD.ID, "==", card.id),
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
                [FireStoreCollectionFields.CARD.CARD_INDEX]: index,
                [FireStoreCollectionFields.CARD.COLUMN_ID]: card.columnId,
            });
        });
    });
}

export const addTasksAPI = async (cardId: Id, tasks: Task[]) => {
    const q = query(
        collection(db, FireStoreCollections.CARD),
        where(FireStoreCollectionFields.CARD.ID, "==", cardId),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            [FireStoreCollectionFields.CARD.TASKS]: tasks,
        });
    });
}