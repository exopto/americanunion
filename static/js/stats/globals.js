export let recentEdits = [];

export let rowSelectInfo = {"mode": false, "type": ""}
export const unions_columns = ["Name", "Leader", "Reserve", "Reps.", "Military", "Land", "Members", "Other"];
export const nations_columns = ["Name", "Leader", "Wealth", "Citizens", "Military", "Location/Land", "Other"];

export function getCellInfo(cell) {
    let cellInfoList = {"ID": 0, "Table": cell.closest("section").id, "Column": ""}

    // Get column name, finds the indexOf the cell on the array of td
    const columns = (cellInfoList["Table"] === "unions") ? unions_columns : nations_columns;
    cellInfoList["Column"] = columns[Array.prototype.indexOf.call(cell.parentNode.querySelectorAll("td"), cell)];
    
    // Get row ID, finds the indexOf the row (cell.parentNode) on the array of tr, but subtract 1 for first row which is headings
    console.log(cell, cell.parentNode)
    cellInfoList["ID"] = Array.prototype.indexOf.call(cell.closest("table").querySelectorAll("tr"), cell.parentNode) - 1;

    return cellInfoList;
}

export function sendUpdatedCells({endpoint="/stats/save", method="PUT", body, originalData} = {}) {
    const recentEditKey = `${method} ${endpoint}`
    recentEdits += [recentEditKey, body] // TODO
    originalData


    dataToPass = {method: method}
    if (method != "DELETE") {
        dataToPass += {
            headers: {'Content-Type': 'application/json; charset=UTF-8'}, 
            body: body
        }
    }
    
    fetch(endpoint, dataToPass).catch((error) => {console.error('Error:', error)});
   
}
