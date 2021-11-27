export enum Conditions
{
    ElementIsVisible = 0,
    ElementIsPresent = 1,
    PageHasLoaded = 2,

}

export enum HTMLQuery
{
    ID = 0,
    CSS = 1,
    JS = 2,
}

export type Identifier = {
    condition: Conditions;
    HTMLQuery?: HTMLQuery | HTMLQuery[];
    elementIdentifier?: string | string[];
    timeOut?: number;
};

export class IdentifierError extends Error
{
    constructor(message: string) {super(message);}
}
