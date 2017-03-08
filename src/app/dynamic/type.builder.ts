import { Component, ComponentFactory, NgModule, Input, Output, EventEmitter, Injectable} from '@angular/core';
//import { JitCompilerFactory} from '@angular/compiler';
import { Compiler} from '@angular/core';
//import { JitCompiler } from '@angular/compiler';
import { PartsModule } from '../parts/parts.module';
import * as _  from "lodash";

export interface IEventData {
    source:any;
    data:any;
}
export interface IHaveDynamicData { 
    resources: any;
    onQaddEvent:EventEmitter<IEventData>;
}

@Injectable()
export class DynamicTypeBuilder {
  constructor(
    protected compiler:Compiler// JitCompiler - if JitCompiler needed use JitCompilerFactory below.
  ) {}
    
  //private compiler: Compiler = new JitCompilerFactory([{useDebug: false, useJit: true}]).createCompiler();

  // this object is singleton - so we can use this as a cache
  private _cacheOfFactories: {[templateKey: string]: ComponentFactory<IHaveDynamicData>} = {};
  
  public createComponentFactory(templateDef: string, resourcesDef:string)
    : Promise<ComponentFactory<IHaveDynamicData>> {
    let factory = this._cacheOfFactories[templateDef];

    if (factory) {
        console.log("Module and Type are returned from cache")
       
        return new Promise((resolve) => {
            resolve(factory);
        });
    }
    
    // unknown template ... let's create a Type for it
    let newComponent   = this.createNewComponent(templateDef, resourcesDef);
    let module = this.createComponentModule(newComponent);
    
    return new Promise((resolve) => {
        this.compiler
            .compileModuleAndAllComponentsAsync(module)
            .then((moduleWithFactories) =>
            {
               // if message: 'Cannot find name '_'.'
               // npm install --save @types/lodash 
                factory = _.find(moduleWithFactories.componentFactories, { componentType: newComponent });
                this._cacheOfFactories[templateDef] = factory;
                resolve(factory);
            });
    });
  }
  
  protected createNewComponent (tmpl:string, type:string) {
      @Component({
          selector: 'dynamic-component',
          template: tmpl,
      })
      class CustomDynamicComponent  implements IHaveDynamicData {
          @Input()  public resources: any;
          @Output() public onQaddEvent:EventEmitter<IEventData> = new EventEmitter<IEventData>();

          dynamicEvent(ev:any,evData:any){
              console.log("event:"+evData);
              this.onQaddEvent.emit({source:ev,data:evData});
          }
      };

      @Component({
          selector: 'dynamic-component',
          template: tmpl,
      })
      class CustomDynamicComponent2  implements IHaveDynamicData {
          @Input()  public resources: any;
          @Output() public onQaddEvent:EventEmitter<IEventData> = new EventEmitter<IEventData>();

          firstEvent(s:string){
              this.onQaddEvent.emit({source:1,data:s});
          }

          secondEvent(){
             this.onQaddEvent.emit({source:789,data:"event-s"}); 
          }
      };    
      // a component for this particular template
      if(type=="ent")
      return CustomDynamicComponent2;
      else
      return CustomDynamicComponent;
  }

  protected createComponentModule (componentType: any) {
      @NgModule({
        imports: [
          PartsModule // there are all components used by this dynamic component...
        ],
        declarations: [
          componentType
        ],
      })
      class RuntimeComponentModule
      {
      }
      // a module for just this Type
      return RuntimeComponentModule;
  }
}