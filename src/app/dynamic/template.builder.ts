import {Injectable} from "@angular/core";

@Injectable()
export class DynamicTemplateBuilder {

    private taskTable():string{
        let template = '<table style="border: 2px solid red"><tr  *ngFor="let task of resources.tasks">';
        template += '<td style="border: 1px solid black">{{task.id}}</td><td>{{task.name}}</td>';
        template += '<td><button (click)="dynamicEvent($event,task.id)">done</button></td>'
        template += '</tr></table>';
        return template;
    }

    private custList():string{
      let template='<div style="background-color:yellow"><h1>{{resources.header}}</h1><ol><li *ngFor="let person of resources.customers" [style.background-color]="person.active?white:gray">{{person.name}} <b>{{person.surname}}</b></li><i>({{resources.footer}})</i><div>';
      return template;
    }


    private entData(): string {
      let template = '<button (click)="firstEvent(resources.e1)">{{resources.e1}}</button>&nbsp;<button (click)="secondEvent()">{{resources.e2}}</button>';
      return template;
    }
    
    public prepareTemplate( viewDef:string, resourceDef:string):string{
      console.log("prepare template("+viewDef+","+resourceDef+")");

      switch(resourceDef){
          case "tasktable": return this.taskTable();
          case "custlist" : return this.custList();
          case "ent" : return this.entData();
      }
      
      return viewDef;
    }
}