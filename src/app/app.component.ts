import { Component, ViewChild } from '@angular/core';
import { DComponent} from './dmodule1/dmodule1/dmodule1.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(DComponent) dyna:DComponent;
  title = 'Do dynamic, rycho!';
  resource = "accounts 45";
  typeValue="a kuku!";

  rebuild(){
     this.dyna.recreate(this.typeValue);     
  }

addTask(){
  this.dyna.addTask({id:0,name:"new task"});
}
  selectionChanged(){
  
  }
}
