
/**
 * GOOGLE APPS SCRIPT BACKEND FOR LUCKY DRAW
 * 1. Create a Google Sheet
 * 2. Create 3 tabs: "Participants", "Prizes", "Results"
 * 3. Add column headers according to instructions
 * 4. Open Extensions > Apps Script
 * 5. Paste this code and Deploy as Web App (Anyone with access)
 */

function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'getParticipants':
        result = getSheetData('Participants');
        break;
      case 'getPrizes':
        result = getSheetData('Prizes');
        break;
      case 'getResults':
        result = getSheetData('Results');
        break;
      default:
        result = { error: 'Invalid action' };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const action = e.parameter.action;
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch(err) {
    data = {};
  }
  
  let result;
  
  try {
    switch (action) {
      case 'saveResult':
        result = saveToResultsSheet(data);
        break;
      case 'resetResults':
        result = resetResultsSheet();
        break;
      default:
        result = { error: 'Invalid POST action' };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  return data.map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });
}

function saveToResultsSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Results');
  
  // result structure: time, prizeId, prizeName, participantId, name, team
  sheet.appendRow([
    data.time,
    data.prizeId,
    data.prizeName,
    data.participantId,
    data.name,
    data.team
  ]);
  
  return { success: true };
}

function resetResultsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Results');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
  sheet.clear();
  sheet.appendRow(headers[0]);
  return { success: true };
}
