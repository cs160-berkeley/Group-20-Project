/*
 *     Copyright (C) 2010-2016 Marvell International Ltd.
 *     Copyright (C) 2002-2010 Kinoma, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
var whiteSkin = new Skin( { fill: "white" } );var labelStyle = new Style( { font: "bold 40px", color: "black" } );var onOff = "off";
var count = "on";
var fd_count = "on";
var ov_count = "on";var counterLabel = new Label({ left:0, right:0, height:40, string:"on", style: labelStyle });
var frontdoorLabel = new Label({ left:0, right:0, height:40, string:"on", style: labelStyle });
var ovenLabel = new Label({ left:0, right:0, height:40, string:"on", style: labelStyle });trace("PORT DEVICE");var mainColumn = new Column({    left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,    contents: [        new Label({left:0, right:0, height:40, string:"Light:", style: labelStyle}),        counterLabel,
        new Label({left:0, right:0, height:40, string:"Front Door:", style: labelStyle}),
        frontdoorLabel,
        new Label({left:0, right:0, height:40, string:"Oven:", style: labelStyle}),
        ovenLabel,    ]});

var MainContainer = Container.template($ => ({     left: 0, right: 0, top: 0, bottom: 0,     skin: new Skin({ fill: 'white',}),     contents: [        Label($, {             left: 0, right: 0,             style: new Style({ color: 'black', font: '46px' }),             behavior: Behavior({                onAnalogValueChanged: function(content, result) {                    content.string = result;                },            }),            string: '- - -',         }),    ]}));

Handler.bind("/getCount", Behavior({    onInvoke: function(handler, message){
    	if(count == "off") {
    		count = "on";
    	} else {
    		count = "off";
    	}
    	trace("HELLO WORLD");        counterLabel.string = count;        message.responseText = JSON.stringify( { count: count } );        message.status = 200;    }}));

Handler.bind("/getFrontDoor", Behavior({    onInvoke: function(handler, message){
    	if(fd_count == "off") {
    		fd_count = "on";
    	} else {
    		fd_count = "off";
    	}
    	trace("HELLO WORLD");        frontdoorLabel.string = fd_count;        message.responseText = JSON.stringify( { fd_count: fd_count } );        message.status = 200;    }}));

Handler.bind("/getOven", Behavior({    onInvoke: function(handler, message){
    	if(ov_count == "off") {
    		ov_count = "on";
    	} else {
    		ov_count = "off";
    	}
    	trace("HELLO WORLD");        ovenLabel.string = ov_count;        message.responseText = JSON.stringify( { ov_count: ov_count } );        message.status = 200;    }}));class ApplicationBehavior extends Behavior {    onLaunch(application) {        application.shared = true;        application.add(mainColumn);    }    onQuit(application) {        application.shared = false;    }}application.behavior = new ApplicationBehavior();