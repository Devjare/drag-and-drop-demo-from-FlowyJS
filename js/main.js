// TODO: LOOK ANOTHER FORMAT FOR THE CHAINNED BOX DATA
// TODO: WHEN REARRANGE, IT ALSO SHOULD BE REARRENGED IN DATA OBJECT

var rootMoved = false;
var dataObject = {
	id: "root",
	boxid: 0,
	type: "root",
	name: "root",
	root: true,
	children: []
};
// TODO: TRY CHANGING THE DATAOBJECT TO AN ARRAY, SO IT COULD BE FASTER
// TO REARRANGE DATA WHEN BOXES CHANGE PARENT.
// var dataArray = {
// 	{
// 		id: "root",
// 		boxid: 0,
// 		type: "root",
// 		name: "root",
// 		parent: -1
// 	}
// };
var data = [
{
	id: "s-1",
	name: "SERVICE 1",
	desc: `This service is in charge of doing the math behind the 
	calculus implied on the service #2 for image processing.`,
	params: {
		paramstr: '',
		paramnbmr: 0,
		parambool: !0
	},
	html: `<form class="container"><div class="form-group row m-2"><label for="txttype" 
	class="col-sm-2 col-form-label col-form-label-sm">Text: </label><div class="col-sm-10">
	<input id="paramstr" type="text" class="form-control form-control-sm" value="SoyUnInput">
	</div></div><div class="form-group row m-2"><label for="ntype" class="col-sm-2 col-form-label 
	col-form-label-sm">Number: </label><div class="col-sm-10"><input id="paramnbmr" type="number" 
	class="form-control form-control-sm" value="SoyUnInput"></div></div><div class="form-check 
	ml-4"><input class="form-check-input" type="checkbox" id="parambool"><label 
	class="form-check-label" for="parambool">Remember me</label></div></form>`
},
{
	id: "s-2",
	name: "SERVICE 2",
	desc: "this is sservice does some things",
	params: { paramnbmr: 0, paramlist: [] },
	html: `<form class="container"><div class="form-group row m-2"><label for="ntype" 
	class="col-sm-2 col-form-label col-form-label-sm">Number: </label><div class="col-sm-10">
	<input id="paramnbmr" type="number" class="form-control form-control-sm" value="SoyUnInput">
	</div></div><div class="container"><h4>List 1</h4><ul id="paramlist" class="list-group"><li id="app-name-0" 
	class="list-group-item">li 2</li><li  id="app-name-1" class="list-group-item">li 1</li><li 
	id="app-name-2" class="list-group-item">li 3</li></ul></div><div class="container"><h4>List 1</h4><ul 
	id="list" class="list-group container"><li id="lix" class="list-group-item">li 4</li><li id="liy" class="list-group-item">li 5
	</li><li id="liz" class="list-group-item">li 6</li></ul></div><script type="text/javascript">
	$('#paramlist').sortable({group: 'mygroup1',animation: 350,});$('#list').sortable({group: 
		{name: 'mygroup1',pull: 'clone'},animation: 350,});</script>`
	}];

	$(document).ready(function(e) {

	// data contains the static values for the 'services'
	demoflowy_createBoxes(2, data);
	// init flowy
	flowy(document.getElementById("canvas"), demoflowy_drag, demoflowy_release, 
		demoflowy_snapping, demoflowy_rearranging, 100, 100, demoflowy_onBlockChange);

	var popoverShow = false;
	var canvasElementsCount = 1;
	var tempblock2;

	$('#output').click((e) => { console.log(dataObject); });
	$('#foutput').click((e) => { console.log(flowy.output()); });
	$('#canvas').on('mousedown', '#root', (e) => { rootMoved = true;});
	$('#canvas').on('mouseup', '#root', (e) => { rootMoved = false;});
	// Modal buttons actions
	$('#btnSave').click(demoflowy_saveChanges);
	$('#btnClose').click((e) => { demoflowy_closeModal(); })
	// Show/hide all popovers
	$('#gralInfo').click(function(event) {
		if(popoverShow) {
			$('[data-toggle="popover"]').popover('hide');
			$('[data-toggle="popover"]').popover('disable');
			popoverShow = false;
		} else {
			$('[data-toggle="popover"]').popover('enable');
			$('[data-toggle="popover"]').popover('show');
			popoverShow = true;
		}});
	// when modal is hidden, remove all input fields
	$('#modal').on('hidden.bs.modal', (e) => {
		// remove params fields from modal
		$("#modalBody").empty();
	});
	// adding the dblclick event before elements are added, to avoid
	// using the observer
	$('#canvas').on('dblclick', '.blockelem:not(#root)', (e) => {
		demoflowy_showModalFromId(e.currentTarget.id);
	});

	function demoflowy_snapping(drag, first, parent) {

		var id = drag.getAttribute("type");
		var name = drag.getAttribute("name");
		var canvasId = "c" + canvasElementsCount + "-" + id;
		var params = data.find(s => s.id == id).params;
		var idParent = parent.getAttribute("id");
		var header = drag.querySelector(".card-header");
		var body = drag.querySelector(".card-body");
		var footer = drag.querySelector(".card-footer");

		header.parentNode.classList.remove('m-3');
		header.parentNode.removeChild(header);
		body.parentNode.removeChild(body);
		footer.parentNode.removeChild(footer);		

		drag.classList.add('position-absolute');

		bcontent = `<div type="${id}" id="${canvasId}" class="card c-block" 
		${canvasElementsCount == 1 ? `data-toggle="popover" data-trigger="focus" data-title="SERVICE BOX" 
		data-content="Para modificar los parametros, presionar el boton editar o dar doble click sobre la caja, para eliminar, arrastra y suelta la caja en cualquier parte del panel"`: ""}>
		<div class="card-header py-1 px-3 text-center bg-primary text-white">${canvasId}
		</div><div class="card-body py-2 px-4"><div class="card-text">`

		for(let p in params) {
			bcontent += `<strong>${p}</strong>:`
			if(Array.isArray(params[p])) {
				bcontent += `<ul id="${id}-ul" class="list-group my-2">`
				params[p].forEach(p => {
					bcontent += `<li id="${p.id}" class="list-group-item">${p.name}</li>`;
				});
				bcontent += `</ul>`;
			} else {
				bcontent += `<label class="text-danger">${params[p]}</label><br>`;
			}
		}

		bcontent += `</div></div><div class="card-footer bg-dark text-white">
		<div class="row"><div class="col m-0 px-1"><button onclick="demoflowy_btnEditarClick(event)" class="btn btn-success btn-sm btn-block">
		Editar</button></div></div></div></div>`;

		// add element to parent in dataObject
		console.log('looking for: ', idParent);
		demoflowy_lookForParent(idParent).children
		.push({
			id: canvasId,
			boxid: canvasElementsCount,
			type: id,
			name: name,
			root: false,
			params: JSON.parse(JSON.stringify(params)),
			children: [],
			html: data.find(s => s.id === id).html
		});

		drag.innerHTML += bcontent;
		drag.setAttribute("id", canvasId);
		
		canvasElementsCount++;

		return true;
	}

	function demoflowy_drag(block) {
		block.classList.add("blockdisabled");
		tempblock2 = block;
	}
	function demoflowy_release() {
		// add disabled effect to box
		if (tempblock2) tempblock2.classList.remove("blockdisabled");
	}
	function demoflowy_rearranging(block, parent) { 
		console.log('rearranging, block: ', block, ' parent: ', parent);
		demoflowy_removeChild(block.id);
		canvasElementsCount--;
		return false; 
	}

	var lastChanges = undefined;
	var justReassigned = false;

	function demoflowy_onBlockChange(type) {
		console.log('type: ', type);
		if(type == 'add') {
			lastChanges = [...flowy.output().blockarr]
			.map(c => { return { id: c.id, parent: c.parent }})
			.sort((a, b) => a.id - b.id);
		} else if(type == 'reasign') {
			// justReassigned = true;
			console.log('reasing block');
			// only a copy, jic
			let changes = [...flowy.output().blockarr]
			.map(c => { return { id: c.id, parent: c.parent }})
			.sort((a, b) => a.id - b.id);

			console.log('last changes: ', lastChanges);

			// get only the elements that have changed.
			var realchanges = demoflowy_getRealChanges(changes, lastChanges);
			console.log('real changes: ', realchanges);
			lastChanges = changes;

			if(realchanges.length < 1) {
				console.log('nothing changed!');
			} else {
				console.log('there was some changes');
				realchanges.forEach(c => {
					console.log('c: ', c);
					let newparent = demoflowy_lookForParentWithBoxId(c.parent);
					// make a copy of the child, cuz it is removed after this
					console.log('looking for: ', c.id);
					let chlidFound = demoflowy_lookForParentWithBoxId(c.id);
					let child = JSON.parse(JSON.stringify(chlidFound));

					let deleted = demoflowy_removeChildWithBoxId(c.id);
					if(deleted) {
						console.log('child removed');
					} else {
						console.log('nothing removed');
					}
					console.log('new parent: ', newparent, ' for child: ', child);
					newparent.children.push(child);
					console.log('new do: ', dataObject);
				});
			}
		}
	}
});

