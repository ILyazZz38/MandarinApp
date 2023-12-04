export interface bet{
    id?: string,
    price: number,
    lotId: string,
    lot?: lot,
    userEmail?: string
}

export interface lot{
    id?: string,
    mandarinId: string,
    mandarin?: mandarin,
    lotEndDate: Date,
    isOpen: boolean,
}

export interface mandarin{
    id?: string,
    name: string,
    startPrice: number,
    dateAdd: Date
}

export type option<T> = {
    value: T,
    label: string
}