import {sendUpdatedCells, rowSelectInfo, getCellInfo, recentEdits} from './globals.js';
import {activateDeleteOrPaintButtons, activateUndoOrRedoButtons, selectionUIMode, deleteOrPaintRows} from './actionbuttons.js';
import {createNewRow} from './newrow.js';

function editCell(event) {
    if (event.target.tagName === "TD" || event.target.tagName === "DIV") {
        let cellToEdit = event.target;
        if (event.target.className === "rep-ratio") {
            cellToEdit = event.target.parentNode;
        }
            
        // Updates ID of cell to edit
        const cellInfoList = getCellInfo(cellToEdit);

        if (!rowSelectInfo["mode"]) {
            // Creates new row if near border.
            const rect = cellToEdit.getBoundingClientRect();
            if (rect.bottom - event.clientY <= 10) {
                createNewRow(cellToEdit, "bottom");
            } else if (event.clientY - rect.top <= 10) {
                createNewRow(cellToEdit, "top");
            } else {
                x
                event.target.setAttribute("contenteditable", "plaintext-only");
                event.target.setAttribute("spellcheck", "false");
                event.target.focus();
            }    
        } else {
            deleteOrPaintRows(cellToEdit.parentNode, cellInfoList);
        }
    }
}

// Trigger row selection when delete or paint buttons pressed.
document.querySelector("#delete-repaint").addEventListener("click", activateDeleteOrPaintButtons)
document.querySelector("#undo-redo").addEventListener("click", activateUndoOrRedoButtons)

// Trigger table changes
for (const table of document.querySelectorAll("table")) {
    table.addEventListener("click", editCell);

    table.addEventListener("blur", function(event) {

        let cellToEdit = event.target
        if (event.target.className === "rep-ratio") {
            cellToEdit = event.target.parentNode;
        }

        cellToEdit.removeAttribute("contenteditable");
        cellToEdit.removeAttribute("spellcheck");
        
        sendUpdatedCells({body: {[Object.values(getCellInfo(cellToEdit)).join(" ")]: cellToEdit.textContent}});
    }, true);

    selectionUIMode(table)
}

document.querySelector("#map-upload").addEventListener('change', function (event) {
    const colonyMap = event.target.files[0];
    if (colonyMap && colonyMap.type === "image/png") {
        const colonyMapData = new FormData();
        colonyMapData.append('new-colony-map', colonyMap);

        sendUpdatedCells({endpoint: "/stats/map_upload", body: colonyMapData});

        // Update image to a blob URL so that it will show the new image without reload.
        document.querySelector("#colony-map").src = URL.createObjectURL(colonyMap);
        document.querySelector("#map-download").href = URL.createObjectURL(colonyMap);
    }
});