function demoflowy_lookForParentWithBoxId(id) {
	var children = arguments[1] ? arguments[1] : dataObject.children;
	var parent = null;
	if (id == dataObject.boxid) parent = dataObject;
	else {
		parent = children.find(child => child.boxid == id);
		if(parent === undefined) {
			for(let i = 0; i < children.length;i++) {
				if(children[i].children.length > 0) {
					parent = demoflowy_lookForParentWithBoxId(id, children[i].children);
					if (parent !== null && parent !== undefined) return parent;
				}
			}
		}
	}
	return parent;
}

function demoflowy_removeChildWithBoxId(id) {
	var children = arguments[1] ? arguments[1] : dataObject.children;
	var deleted = false;

	for(let i = 0;i < children.length;i++) {
		if(children[i].boxid == id) {
			children.splice(i, 1);
			deleted = true;
			break;
		} else if(children[i].children.length > 0) {
			deleted = demoflowy_removeChildWithBoxId(id, children[i].children);
		}
	}
	return deleted;
}

function demoflowy_getRealChanges(arr1, arr2) {
	var changes = [];
	console.log('arr1: ', arr1);
	console.log('arr2: ', arr2);

	// if(arr1.length > arr2.length) arr2.push(arr1[arr1.length - 1]);
	// else if(arr2.length > arr1.length) arr1.push(arr1[arr2.length - 1]);
	for(let i = 0;i < arr1.length;i++) {
		// are not the same if the parent changed
		console.log(`arr1[${i}]: `, arr1[i]);
		console.log(`arr2[${i}]: `, arr2[i]);
		if(arr1[i].parent !== arr2[i].parent) {
			// look for the changes and return those only
			changes.push(arr1[i]);
		}
	}
	return changes;
}

