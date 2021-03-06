import { Component, Injector, Inject } from '@angular/core';
import { Viewer } from '../../../base-classes/viz/Viewer';
import { FlowchartService } from '../../../global-services/flowchart.service';
import { InputPort, OutputPort, InputPortTypes, OutputPortTypes } from '../../../base-classes/port/PortModule';
import {ParameterSettingsDialogComponent} from '../parameter-editor/parameter-settings-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-publish-settings',
  templateUrl: './publish-settings.component.html',
  styleUrls: ['./publish-settings.component.scss']
})
export class PublishSettingsComponent extends Viewer{

  _flowchart;

  _globals;
  _nodes;
  
  inputPortOpts: InputPortTypes[] = [
        InputPortTypes.Input,
        InputPortTypes.Slider, 
        InputPortTypes.FilePicker,
        InputPortTypes.URL,
        InputPortTypes.Checkbox
    ]; 

  constructor(injector: Injector, 
      public dialogRef: MatDialogRef<PublishSettingsComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any, 
      public dialog: MatDialog) { 
     super(injector, "publish-settings"); 
  }

  ngOnInit() {
  	this._globals = this.flowchartService.getFlowchart().globals;
    this._flowchart = this.flowchartService.getFlowchart();
    this._nodes = this._flowchart.getNodes();
  }

  addGlobal(): void{
  	let inputPort = new InputPort("global"  + this._globals.length);
    this._globals.push(inputPort);
  	this._flowchart.globals = this._globals;
  }

  getInputTypeName(type: InputPortTypes): string{
      if(type == InputPortTypes.ColorPicker){
        return "Color";
      }
      else if(type == InputPortTypes.Input){
        return "Simple Input";
      }
      else if(type == InputPortTypes.Dropdown){
        return "Dropdown";
      }
      else if(type == InputPortTypes.FilePicker){
        return "File";
      }
      else if(type == InputPortTypes.Slider){
        return "Slider";
      }
      else if(type == InputPortTypes.URL){
        return "WebURL";
      }
      else if(type == InputPortTypes.Checkbox){
        return "Checkbox";
      }
      else{
        return "Not Identifiable"
      }
  }

  openSettingsDialog(input: InputPort): void{
      let dialogRef = this.dialog.open(ParameterSettingsDialogComponent, {
          height: '400px',
          width: '600px',          
          data: { 
                  inputPortTypes: this.inputPortOpts,
                  input: input
                }
      });

      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
      });
  }

  deleteGlobal(index: number): void{
    this._globals.splice(index, 1);
    this._flowchart.globals = this._globals;
  }

  updateGlobal($event, port: InputPort|OutputPort): void{
      let name: string =  $event.srcElement.innerText; 

      // check for validity
      name = name.replace(/[^\w]/gi, '');

      if(name.trim().length > 0){
        // put a timeout on this update or something similar to solve jumpiness
        port.setName(name);
        this.flowchartService.update();
      }
  }

  updateType(type: InputPortTypes|OutputPortTypes, port: InputPort|OutputPort): void{
        
        port.setType(type);

        //defaults
        if(type == InputPortTypes.Slider){
          port.setOpts({min: 0, max: 100, step: 1});
          port.setDefaultValue(50);
        }

  }

  save(value: boolean): void{
    this.flowchartService.saveFile(value);
  }

}
