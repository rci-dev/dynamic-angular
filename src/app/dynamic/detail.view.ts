import { Component, Input, ComponentRef,ViewChild,ViewContainerRef}   from '@angular/core';
import { Output, EventEmitter}   from '@angular/core';
import { AfterViewInit,OnInit,OnDestroy}          from '@angular/core';
import { OnChanges,SimpleChange,ComponentFactory} from '@angular/core';

import { IHaveDynamicData, DynamicTypeBuilder,IEventData } from './type.builder';
import { DynamicTemplateBuilder }               from './template.builder';

@Component({
  selector: 'dynamic-detail',
  template: `<div #dynamicContentPlaceHolder></div>`,
})

export class DynamicDetail implements AfterViewInit, OnChanges, OnDestroy, OnInit
{ 
    // reference for a <div> with #dynamicContentPlaceHolder
    @ViewChild('dynamicContentPlaceHolder', {read: ViewContainerRef}) 
    protected dynamicComponentTarget: ViewContainerRef;
    // this will be reference to dynamic content - to be able to destroy it
    protected componentRef: ComponentRef<IHaveDynamicData>;
    
    // until ngAfterViewInit, we cannot start (firstly) to process dynamic stuff
    protected wasViewInitialized = false;
    
    @Input() htmlTemplate:string="<div></div>";
    @Input() resourceDef:string;
    @Input() resources:any;
    @Output() public QEvent:EventEmitter<IEventData> = new EventEmitter<IEventData>();

    // wee need Dynamic component builder
    constructor(
        protected typeBuilder: DynamicTypeBuilder,
        protected templateBuilder: DynamicTemplateBuilder
    ) {
        console.log("component builder constructor");
    }

   /** Get a Factory and create a component */ 
    
    protected refreshContent(){
     
      if (this.componentRef) {
          this.componentRef.instance.onQaddEvent.unsubscribe();
          this.componentRef.destroy();
      }
      
      // here we get a TEMPLATE with dynamic content === TODO
      var template = this.templateBuilder.prepareTemplate(this.htmlTemplate, this.resourceDef);
      console.log('detail.view prepareTemplate, template="'+template+'" ,res="' + this.resourceDef+'"');

      // here we get Factory (just compiled or from cache)
      this.typeBuilder
          .createComponentFactory(template, this.resourceDef)
          .then((factory: ComponentFactory<IHaveDynamicData>) =>
        {
            // Target will instantiate and inject component (we'll keep reference to it)
            this.componentRef = this
                .dynamicComponentTarget
                .createComponent(factory);

            // let's inject @Inputs to component instance
            let component = this.componentRef.instance;

            component.resources = this.resources;
            component.onQaddEvent.subscribe(this.QEvent);
            //...
        });
    }

    /** IN CASE WE WANT TO RE/Gerante - we need cean up */

    // this is the best moment where to start to process dynamic stuff
    public ngOnInit(){
        
    }
    
    public ngAfterViewInit(): void
    {
        console.log("after view init");
        this.wasViewInitialized = true; 
        this.refreshContent();
    }
    // wasViewInitialized is an IMPORTANT switch 
    // when this component would have its own changing @Input()
    // - then we have to wait till view is intialized - first OnChange is too soon
    public ngOnChanges(changes: {[key: string]: SimpleChange}): void
    {
      if (!this.wasViewInitialized) {
            return;
        }
      if(changes["htmlTemplate"]==null && changes["resourceDef"]==null){
          this.componentRef.instance.resources = changes["resources"].currentValue;
          return;
      }
       
      console.log("on changes..."+ changes["resourceDef"].isFirstChange());
      this.refreshContent();
    }
    public ngOnDestroy(){
      if (this.componentRef) {
         this.componentRef.instance.onQaddEvent.unsubscribe();
         this.componentRef.destroy();
          this.componentRef = null;
      }
    }
  
  
}



