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
	NOTIFICATIONS,
	David_frontdoor,
	David_backdoor,
	Susan_frontdoor,
	Susan_backdoor,
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

import {
	NotificationsContent,	NotificationsScreen,
	NotificationsContentTemplate,
	NotificationsScreenTemplate,
	LoadNotificationsContent,
	UpdateNotificationsContent,
} from "notifications";

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
        	// Pins
        	// invoke
        	application.distribute("onReceiveNotifications");
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
        let discoveryInstance = Pins.discover(            connectionDesc => {                if (connectionDesc.name == "pins-share-HoM") {                    trace("Application side: connecting to remote pins\n");                    remotePins = Pins.connect(connectionDesc);
                    remotePins.invoke("/David_frontdoor/read", result => {
                    	David_frontdoor = result;
                    });
                    remotePins.invoke("/David_backdoor/read", result => {
                    	David_backdoor = result;
                    });
                    remotePins.invoke("/Susan_frontdoor/read", result => {
                    	Susan_frontdoor = result;
                    });
                    remotePins.invoke("/Susan_backdoor/read", result => {
                    	Susan_backdoor = result;
                    });                }            },             connectionDesc => {                if (connectionDesc.name == "pins-share-HoM") {                    trace("Application side: disconnected from remote pins\n");                    remotePins = undefined;                }            }        );
        // invoke
        // application.distribute("onReceiveNotifications");
    },
    onQuit: function(application) {
    	// json
        application.forget(DeviceSimulator);
    },
    // Pins
    onReceiveNotifications: function(application) {
    	// remember to change the mode on simulator side manually before start!
    	if (remotePins) {
	    	remotePins.repeat("/David_frontdoor/read", 100, result => 
	    		{
	    			// trace(result + "==(?)" + David_frontdoor + "\n");
	    			// DATA.init[DATA.init.length] = newDeviceData[SELECTED];
	    			if (result != David_frontdoor) { // onChange
	    				/*
		    			var len = NOTIFICATIONS.length;
		    			NOTIFICATIONS[len] = {
		    				kid_name: "David",
		    				state: 0,
		    			};
		    			*/
		    			NOTIFICATIONS.unshift({
		    				kid_name: "David", 							// state: 0, 							action: result,							door_name: "front door",
							done: false
		    			});
		    			// trace(NOTIFICATIONS[0].kid_name + " " + NOTIFICATIONS[0].door_name + "\n"); // debug
		    			David_frontdoor = result;
		    			if (NotificationsContent) {
		    				UpdateNotificationsContent(NotificationsContent);
		    			}		
	    			}
	    			// trace("kid name" + NOTIFICATIONS[len].kid_name + "\n");
	    		}
	    	);
	    	remotePins.repeat("/David_backdoor/read", 100, result => 
	    		{
	    			if (result != David_backdoor) { // onChange
		    			NOTIFICATIONS.unshift({
		    				kid_name: "David", 							// state: 0, 							action: result,							door_name: "back door",
							done: false
		    			});
		    			// trace(NOTIFICATIONS[0].kid_name + " " + NOTIFICATIONS[0].door_name + "\n"); // debug
		    			David_backdoor = result;
		    			if (NotificationsContent) {
		    				UpdateNotificationsContent(NotificationsContent);
		    			}		
	    			}
	    		}
	    	);
	    	// Susan
	    	remotePins.repeat("/Susan_frontdoor/read", 100, result => 
	    		{
	    			if (result != Susan_frontdoor) { // onChange
		    			NOTIFICATIONS.unshift({
		    				kid_name: "Susan", 							// state: 0, 							action: result,							door_name: "front door",
							done: false
		    			});
		    			// trace(NOTIFICATIONS[0].kid_name + " " + NOTIFICATIONS[0].door_name + "\n"); // debug
		    			Susan_frontdoor = result;
		    			if (NotificationsContent) {
		    				UpdateNotificationsContent(NotificationsContent);
		    			}		
	    			}
	    			// trace("kid name" + NOTIFICATIONS[len].kid_name + "\n");
	    		}
	    	);
	    	remotePins.repeat("/Susan_backdoor/read", 100, result => 
	    		{
	    			if (result != Susan_backdoor) { // onChange
		    			NOTIFICATIONS.unshift({
		    				kid_name: "Susan", 							// state: 0, 							action: result,							door_name: "back door",
							done: false
		    			});
		    			// trace(NOTIFICATIONS[0].kid_name + " " + NOTIFICATIONS[0].door_name + "\n"); // debug
		    			Susan_backdoor = result;
		    			if (NotificationsContent) {
		    				UpdateNotificationsContent(NotificationsContent);
		    			}		
	    			}
	    		}
	    	);
	    
    	}
    	else {
    		trace("warning: can't receive remote Pins, please check your connection\n");
    	}
    }
});

// initialize the welcome screen
TMP_SCREEN = new WelcomePageTemplate({ skin: skins.background.welcome, img_url: img_logo, title: "HoM"});
application.behavior = new ApplicationBehavior(); 
application.add(TMP_SCREEN);


