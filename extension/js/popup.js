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

chrome.extension.sendMessage({"list": null}, function(space_info) {
	document.body.removeChild(document.getElementById("loader"));

	var spaces = space_info.spaces;
	for (var space in spaces) {
		var node = document.createElement("p");
		node.innerText = space;
		if (spaces[space] == space_info.selected)
			node.setAttribute("class", "selected")
		node.onclick = spaceClicked(spaces, space);
		document.body.appendChild(node);
	}
});

function spaceClicked(spaces, space){
	return function() {
		url = spaces[space];
		chrome.extension.sendMessage({
			"update": {
				"url": url,
				"space": space
			}
		});
		window.close();
	};
}
