export enum FireStoreCollections {
    WORKSPACES = "workspaces",
    USER_DATA = "userData",
    COLUMN = "column",
    CARD = "card",
}

export const FireStoreCollectionFields = {
    WORKSPACES: {
        ID: 'id',
        NAME: "name",
        ICON_UNIFIED: "icon_unified",
        MEMBERS: "members",
        OWNER: "owner",
        CREATED_AT: "created_at",
        REQUEST: "requests",
    } as const,
    USER_DATA: {
        ID: 'id',
        WORKSPACE_OWNER_ORDER: "workSpaceOwnerOrder",
        WORKSPACE_MEMBER_ORDER: "workSpaceMemberOrder",
        EMAIL: "email",
        NAME: "name",
        IMAGE_URI: "imageUri",
        WORKSPACE_REQUEST: "workSpaceRequest",
    } as const,
    COLUMN: {
        ID: 'id',
        TITLE: "title",
        WORKSPACE_ID: "workspaceId",
        COLUMN_INDEX: 'columnIndex',
        CARDS: "cards",
    } as const,

    CARD: {
        ID: 'id',
        CARD_INDEX: 'cardIndex',
        COLUMN_ID: 'columnId',
        CONTENT: 'content',
        DUE_DATE: 'dueDate',
        ASSIGN_ID: 'assigneeId',
        TASKS: 'tasks',
    } as const,
}