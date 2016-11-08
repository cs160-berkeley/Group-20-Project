import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,
    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';

import {
	TMP_SCREEN,
	largeText,
	whiteSkin,
	device_list_item_padding,
	device_list_topbar_height
} from "global_settings";

export var DeviceScreen;
export var DeviceContent;export var DeviceScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,
    skin: whiteSkin,    contents: [        VerticalScroller($, {             active: true, top: 0, bottom: 0,            contents: [                $.DeviceContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),    ]}));

export var DeviceContentTemplate = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [
    	new DeviceTopBar(),        ['#1ACC45', '#79FFBF', '#FF6F3A', '#998060', '#CC7E1A'].map(color =>             new Container({ top: 0, height: 120, left: 0, right: 0,             skin: new Skin({ fill: color }) }))    ]}));

var DeviceTopBar = Container.template($ => ({
	// top-bar
	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,
	height: device_list_topbar_height,
	contents: [
		new Label({
			string: "Device XYZ",
			style: largeText,
		}),
		/*
		new Line({			
			contents: [
				//
				new AddDeviceTemplate({}),
			]
		}),
		*/
	]
}));
