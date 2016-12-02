/* 
 * this part is the code for welcome page 
 * include:
 * 	WelcomePageTemplate - the welcome screen's template
 *		enterButtonTemplate - the button, clicking it would lead to "home" screen
 *	ApplicationBehavior - the application's behavior of connecting to devices
 *
 */
 
 

import Pins from "pins";

import {
	TMP_SCREEN,
	img_logo,
	skins,
	texts,
	welcome_img_padding,
	welcome_img_size,
	welcome_button_height,
	DeviceSimulator,
	deviceURL,
	load_data,
	DATA,
	remotePins,
} from "global_settings";

import { 
	Button,
    ButtonBehavior,
    RadioGroup, 
    RadioGroupBehavior
} from 'lib/buttons';

import {
	HomeContentTemplate,
	HomeScreenTemplate,
	HomeContent,
	HomeScreen,
	LoadHomeContent,
} from "home";

var padding = welcome_img_padding;
var size = welcome_img_size;

// the devices' data
DATA = load_data();

// the button to enter the home page
let enterButtonTemplate = Button.template($ => ({
    top: 0, width: 200, /*right: 0,*/ height: welcome_button_height,
    contents: [
        Label($, {left: 0, right: 0, top: 2, height: welcome_button_height, string: $.textForLabel, style: texts.welcome.button})
    ],
    Behavior: class extends ButtonBehavior {
        onTap(button){      
        	application.remove(TMP_SCREEN);
        	HomeContent = HomeContentTemplate({});
        	LoadHomeContent(HomeContent);
        	HomeScreen = new HomeScreenTemplate({ HomeContent });
        	TMP_SCREEN = HomeScreen;
        	application.add(TMP_SCREEN);
        }
        
    }
}));

// the welcome page main content
export var WelcomePageTemplate = Container.template($ => ({ 
    left: 0, right: 0, top: 0, bottom: 0,
    skin: $.skin,
    contents: [
    	new Column({ 
    		top: padding, bottom: padding,
    		contents: [
		    	new Picture({
					url: $.img_url,
					top: padding, left: padding, right: padding, width: size, height: size,
				}),
				/*new Label({
					string: $.title,
					style: texts.welcome.title
				}),*/
				new enterButtonTemplate({textForLabel: "ENTER YOUR HOME"}),
				
			]
		}),
    ]
}));

/* behavior of connecting the devices */
// connected by port
Handler.bind("/discover", Behavior({
    onInvoke: function(handler, message){
    	trace("found the device.\n");
        deviceURL = JSON.parse(message.requestText).url;
    }
}));
Handler.bind("/forget", Behavior({
    onInvoke: function(handler, message){
    	trace("forget the device.\n");
        deviceURL = "";
    }
}));
// will be used to communicate between device and the companion application
var ApplicationBehavior = Behavior.template({
    onDisplayed: function(application) {
    	// json	
        application.discover(DeviceSimulator);
        // Pins
        let discoveryInstance = Pins.discover(            connectionDesc => {                if (connectionDesc.name == "pins-share-HoM") {                    trace("Application side: connecting to remote pins\n");                    remotePins = Pins.connect(connectionDesc);                }            },             connectionDesc => {                if (connectionDesc.name == "pins-share-HoM") {                    trace("Application side: disconnected from remote pins\n");                    remotePins = undefined;                }            }        );
    },
    onQuit: function(application) {
    	// json
        application.forget(DeviceSimulator);
    },
});

// initialize the welcome screen
TMP_SCREEN = new WelcomePageTemplate({ skin: skins.background.welcome, img_url: img_logo, title: "HoM"});
application.behavior = new ApplicationBehavior(); 
application.add(TMP_SCREEN);


