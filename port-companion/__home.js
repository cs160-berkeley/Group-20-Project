/* main page: home */


import {
	img_SwitchBGD,
	img_SwitchFGD,
	lightGray
} from "global_settings";

var deviceURL = "";
let backgroundSkin = new Skin({ fill: "white" });
let deviceSkin = new Skin({ fill: lightGray });
let toggleSwitchBackgroundTexture = new Texture(img_SwitchBGD);
let toggleSwitchForegroundTexture = new Texture(img_SwitchFGD);

let labelStyle = new Style({ font:"20px Verdana", color:"black" });
	
/* BEHAVIORS */

class ToggleSwitchBehavior extends Behavior {
	constrain(port, offset) {
		if (offset < 0)
			offset = 0;
		else if (offset > this.size)
			offset = this.size;
		return offset;
	}
	onCreate(port, data) {
		this.data = data;
		this.onOff = this.data.onOff;
		this.ov_onOff = this.data.ov_onOff;
		this.fd_onOff = this.data.fd_onOff;
		this.switchForeground = toggleSwitchForegroundTexture;
		this.switchBackground = toggleSwitchBackgroundTexture;
		
		this.size = this.switchBackground.width - this.switchForeground.width;
		this.offset = ("off" == this.onOff ? this.size : 0);
		this.touched = false;
		this.capturing = false;
		this.touchMovedOffset = 15;
	}
	onDraw(port, x, y, width, height) {
		port.pushClip();
		port.intersectClip(x + 6, y + 6, width - 12, height - 12);
		port.drawImage(this.switchBackground, x - this.offset, y, width + this.size, height, 
			0, this.touched ? 40 : 0, width + this.size, height);
		port.popClip();
		//port.drawImage(this.switchForeground, x, y, width, height);
	}
	onFinished(port) {
		this.touched = false;
		this.capturing = false;
		
		if (this.offset == 0)
			this.onOff = "on";
		else
			this.onOff = "off";
			
		this.onSwitchChanged(port, this.onOff);
	}
	onSwitchChanged(port, onOff) {
		debugger
	}
	onTimeChanged(port) {
		let fraction = port.fraction;
		this.offset = this.anchor + Math.round(this.delta * fraction);
		port.invalidate();
	}
	onTouchBegan(port, id, x, y, ticks) {
		if (port.running) {
			port.stop();
			port.time = port.duration;
		}
		this.anchor = x;
		this.delta = this.offset + x;
		this.touched = true;
		port.invalidate();
	}
	onTouchCancelled(port, id, x, y, ticks) {
		this.touched = false;
	}
	onTouchEnded(port, id, x, y, ticks) {
		let offset = this.offset;
		let size = this.size;
		let delta = size >> 1;
		this.anchor = offset;
		if (this.capturing) {
			if (offset < delta)
				delta = 0 - offset;
			else 
				delta = size - offset;
		}
		else {
			if (offset == 0)
				delta = size;
			else
				delta = 0 - size;
		}
		if (delta) {
			this.delta = delta;
			port.duration = 100 * Math.abs(delta) / size;
			port.time = 0;
			port.start();
		}
		else
			this.onFinished(port);
		port.invalidate();
	}
	onTouchMoved(port, id, x, y, ticks) {
		if (this.capturing)
			this.offset = this.constrain(port, this.delta - x);
		else if (Math.abs(x - this.anchor) >= this.touchMovedOffset) {
			port.captureTouch(id, x, y, ticks);
			this.capturing = true;
			this.offset = this.constrain(port, this.delta - x);
		}
		port.invalidate();
	}
}

/* LAYOUTS */

var HomePorts = Port.template($=> ({
	left:0, right:0, top:0, bottom:0, style:labelStyle,
	skin:backgroundSkin,
	Behavior: class extends Behavior {
		onCreate(port, data) {
			this.data = data;
		}
		onDraw(port, x, y, width, height) {
			port.fillColor( "white", x, y, width, height );
			// right down
			// port.fillColor(lightGray, -80, -140, width, height);
					
			// port.fillColor( lightGray, x, y, width, height );
			/*
			port.drawLabel( "off" == $.DAT.onOff ? "Night Light: Off" : "Night Light: On" , -80, -140, width, height );
			port.drawLabel( "off" == $.DAT.fd_onOff ? "Front Door: Off" : "Front Door: On" , -80, -90, width, height );
			port.drawLabel( "off" == $.DAT.ov_onOff ? "Oven: Off" : "Oven: On" , -80, -40, width, height );
			*/
					
			port.drawLabel("Night Light", -80, -140, width, height );
			port.drawLabel("Front Door", -80, -90, width, height );
			port.drawLabel("Oven", -80, -40, width, height );
					
		}
		onSwitchChanged(port, onOff) {
			port.invalidate();
		}
	}
}));

