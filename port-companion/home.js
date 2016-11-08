import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,
    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';

import {
	img_home,
	img_fave,
	img_note,
	img_sett,
	hintText,
	midText,
	smallText,
	largeText,
	BAR_HEIGHT_TOP,
	BAR_HEIGHT_BOTTOM,
	whiteSkin,
	lightGraySkin,
	darkGraySkin,
	home_list_topbar_height,
	home_list_item_height,
	home_list_item_padding,
	home_list_tag_width,
	bottom_bar_padding,
	bottom_bar_img_size,
} from "global_settings"


let titleStyle = new Style({ font: "20px", color: "white" });
export var HomeScreen = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,
    skin: whiteSkin,    contents: [        VerticalScroller($, {             active: true, top: BAR_HEIGHT_TOP, bottom: BAR_HEIGHT_BOTTOM,            contents: [                $.HomeContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),
        // top bar
        /*        new Container({             top: 0, height: BAR_HEIGHT_TOP, left: 0, right: 0, skin: darkGraySkin,            style: titleStyle,             contents: [                new Label({ string: "HoM" }),            ]        }),
        */
        // bottom
        new Line({             bottom: 0, height: BAR_HEIGHT_BOTTOM, left: 0, right: 0, skin: lightGraySkin,             style: titleStyle,             contents: [                // new Label({ string: "Bottom Bar" }),
                new iconTemplate({icon_img: img_home, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "home", activate: true}),
                new iconTemplate({icon_img: img_fave, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "favorites", activate: false}),
                new iconTemplate({icon_img: img_note, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "notifications", activate: false}),
                new iconTemplate({icon_img: img_sett, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "settings", activate: false}),            ]        }),    ]}));

var iconTemplate = Column.template($ => ({ 
	top: 0, left: 0, right: 0,
	contents: [
		new Picture({			url: $.activate? $.icon_img.activated: $.icon_img.idel,			top: $.padding, left: $.padding, right: $.padding, width: $.size, height: $.size,		}),
		new Label({
			string: $.hint,
			style: hintText,
		}),
	],
	//bahavior
}));

export let HomeContentTemplate = Column.template($ => ({     top: 0, left: 0, right: 0,    contents: [
    	// title
    	new HomeTopBar(),
    	// device list
    	new DeviceItemTemplate({ DeviceName: "Night Light", DeviceGroup: "David's Room", id: "night_light", type: "binary" }),
    	new DeviceItemTemplate({ DeviceName: "Front Door", DeviceGroup: "Home", id: "front_door", type: "binary" }),
    	new DeviceItemTemplate({ DeviceName: "Oven", DeviceGroup: "Kittchen", id: "oven", type: "binary" }),    ]}));

var HomeTopBar = Container.template($ => ({
	// top-bar
	top: home_list_item_padding, left: home_list_item_padding, right: home_list_item_padding, bottom: home_list_item_padding,
	height: home_list_topbar_height,
	contents: [
		new Label({
			string: "My Home",
			style: largeText,
		}),
	]
}));

export var DeviceItemTemplate = Line.template($ => ({
	top: home_list_item_padding, left: home_list_item_padding, right: home_list_item_padding, bottom: home_list_item_padding, 
	height: home_list_item_height,
	skin: lightGraySkin,
	contents: [
		new Column ({
			left: home_list_item_padding,
			width: home_list_tag_width,
			contents: [
				new Label({
					string: $.DeviceName,
					style: midText,
				}),
				new Label({
					string: $.DeviceGroup,
					style: smallText,
				}),
			]
		}),
		
		new Column ({
			top: home_list_item_padding, left: home_list_item_padding, right: home_list_item_padding, bottom: home_list_item_padding, 
			contents: [
				new Picture({					url: "./assets/button_off.png",					// top: $.padding, left: $.padding, right: $.padding, width: $.size, height: $.size,				}),
			],
		}),
	],
	type: $.type,
	name: $.id,
}));

