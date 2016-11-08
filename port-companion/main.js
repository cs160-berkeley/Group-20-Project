import {
	TMP_SCREEN,	img_logo,	whiteSkin,
	titleText,
	welcome_img_padding,
	welcome_img_size,
	welcome_button_height,
	buttonText,} from "global_settings";import { 	Button,    ButtonBehavior,    RadioGroup,     RadioGroupBehavior} from 'lib/buttons';

import {
	HomeScreen
} from "home";

var padding = welcome_img_padding;
var size = welcome_img_size;

let enterButtonTemplate = Button.template($ => ({    top: 0, width: 200, right: 0, height: welcome_button_height,    contents: [        Label($, {left: 0, right: 0, height: welcome_button_height, string: $.textForLabel, style: buttonText})    ],    Behavior: class extends ButtonBehavior {        onTap(button){      
        	application.remove(TMP_SCREEN);
        	TMP_SCREEN = new HomeScreen({ onOff:"on" });
        	application.add(TMP_SCREEN);        }
            }}));var WelcomePageTemplate = Container.template($ => ({     left: 0, right: 0, top: 0, bottom: 0,    skin: $.skin,    contents: [
    	new Column({ 
    		top: 0,
    		contents: [		    	new Picture({					url: $.img_url,					top: padding, left: padding, right: padding, width: size, height: size,				}),
				new Label({
					string: $.title,
					style: titleText
				}),
				new enterButtonTemplate({textForLabel: "ENTER YOUR HOME"}),
				
			]
		}),    ]}));
TMP_SCREEN = new WelcomePageTemplate({ skin: whiteSkin, img_url: img_logo, title: "HoM"});
application.add(TMP_SCREEN);