function demoflowy_closeModal() {
	$('#modal').modal('hide');
}

// Remove child with id from dataObject
function demoflowy_removeChild(id) {
	if(rootMoved) return;
	var children = arguments[1] ? arguments[1] : dataObject.children;
	var deleted = false;

	for(let i = 0;i < children.length;i++) {
		if(children[i].id == id) {
			children.splice(i, 1);
			deleted = true;
			break;
		} else if(children[i].children.length > 0) {
			deleted = demoflowy_removeChild(id, children[i].children);
		}
	}
	return deleted;
}

function demoflowy_createBoxes(n, boxData) {
	for (let i = 0; i < n; i++) {

		let id = boxData[i].id;
		let name = boxData[i].name;
		let desc = boxData[i].desc;
		let type = boxData[i].id

		var box = 
		`<div type="${type}" id="${id}" name="${name}" class="card m-3 create-flowy blockelem noselect border border-primary">
		<div class="card-header bg-primary text-white d-flex justify-content-between p-2">${name}</div>
		<div class="card-body text-center p-2">${desc}</div>
		<div class="card-footer p-1 text-center bg-dark text-white">id: ${id}</div></div>`;

		$('#blocklist').append(box);
	}
	ml = $('#canvas').width() / 2;
	mt = $('#canvas').height() / 10;

	root = `<div id="root" name="SERVICE 1" class="blockelem noselect card block position-absolute border border-primary"
	data-toggle="popover" data-trigger="focus" data-title="Caja ROOT" data-content="La caja root, no se puede modificar ni eliminar."
	style="left: ${ml}px; top: ${mt}px;">
	<input type="hidden" name="blockid" class="blockid" value="0">
	<div id="root" class="card c-block">
	<div class="card-header py-1 px-3 bg-primary text-white text-center">ROOT</div>
	<div class="card-body py-4 px-4">
	<div class="card-text"><strong>DATA SOURCE</strong></div></div>
	<div class="card-footer bg-dark text-white"></div></div></div>`;
	$('#canvas').append(root);
}

