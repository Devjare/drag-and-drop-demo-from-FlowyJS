// TODO: LOOK ANOTHER FORMAT FOR THE CHAINNED BOX DATA
// TODO: WHEN REARRANGE, IT ALSO SHOULD BE REARRENGED IN DATA OBJECT

var rootMoved = false;
var dataObject = {
	id: "root",
	boxid: 0,
	type: "root",
	name: "root",
	root: true,
	params: [],
	children: []
};
var data = [
{
	id: "s-1",
	name: "SERVICE 1",
	desc: `This service is in charge of doing the math behind the 
	calculus implied on the service #2 for image processing.`,
	params: ["", "", -1, false] // CONSIDERING THAT THE PARAM ARRAY HAVE SOME DEFAULT VALUES TO LATER CHANGE
},
{
	id: "s-2",
	name: "SERVICE 2",
	desc: "this is sservice does some things",
	params: [-1, true]
},
{
	id: "s-4",
	name: "SERVICE 4",
	desc: "this is sservice does some things",
	params: ["default", "", -1] 
},
{
	id: "s-5",
	name: "SERVICE 5",
	desc: "this is sservice does some things",
	params: ["default", "", -1, -1, -1] 
},
{
	id: "s-6",
	name: "SERVICE 6",
	desc: "this is sservice does some things",
	params: ["default", "", -1] 
},
{
	id: "s-7",
	name: "SERVICE 7",
	desc: "this is sservice does some things",
	params: [] 
},
{
	id: "s-8",
	name: "SERVICE 8",
	desc: "this is sservice does some things",
	params: ["default", "", -1] 
}];

$(document).ready(function(e) {

	// data contains the static values for the 'services'
	demoflowy_createBoxes(7, data);
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

		for(let i = 0;i < params.length;i++) {
			bcontent += `<strong>param[${i}]</strong>: <label class="text-danger">${params[i]}</label><br>`;
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
			params: [...params],
			children: []
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
	let params = demoflowy_lookForParent(canvasId).params;

	// Add params to modal body
	for(let i = 0;i < params.length;i++) {
		let type = typeof(params[i]);
		let name = `param[${i}]`;
		let defaultValue = params[i];

		let input;

		if (type === "string" || type === 'number') {
			input = `<div class="form-group row"><label for="${name}" class="col-sm-2 col-form-label">
			${name}</label><div class="col-sm-10 pr-4"><input id="${name}]" value="${defaultValue}" type="${type}"
			class="form-control"></div></div>`;
		} else if (type === "boolean") {
			input = `<div class="form-group row"><label for="${name}" class="col-sm-2 col-form-label">
			${name}</label><div class="col-sm-10 pr-4"><input id="${name}]" ${defaultValue ? "checked" : ""} 
			type="checkbox" class="form-control"></div></div>`;
		}

		$('#modalBody').append(input);
	}

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

	for(let j = 0;j < parent.params.length;j++) {
		let value = inputs[j].value;
		let type = inputs[j].type;

		if(type == 'checkbox') parent.params[j] = inputs[j].checked;
		else if(value === "") parent.params[j] = "";
		else if(!isNaN(value)) parent.params[j] = Number(value);
		else parent.params[j] = value;

		fulltext += `<strong>param[${j}]</strong>: <label class="text-danger">${parent.params[j]}</label><br>`;
	}
	// remove old html and update new params to box on canvas
	$(`#${id}`).find('div.card-text').html(fulltext);
	demoflowy_closeModal();
}