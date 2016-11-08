import {
	TMP_SCREEN,	img_logo,	whiteSkin,
	titleText,
	welcome_img_padding,
	welcome_img_size,
	welcome_button_height,
	buttonText,
	DeviceSimulator,
	deviceURL,} from "global_settings";import { 	Button,    ButtonBehavior,    RadioGroup,     RadioGroupBehavior} from 'lib/buttons';

import {
	HomeContentTemplate,
	HomeScreen
} from "home";

var padding = welcome_img_padding;
var size = welcome_img_size;

let enterButtonTemplate = Button.template($ => ({    top: 0, width: 200, right: 0, height: welcome_button_height,    contents: [        Label($, {left: 0, right: 0, height: welcome_button_height, string: $.textForLabel, style: buttonText})    ],    Behavior: class extends ButtonBehavior {        onTap(button){      
        	application.remove(TMP_SCREEN);
        	var HomeContent = HomeContentTemplate({});
        	TMP_SCREEN = new HomeScreen({ HomeContent });
        	application.add(TMP_SCREEN);        }
            }}));var WelcomePageTemplate = Container.template($ => ({     left: 0, right: 0, top: 0, bottom: 0,    skin: $.skin,    contents: [
    	new Column({ 
    		top: padding, bottom: padding,
    		contents: [		    	new Picture({					url: $.img_url,					top: padding, left: padding, right: padding, width: size, height: size,				}),
				new Label({
					string: $.title,
					style: titleText
				}),
				new enterButtonTemplate({textForLabel: "ENTER YOUR HOME"}),
				
			]
		}),    ]}));
/* behavior of connecting the devices */
// connected by port
Handler.bind("/discover", Behavior({    onInvoke: function(handler, message){
    	trace("found the device.\n");        deviceURL = JSON.parse(message.requestText).url;    }}));Handler.bind("/forget", Behavior({    onInvoke: function(handler, message){
    	trace("forget the device.\n");        deviceURL = "";    }}));
var ApplicationBehavior = Behavior.template({    onDisplayed: function(application) {	        application.discover(DeviceSimulator);        // application.add(new HomeScreen({ onOff:"on" }));    },    onQuit: function(application) {        application.forget(DeviceSimulator);    },});

TMP_SCREEN = new WelcomePageTemplate({ skin: whiteSkin, img_url: img_logo, title: "HoM"});
application.behavior = new ApplicationBehavior(); 
application.add(TMP_SCREEN);


