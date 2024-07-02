export type ResourceEndpoint = {
    name: string;
    data?: unknown;
    type: string;
    _links: {
        parents: string[];
        children: string[];
        operations: OperationsActive | OperationsNotActive | OperationsInitiate;
    };
};

export interface OperationsNotActive<> {
    get: Link;
}

export interface OperationsActive extends OperationsNotActive {
    update: Link;
    complete: Link;
    delete: Link;
}

export interface OperationsInitiate {
    initiate: Link;
}

export interface Link {
    href: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

