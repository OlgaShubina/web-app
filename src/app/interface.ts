import {Injectable} from '@angular/core';

export interface PlotHTMLElement extends HTMLElement  {
  on(eventName: string, handler: Function): void;
   data(eventName: string, handler: Function): void;
   ready(eventName: string, handler: Function): void;
   checked(eventName: string, handler: PropertyDecorator): boolean;
}
