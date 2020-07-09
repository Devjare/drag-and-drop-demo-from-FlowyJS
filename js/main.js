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
	params: { paramnbmr: 0, paramlist: [
		{id: 'app-name-0', name: 'NOMBRE 0'}, 
		{id: 'app-name-1', name: 'NOMBRE 1'},
		{id: 'app-name-2', name: 'NOMBRE 2'}] },
	html: `<form class="container"><div class="form-group row m-2"><label for="ntype" 
	class="col-sm-2 col-form-label col-form-label-sm">Number: </label><div class="col-sm-10">
	<input id="paramnbmr" type="number" class="form-control form-control-sm" value="SoyUnInput">
	</div></div><ul id="paramlist" class="list-group"><li id="app-name-0" class="list-group-item active">Cras justo odio</li>
	<li id="app-name-1" class="list-group-item">Dapibus ac facilisis in</li><li id="app-name-2" class="list-group-item">Morbi 
	leo risus</li></ul><button id="btn" class="btn btn-sm btn-primary m-2">Button submit</button>
	</form><script type="text/javascript">document.getElementById('btn').onclick = (e) => {
		alert('button clicked!');};</script>`
	}];

	$(document).ready(function(e) {

	// data contains the static values for the 'services'
	demoflowy_createBoxes(2, data);
	// init flowy
	flowy(document.getElementById("canvas"), demoflowy_drag, demoflowy_release, 
		demoflowy_snapping, demoflowy_rearranging, 60, 60);

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
			params: params,
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
		return false; 
	}
});

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

		for(let p in parent.params) {
			let type = typeof(parent.params[p]);
			if(['string', 'number', 'boolean'].includes(type)) {
				if(type == 'boolean') $(`#modalBody #${p}`)[0].checked = parent.params[p];
				else $(`#modalBody #${p}`)[0].value = parent.params[p];
			} else {
				// REVIEW: List elements, are gonna have values at first?
				// or they will be empty at first, but then will be filled with
				// the data from the modal?
				console.log(`param: ${p}, is a list: `, $(`#modalBody #${p} li`));
				parent.params[p].forEach(el => {
					console.log('el: ', el);
					// name is just a randon var, it could be content or something else.
					console.log('li: ', $(`#modalBody #${el.id}`));
					$(`#modalBody #${el.id}`)[0].innerText = el.name;
				});
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
			children.forEach(child => {
				if (child.children.length > 0) {
					parent = demoflowy_lookForParent(parentId, child.children);
					if (parent !== null && parent !== undefined) return;
				}
			});
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
			let children = Array.from(input.childNodes)
			.filter(c => c.nodeType == Node.ELEMENT_NODE);
			console.log('UL Children: ', children);
			fulltext += `<ul class="list-group my-2">`;
			children.forEach(el => {
				let id = el.id;
				let text = el.innerHTML;
				fulltext += `<li id="${id}" class="list-group-item">${text}</li>`;
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
	demoflowy_closeModal();
}