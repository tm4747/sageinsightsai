import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; 
import 'ag-grid-community/styles/ag-theme-alpine.css';
ModuleRegistry.registerModules([AllCommunityModule]);


const DataTable = ({rowData, colDefs}) => {

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