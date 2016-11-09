<<<<<<< HEAD
import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';import {	DATA,	save_data,	TMP_SCREEN,	largeText,	whiteSkin,	device_list_item_padding,	device_list_topbar_height,	// lightGraySmallText,	darkGraySmallText} from "global_settings";import {	DeviceScreenTemplate,	DeviceContentTemplate,	DeviceScreen,	DeviceContent} from "device";export var TimingScreen;export var TimingContent;export var TimingScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: whiteSkin,    contents: [        VerticalScroller($, {             active: true, top: 0, bottom: 0,            contents: [                $.TimingContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),    ]}));export var TimingContentTemplate = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [    	new TimingTopBar({idx: $.idx}),    ]}));var TimingTopBar = Container.template($ => ({	// top-bar	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,	height: device_list_topbar_height,	contents: [		new Column( { contents: [			new Line( { contents: [				new BackTemplate({idx: $.idx}),				new Blank(),			] }),			new Label({				string: "TIMING",				style: largeText,			}),		]}),	]}));let BackTemplate = Container.template($ => ({	active: true,	contents: [		new Label({			string: "< BACK",			style: darkGraySmallText,			// top: 50, left: 240, right: home_list_item_padding, width: home_list_topbar_img_size, height: home_list_topbar_img_size,		})	],	behavior: Behavior({		onTouchEnded: function(container) {			save_data(DATA);			application.remove(TMP_SCREEN);			DeviceContent = DeviceContentTemplate({idx: $.idx});        	DeviceScreen = new DeviceScreenTemplate({ DeviceContent });        	TMP_SCREEN = DeviceScreen;        	application.add(TMP_SCREEN);		}	})}));let Blank = Container.template($ => ({	width: 250}));
=======
/* 
 * this is the part where timing screen is implemented; includes:
 * 	Variables:
 *		TimingContent	- an instance of TimingContentTemplate, timing page's content
 *		TimingScreen	- an instance of TimingScreenTemplate, the whole timing page's screen
 *	Functions:
 *		
 * 	Templates:
 *		TimingScreenTemplate - the template of the whole timing screen
 * 			TimingContentTemplate - serves as a parameter of the whole timing screen's template, contains the main contents
 *				TimingTopBar - the title part of the timing screen, contains brief discription & back button
 *					BackTemplate - 	the "< BACK" button on top left of the screen, 
 *									click it to return to "device" page
 *					Blank - used completely as an indentation element
 *				
 * 				
 */

import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';import {	DATA,	save_data,	TMP_SCREEN,	largeText,	whiteSkin,	device_list_item_padding,	device_list_topbar_height,	darkGraySmallText} from "global_settings";import {	DeviceScreenTemplate,	DeviceContentTemplate,	DeviceScreen,	DeviceContent} from "device";

// instance of templates: screen & content
// screen = content + scroller (no topbar / bottombar as nav bar in this case)export var TimingScreen;export var TimingContent;

// the template of screenexport var TimingScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: whiteSkin,    contents: [        VerticalScroller($, {             active: true, top: 0, bottom: 0,            contents: [                $.TimingContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),    ]}));
// the template of main contents in the screenexport var TimingContentTemplate = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [    	new TimingTopBar({idx: $.idx}),    ]}));// the title part of the timing screen (not real topbar, not sticking to the top, will scroll)var TimingTopBar = Container.template($ => ({	// top-bar	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,	height: device_list_topbar_height,	contents: [		new Column( { contents: [			new Line( { contents: [				new BackTemplate({idx: $.idx}),				new Blank(),			] }),			new Label({				string: "TIMING",				style: largeText,			}),		]}),	]}));// the back button "< BACK", click it to go back to device screenlet BackTemplate = Container.template($ => ({	active: true,	contents: [		new Label({			string: "< BACK",			style: darkGraySmallText,		})	],	behavior: Behavior({		onTouchEnded: function(container) {			save_data(DATA);			application.remove(TMP_SCREEN);
			DeviceContent = DeviceContentTemplate({idx: $.idx});
        	DeviceScreen = new DeviceScreenTemplate({ DeviceContent });
        	TMP_SCREEN = DeviceScreen;
        	application.add(TMP_SCREEN);		}	})}));// just for indentationlet Blank = Container.template($ => ({	width: 250}));
>>>>>>> 26626094b195a9df5385bf65fe8dff0fb78f7313