// device list item: for convenience of device screen implementation
var DeviceListItem = Container.template($ => ( {
	top:100, right:30, height:0, skin:deviceSkin,
	contents: [
		Port($, {
			width:toggleSwitchForegroundTexture.width, height:toggleSwitchForegroundTexture.height, active:true,
			// skin:deviceSkin,
			Behavior: class extends ToggleSwitchBehavior {
				onSwitchChanged(port, onOff) {
					if (deviceURL != "") new Message(deviceURL + "getCount").invoke(Message.JSON).then(json => { this.data.onOff = json.count });
					this.data.onOff = onOff;
					// port.container.previous.invalidate();
				}
			}
		})
	]
}));

export let HomeScreen_ = Container.template($ => ({
	left:0, right:0, top:0, bottom:0,
	contents: [
		new HomePorts({ }),
		/*
		Port($, {
			left:0, right:0, top:0, bottom:0, style:labelStyle,
			Behavior: class extends Behavior {
				onCreate(port, data) {
					this.data = data;
				}
				onDraw(port, x, y, width, height) {
					port.fillColor( "white", x, y, width, height );
					port.drawLabel( "off" == this.data.onOff ? "Night Light: Off" : "Night Light: On" , -80, -140, width, height );
					port.drawLabel( "off" == this.data.fd_onOff ? "Front Door: Off" : "Front Door: On" , -80, -90, width, height );
					port.drawLabel( "off" == this.data.ov_onOff ? "Oven: Off" : "Oven: On" , -80, -40, width, height );
				}
				onSwitchChanged(port, onOff) {
					port.invalidate();
				}
			}
		}),
		*/
		
		// new test({$}),
		new DeviceListItem({}),
		/*
		Container($, {
			top:100, right:30, height:0, skin:backgroundSkin,
			contents: [
				Port($, {
					width:toggleSwitchForegroundTexture.width, height:toggleSwitchForegroundTexture.height, active:true,
					Behavior: class extends ToggleSwitchBehavior {
						onSwitchChanged(port, onOff) {
							if (deviceURL != "") new Message(deviceURL + "getCount").invoke(Message.JSON).then(json => { this.data.onOff = json.count });
							this.data.onOff = onOff;
							port.container.previous.invalidate();
						}
					}
				})
			]
		}),
		*/
		Container($, {
			top:150, right:30, height:0, skin:backgroundSkin,
			contents: [
				Port($, {
					width:toggleSwitchForegroundTexture.width, height:toggleSwitchForegroundTexture.height, active:true,
					Behavior: class extends ToggleSwitchBehavior {
						onSwitchChanged(port, fd_onOff) {
							if (deviceURL != "") new Message(deviceURL + "getFrontDoor").invoke(Message.JSON).then(json => { this.data.fd_onOff = json.fd_count });
							this.data.fd_onOff = fd_onOff;
							// port.container.previous.invalidate();
						}
					}
				})
			]
		}),
		Container($, {
			top:200, right:30, height:0, skin:backgroundSkin,
			contents: [
				Port($, {
					width:toggleSwitchForegroundTexture.width, height:toggleSwitchForegroundTexture.height, active:true,
					Behavior: class extends ToggleSwitchBehavior {
						onSwitchChanged(port, ov_onOff) {
							if (deviceURL != "") new Message(deviceURL + "getOven").invoke(Message.JSON).then(json => { this.data.ov_onOff = json.ov_count });
							this.data.ov_onOff = ov_onOff;
							// port.container.previous.invalidate();
						}
					}
				})
			]
		})
	]
}));

Handler.bind("/discover", Behavior({    onInvoke: function(handler, message){        deviceURL = JSON.parse(message.requestText).url;    }}));Handler.bind("/forget", Behavior({    onInvoke: function(handler, message){        deviceURL = "";    }}));

var ApplicationBehavior = Behavior.template({    onDisplayed: function(application) {        application.discover("portdevice.project.kinoma.marvell.com");        // application.add(new HomeScreen_({ onOff:"on" }));    },    onQuit: function(application) {        application.forget("portdevice.project.kinoma.marvell.com");    },});

/* APPLICATION */

application.behavior = new ApplicationBehavior();

