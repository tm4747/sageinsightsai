import { useState, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; 
import 'ag-grid-community/styles/ag-theme-alpine.css';
ModuleRegistry.registerModules([AllCommunityModule]);


const DataTable = ({criteriaItems, choiceItems}) => {


/******** CELL RENDERERS *******/
// Up and down arrow icons can be plain text or emoji, or import from an icon library
const ImportanceCellRenderer = (props) => {
  const { value, data, api } = props;

  if(data.name === "TOTAL"){
    return <span>{value}</span>;
  }

  const handleIncrement = () => {
    if (data.name === "TOTAL") return; // prevent changing the total row

    const updatedImportance = value + 1;
    data.importance = updatedImportance;

    // update related choiceXRating fields
    Object.keys(data).forEach(key => {
      if (key.endsWith("Rating") && key !== "importance") {
        const choiceIndex = key.match(/choice(\d+)Rating/);
        if (choiceIndex) {
          const choiceField = `choice${choiceIndex[1]}`;
          const initialRating = data[choiceField];
          data[key] = initialRating * updatedImportance;
        }
      }
    });

    // update rowData in the grid
    api.applyTransaction({ update: [data] });
  };

  const handleDecrement = () => {
    if (data.name === "TOTAL") return; // prevent changing the total row
    if (value <= 1) return; // min value of 1

    const updatedImportance = value - 1;
    data.importance = updatedImportance;

    // update related choiceXRating fields
    Object.keys(data).forEach(key => {
      if (key.endsWith("Rating") && key !== "importance") {
        const choiceIndex = key.match(/choice(\d+)Rating/);
        if (choiceIndex) {
          const choiceField = `choice${choiceIndex[1]}`;
          const initialRating = data[choiceField];
          data[key] = initialRating * updatedImportance;
        }
      }
    });

    // update rowData in the grid
    api.applyTransaction({ update: [data] });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>{value}</span>
      <div>
        <span style={{ cursor: 'pointer' }} onClick={handleIncrement}>▲</span>
        <span style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={handleDecrement}>▼</span>
      </div>
    </div>
  );
};

const [rowData, setRowData] = useState([]);
const [colDefs, setColDefs] = useState([
    { field: "name", headerName: "Criterion" },
    { field: "importance", headerName: "Importance", cellRenderer: ImportanceCellRenderer}
  ]);



  /********* USE EFFECTS & API CALLS **********/
  useEffect(() => {
  if (criteriaItems.length === 0) {
    setRowData([]);
    return;
  }

  // 1️⃣ Build column definitions: static columns
  const updatedColDefs = [
    { field: "name", headerName: "Criterion" },
    { field: "importance", headerName: "Importance", cellRenderer: ImportanceCellRenderer }
  ];

  // 2️⃣ Add choice columns and rating columns
  choiceItems.forEach((choice, index) => {
    updatedColDefs.push({
      field: `choice${index + 1}`,
      headerName: `${choice.name}`
    });
    updatedColDefs.push({
      field: `choice${index + 1}Rating`,
      headerName: "Rating"
    });
  });

  setColDefs(updatedColDefs);

  // 3️⃣ Build normal row data
  const rows = criteriaItems.map(criterion => {
    const criterionValue = criterion.sliderValue;
    const row = {
      name: criterion.name,
      importance: criterionValue
    };

    choiceItems.forEach((choice, index) => {
      const initialRating = 5;
      row[`choice${index + 1}`] = initialRating; // default rating
      // what we need here is the initialRating * this row's importance value
      row[`choice${index + 1}Rating`] = initialRating * criterionValue; 
    });

    return row;
  });

  // 4️⃣ Calculate totals
  let totalImportance = 0;
  const totalRatings = {}; // e.g., { choice1Rating: 0, choice2Rating: 0 }

  rows.forEach(row => {
    totalImportance += Number(row.importance) || 0;

    choiceItems.forEach((choice, index) => {
      const key = `choice${index + 1}Rating`;
      totalRatings[key] = (totalRatings[key] || 0) + (Number(row[key]) || 0);
    });
  });

  // 5️⃣ Create totals row
  const totalsRow = {
    name: "TOTAL",
    importance: totalImportance
  };

  choiceItems.forEach((_, index) => {
    const ratingKey = `choice${index + 1}Rating`;
    totalsRow[`choice${index + 1}`] = ""; // no total for choice name column
    totalsRow[ratingKey] = totalRatings[ratingKey];
  });

  // 6️⃣ Add totals row to the end
  rows.push(totalsRow);

  setRowData(rows);

}, [criteriaItems, choiceItems]);



  const defaultColDef = {
    flex: 1,
  };

  const rowStyles = params => {
              if (params.data?.name === 'TOTAL') {
                return { fontWeight: 'bold', backgroundColor: '#f0f0f0' };
              }
              return {};
            }




  return(
    <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            getRowStyle={rowStyles}
        />
    </div>
  )

}

export default DataTable;