import { Component, Injector, ElementRef, ViewChild } from '@angular/core';

import { Viewer } from '../../../base-classes/viz/Viewer';
import { IGraphNode } from '../../../base-classes/node/NodeModule';
import { InputPort, InputPortTypes } from '../../../base-classes/port/PortModule';

@Component({
  selector: 'app-parameter-viewer',
  templateUrl: './parameter-viewer.component.html',
  styleUrls: ['./parameter-viewer.component.scss']
})
export class ParameterViewerComponent extends Viewer {

	  _node: IGraphNode;
	  _inputs: InputPort[];
    isVisible: boolean = false;

    InputPortTypes = InputPortTypes;

    @ViewChild('cesium_param_container') el:ElementRef;

  	constructor(injector: Injector){  
        super(injector, "parameter-viewer"); 
     }

  	ngOnInit() {
      this.update();
  	}

    reset(): void{
      this._node = undefined; 
      this._inputs = [];
    }

  	// addInput(): void{
   //    	this._node.addInput();
  	// 	  this.flowchartService.update();
	  // }

    // updateInputName($event, input): void{
    //   let name: string = $event.srcElement.innerText;
    //   input.setName(name);
    //   // put a timeout on this update or something similar to solve jumpiness
    //   this.flowchartService.update();
    // }

    // updateInputType( type:string ){
    //   alert(type);
    // }

    updateComputedValue($event, input, value?: any): void{

      // for input
      if($event.srcElement){
        value = $event.srcElement.value;
        value = value.trim();
        if(value.length == 0){
          input.setComputedValue(undefined);
          return;
        }
      }

      input.setComputedValue(value);
      this.flowchartService.update();
    }

    getValue(port :InputPort): any{

        if(port.getType() == InputPortTypes.Checkbox){
          return port.getValue() || false;
        }
        else{
          return (port.getValue() || " ");
        }

    }
  	//
  	//	this update runs when there is a message from other viewers that something changed; 
  	//  beware of updating flowchart here - it will go into an unending loop :/
  	//
  	update(): void{
  		this._node = this.flowchartService.getSelectedNode();
      if(this._node != undefined){
         this._inputs = this._node.getInputs().filter(function(inp: InputPort){
           return !inp.isConnected();
         });
         this.isVisible = true;
      }
      else{
        this.isVisible = false;
      }
  	}
    

    //
    //
    //
    executeFlowchart($event): void{
        $event.stopPropagation();
        this.flowchartService.execute();
    }

    handleFileInput(fileList, input){
      let file: File = fileList[0];
      var reader = new FileReader();
      let fs = this.flowchartService;
      reader.onload = (function(reader)
      {
          return function()
          {
              var contents = reader.result;
              /*var lines = contents.split('\n');
              contents = lines.join("\\\n");*/
              input.setComputedValue(contents);
              fs.update();
          }
      })(reader);

      reader.readAsText(file);
    
    }

    url = "";
    handleURL($event, input){
      fetch('https://' + this.url)
      .then(response => response.json())
      .then(json => 
        input.setComputedValue(JSON.stringify(json))
      )
    }

}
