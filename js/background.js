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
		spacestatus_update();
	}
);

function spacestatus_readystatechange(req, proxied) {
	return function() {
		if (req.readyState != 4) {
			console.log("request still running");
			return;
		}

		if (req.status != 200) {
			if (proxied) {
				console.log("giving up");
				settimeout(spacestatus_update, 900000);
				return;
			}

			console.log("request failed. retrying with proxy");
			req2 = new XMLHttpRequest();
			req2.onreadystatechange = spacestatus_readystatechange(req2, true);
			req2.open("POST", "http://hackerspaces.me/proxy", true);
			req2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			req2.send('url=' + encodeURIComponent(localStorage["spacestatus_url"]));
			return;
		}

		console.log("received response");
		console.log(req);
		var state = JSON.parse(req.responseText);
		if (proxied)
			state = state.body;

		if (state.open === true) {
			console.log("space is open");
			chrome.browserAction.setIcon({path: 'img/open.png'});
		} else if (state.open === false) {
			console.log("space is closed");
			chrome.browserAction.setIcon({path: 'img/closed.png'});
		} else {
				console.log("space is undefined");
				chrome.browserAction.setIcon({path: 'img/unknown.png'});
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
