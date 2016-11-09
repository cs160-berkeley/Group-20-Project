import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow} from 'lib/scroller';

import {
	save_data,
	load_data,
	whiteSkin,
	lightGraySkin,
	labelStyle,
	padding,
	height,
	height_label,
	width_label
} from "global_settings";

let darkGraySkin = new Skin({ fill: "#202020" });let titleStyle = new Style({ font: "20px", color: "white" });
var DATA;
var LEN;let MainContainer = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,
    skin: whiteSkin,    contents: [        VerticalScroller($, {             active: true, top: 25, bottom: 0,            contents: [                $.mainContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),        new Container({             top: 0, height: 25, left: 0, right: 0, skin: darkGraySkin,             style: titleStyle,             contents: [                new Label({ string: "Device Simulator" }),            ]        })    ]}));

let contentTemplate = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [
    	// wait to be filled automatically at runtime    ]}));

let deviceItemTemplate = Line.template($ => ({
	top: padding, bottom: padding, left: padding, right: padding,
	height: height,
	skin: lightGraySkin,
	contents: [
		new Label({
			left:	0, right:	0, 
			height:	height_label, 
			width: 	width_label,
			string:	$.label, 
			style: 	labelStyle,
			name:	"label",
		}),
		new Label({
			left:0, right:0, 
			height:	height_label, 
			width: 	width_label,
			string:	$.value, 
			style: 	labelStyle,
			name:	"value"
		}),
	]
}));

function getLabel(label, type) {
	return label
}

function getValue(value, type) {
	if (type == "binary") {
		return value? "on": "off";
	}
	else if (type == "lock") {
		return value? "unlocked": "locked";
	}
	return value
}

function updateData(container) {
	DATA = load_data();
	LEN = DATA.init.length;
	for (var i = 0; i < LEN; i++) {
		var item_data = DATA.init[i];
		var item_label = item_data.DeviceName;
		var item_value = item_data.value;
		var item_type = item_data.type;
		var str_label = getLabel(item_label, item_type);
		var str_value = getValue(item_value, item_type);
		var item = new deviceItemTemplate(
			{
				label: str_label, 
				value: str_value,
			}
		);
		container.add(item);
	}
	save_data(DATA);
}


let mainContent = new contentTemplate();
updateData(mainContent);
let mainScreen = new MainContainer({ mainContent });application.add(mainScreen);