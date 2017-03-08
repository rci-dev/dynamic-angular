import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'd-component-1',
  templateUrl: './dmodule1.component.html',
  styleUrls: ['./dmodule1.component.css']
})
export class DComponent implements OnInit {
  // dynamic defs
  private viewDefinition:string;
  private resourceDefinition:string;
  private resourcesData:any;



  private counter:number;
  private resType:string;
  @Input() resource:string;
  self=this;
  html ='<b><a href="http://onet.pl">kuku?</a></b>'

  constructor() { 
      this.viewDefinition = "<div>"+this.html+"</div>";

  }

  realEvent(ev:any){
    console.log("real event!"+ ev.data);
  }

  ngOnInit() {
    this.counter=0;
    
  }

  changeR2(){
    let n =this.resourcesData.tasks.length;
    this.resourcesData.tasks[this.counter % n].name ="R.Cichy";
    this.counter++;
  }

  newResource(){
    this.resourcesData = { tasks:[{id:115, name:"another task"},{id:5,name:"C# is better"},{id:20,name:"I want to ride my bicycle!"}]};
  }

  addTask(task:any){
    task.id = this.counter;
    this.resourcesData.tasks.push(task);

  }
  recreate(typ:string){
    this.counter++;
    this.resType = typ;
    switch(typ){
      case "sprints":
           this.resourcesData = { tasks:[{id:67, name:"dynamic templates"},{id:1111,name:"angular training"},{id:98,name:"windows service"}]};
           this.resourceDefinition="tasktable";
           break;
      case "cust":
          this.resourcesData = { header :"We are the champions:", customers:[
                {name:"Robert",surname:"Kaszuba", active:true},
                {name:"Maciek",surname:"Bieliński", active:true},
                {name:"Rysiek",surname:"Cichy", active:true},
                {name:"Nowy",surname:"Niewiadomo", active:false},
            ], footer:"doubled counter is "+2*this.counter};
          this.resourceDefinition="custlist";
          break;
      case "ent" :
         this.resourcesData = {e1:"aaa",e2:"sss"} ;
         this.resourceDefinition = "ent";
         break;
      default:
           this.resourceDefinition = "xxx";
           this.viewDefinition = this.viewDefinition + typ+ "<i>and.</i>";
    }
    console.log("recreate-"+this.counter);
  }

}
