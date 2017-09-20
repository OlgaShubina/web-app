import * as jQuery from 'jquery';

export interface jQHTMLElement extends JQuery<HTMLElement> {
   datetime(eventName: string, handler: Function): void;
   datetimepicker():void;
}
