import { By, WebElementPromise } from "selenium-webdriver";
import 'reflect-metadata';
import { Browser }               from "./browser";
import { WebComponent }          from "./components";

export enum Condition
{
    ElementIsVisible = 0,
    ElementIsPresent = 1,
    PageHasLoaded = 2,
}

export enum HTMLQuery
{
    ID = "ID",
    CSS = "CSS",
    JS = "JS",
    LINKTEXT = "LINKTEXT",
    CLASS = "CLASS"
}

export type Identifier = {
    condition: Condition | undefined;
    HTMLQuery: HTMLQuery | HTMLQuery[] | undefined;
    elementIdentifier: string | string[];
    timeOut?: number;
    webElement: WebElementPromise | undefined;
};


export class IdentifierError extends Error
{
    constructor(message: string) {super(message);}
}

export function findBy(selector: string, browser: Browser, component?: any) {
    return (target: any, propertyKey: string) => {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        Object.defineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            get: function() {
                const promise = browser.getDriver().findElement(By.id(selector));
                component = new WebComponent(promise);
                return new type(promise, selector);
            },
        });
    };
}
