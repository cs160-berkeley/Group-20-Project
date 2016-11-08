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
var whiteSkin = new Skin( { fill: "white" } );
var count = "on";
var fd_count = "on";
var ov_count = "on";
var frontdoorLabel = new Label({ left:0, right:0, height:40, string:"on", style: labelStyle });
var ovenLabel = new Label({ left:0, right:0, height:40, string:"on", style: labelStyle });
        new Label({left:0, right:0, height:40, string:"Front Door:", style: labelStyle}),
        frontdoorLabel,
        new Label({left:0, right:0, height:40, string:"Oven:", style: labelStyle}),
        ovenLabel,

var MainContainer = Container.template($ => ({ 


    	if(count == "off") {
    		count = "on";
    	} else {
    		count = "off";
    	}
    	trace("HELLO WORLD");

Handler.bind("/getFrontDoor", Behavior({
    	if(fd_count == "off") {
    		fd_count = "on";
    	} else {
    		fd_count = "off";
    	}
    	trace("HELLO WORLD");

Handler.bind("/getOven", Behavior({
    	if(ov_count == "off") {
    		ov_count = "on";
    	} else {
    		ov_count = "off";
    	}
    	trace("HELLO WORLD");