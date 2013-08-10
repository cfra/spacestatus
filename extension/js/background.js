/*
 * SpaceStatus - show hackerspace status in chromium using space api
 * Copyright (C) 2012 Christian Franke <nobody@nowhere.ws>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if ("list" in request) {
			console.log("background: got request for list");
			var req = new XMLHttpRequest();
			req.open("GET", "http://spaceapi.net/directory.json", true);
			req.onload = function() {
				var spaces = JSON.parse(req.responseText);
				response = {"spaces": spaces, "selected": localStorage["spacestatus_url"]};
				console.log("background: sending list response");
				sendResponse(response);
			};
			req.send(null);
			return true; /* this means we will send a response. */
		} else if ("update" in request) {
			console.log("background: got request to update.");
			localStorage["spacestatus_space"] = request.update.space;
			localStorage["spacestatus_url"] = request.update.url;
			spacestatus_update();
			return false; /* no response here. */
		}
	}
);

function spacestatus_readystatechange(req) {
	return function() {
		if (req.readyState != 4) {
			return;
		}

		if (req.status != 200) {
			console.log("request failed.");
			console.log(req);
			chrome.browserAction.setIcon({path: 'img/unknown.png'});
			setTimeout(spacestatus_update, 90000);
			return;
		}

		space_status = undefined;
		try {
			var state = JSON.parse(req.responseText);
			if ("open" in state) {
				if (state.open === true || state.open === "true") {
					space_status = true;
				} else if (state.open === false || state.open === "false") {
					space_status = false;
				}
			}
		} catch(err) {
			console.log(err);
		}

		switch (space_status) {
			case true:
				chrome.browserAction.setIcon({path: 'img/open.png'});
				break;
			case false:
				chrome.browserAction.setIcon({path: 'img/closed.png'});
				break;
			default:
				chrome.browserAction.setIcon({path: 'img/unknown.png'});
				break;
		}
		setTimeout(spacestatus_update, 90000);
	};
}

function spacestatus_update() {
	console.log("sending request for " + localStorage["spacestatus_space"]);
	chrome.browserAction.setIcon({path: 'img/refresh.png'});
	var req = new XMLHttpRequest();
	req.open("GET", localStorage["spacestatus_url"], true);
	req.onreadystatechange = spacestatus_readystatechange(req, false);
	req.send(null);
}

setTimeout(spacestatus_update, 5000);
