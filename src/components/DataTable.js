import { useState, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; 
import 'ag-grid-community/styles/ag-theme-alpine.css';
ModuleRegistry.registerModules([AllCommunityModule]);


const DataTable = ({criteriaItems, choiceItems}) => {

  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
      { field: "name" },
      { field: "description" },
      { field: "value" }
    ]);


  /********* USE EFFECTS & API CALLS **********/
  useEffect(() => {
    // Only update if there is at least one criterion
    if (criteriaItems.length === 0) {
      setRowData([]);
      return;
    }
  
    // 1️⃣ Build column definitions: start with static columns
    const updatedColDefs = [
      { field: "name", headerName: "Criterion" },
      // { field: "description", headerName: "Description" },
      { field: "importance", headerName: "Importance" }
    ];
  
    // 2️⃣ Add a column for each choice
    choiceItems.forEach((choice, index) => {
      updatedColDefs.push({
        field: `choice${index + 1}`,
        headerName: `choice${index + 1}` + choice.name
      });
      updatedColDefs.push({
        field: `choice${index + 1}Rating`,
        headerName: "Rating"
      });
    });
  
    setColDefs(updatedColDefs);
  
    // 3️⃣ Build row data
    const updatedRowData = criteriaItems.map(criterion => {
      // Start with the criterion's data
      const row = {
        name: criterion.name,
        // description: criterion.description,
        importance: criterion.sliderValue
      };
  
      console.log('choiceItems', choiceItems)
      // For each choice, initialize as empty or a default
      // Add choice1, choice2, etc., with the choice name as the cell value
      choiceItems.forEach((choice, index) => {
        row[`choice${index + 1}`] = choice.name;
        row[`choice${index + 1}Rating`] = 5;
  
      });
  
      return row;
    });
  
    setRowData(updatedRowData);
  
  }, [criteriaItems, choiceItems]);


  const defaultColDef = {
    flex: 1,
  };


  return(
    <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
        />
    </div>
  )

}

export default DataTable;