function demoflowy_btnEditarClick(event) {
	closestCard = event.target.closest('.card');
	demoflowy_showModalFromId(closestCard.id);
}

function demoflowy_showModalFromId(canvasId) {
	$("#modal").data("sourceId", canvasId);
	let parent = demoflowy_lookForParent(canvasId);

	$('#modalBody').append(parent.html);
	$('#modalBody').ready(function($) {
		console.log('modal ready!');
		let bodyInputs = $('#modalBody input:not(.blockid):not(.arrowid)');
		let bodyLists = $('#modalBody li');

		// first, add the current html to let the list, if there's any, as
		// it was the last time it was modified.
		$(`#modalBody`).html(parent.html);
		for(let p in parent.params) {
			// then check the type of each param of the object, and assign its value to
			// its correspondent input on the modal form.
			let type = typeof(parent.params[p]);
			if(['string', 'number', 'boolean'].includes(type)) {
				if(type == 'boolean') $(`#modalBody #${p}`)[0].checked = parent.params[p];
				else $(`#modalBody #${p}`)[0].value = parent.params[p];
			} 
		}
	});

	// SHOW MODAL
	$('#modal').modal('show');
	$('#modalTitle').text(`${$('#modal').data('sourceId')}`);
}

function demoflowy_lookForParent(parentId) {
	var children = arguments[1] ? arguments[1] : dataObject.children;
	var parent = null;
	if (parentId == dataObject.id) parent = dataObject;
	else {
		parent = children.find(child => child.id == parentId);
		if(parent === undefined) {
			for(let i = 0; i < children.length;i++) {
				if(children[i].children.length > 0) {
					parent = demoflowy_lookForParent(parentId, children[i].children);
					if (parent !== null && parent !== undefined) return parent;
				}
			}
		}
	}
	return parent;
}

function demoflowy_saveChanges(e) {
	var id = $('#modal').data('sourceId');
	var parent = demoflowy_lookForParent(id);
	var inputs = $('input');
	var fulltext = '';

	for(let p in parent.params) {
		let input = $(`#${p}`)[0];
		console.log('input: ', $(`#${p}`));
		let tagname = input.tagName;

		fulltext += `<strong>${p}:</strong>: `;

		if(tagname == 'UL') {
			// emtpy the array before adding the new list order
			parent.params[p] = [];
			let children = Array.from(input.childNodes)
			.filter(c => c.nodeType == Node.ELEMENT_NODE);
			
			fulltext += `<ul class="list-group my-2">`;
			children.forEach(el => {
				let id = el.id;
				let text = el.innerHTML;
				fulltext += `<li id="${id}" class="list-group-item">${text}</li>`;
				
				parent.params[p].push({id: id, text: text});
			});
			fulltext += `</ul>`;
		} else {
			let value = input.value;
			let type = input.type;
			console.log('value: ', value);
			console.log('type: ', type);

			if(type == 'checkbox') parent.params[p] = input.checked;
			else if(value === "") parent.params[p] = "";
			else if(!isNaN(value)) parent.params[p] = Number(value);
			else parent.params[p] = value;

			fulltext += `<label class="text-danger">${parent.params[p]}</label><br>`;
		}
	}

	$(`#${id}`).find('div.card-text').html(fulltext);
	// since the html is going to be changed, then it shoulud be changed on the 
	// html of the data as well
	parent.html = $('#modalBody').html();
	demoflowy_closeModal();
}