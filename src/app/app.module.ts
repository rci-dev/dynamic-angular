import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { COMPILER_PROVIDERS } from '@angular/compiler';


import { AppComponent } from './app.component';
import { DComponent } from './dmodule1/dmodule1/dmodule1.component';
import {DynamicModule} from './dynamic/dynamic.module';

@NgModule({
  declarations: [
    AppComponent,
    DComponent,
   ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DynamicModule.forRoot() // singletons
  ],
 // providers: [ COMPILER_PROVIDERS ],
  bootstrap: [AppComponent]
})
export class AppModule { }
