import { Component, OnInit, Injector } from '@angular/core';

import { Viewer } from '../../../base-classes/viz/Viewer';

import { LayoutService } from '../../../global-services/layout.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-viewer-container',
  templateUrl: './viewer-container.component.html',
  styleUrls: ['./viewer-container.component.scss']
})
export class ViewerContainerComponent extends Viewer implements OnInit {

  	private _layout_subscription: Subscription;
  	group: {value: number} = {value: 500};
  	_lock:  boolean = false;

	constructor(injector: Injector, private layoutService: LayoutService){ 
		super(injector, "Viewer Container", "Contains all the viewers");  

		this._layout_subscription = this.layoutService.getMessage().subscribe(message => { 
          	if(message.text.startsWith("Module: ")){
  			    this.switchToHelp();
          	}
          	else if(message.text == "console"){
          		this.switchToConsole();
          	}
  		});
	}

	ngOnDestroy(){
		this._layout_subscription.unsubscribe();
		this.group = null;
		this._lock = null;
	}

	reset(): void{
	}

	updateGroupValue(value: number): void{
		this.group.value = value;
		this.layoutService.setViewContainer(value); 
	}

	switchToHelp(): void{
		this.updateGroupValue(400);
	}

	switchToConsole(): void{
		let self = this;
		setTimeout(function(){
			self.updateGroupValue(3);
		}, 100);
	}

	update() {
		let port = this.flowchartService.getSelectedPort(); 
		if(port == undefined){
			this.updateGroupValue(this.layoutService.getViewContainer());
		}
		else{
			this.updateGroupValue( this.flowchartService.getSelectedPort().getType() );
		}
	}

  	ngOnInit() {
  		this.updateGroupValue(this.layoutService.getViewContainer());
  	}

  	changed(): void{
  		this.layoutService.setViewContainer(this.group.value);
  	}


}
